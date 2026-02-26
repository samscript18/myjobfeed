import Job from '@/lib/db/models/job';
import dbConnect from '@/lib/db/mongodb';
import Category from '@/lib/db/models/category';
import { GoogleGenAI } from '@google/genai';
import { ruleBasedCategorize } from '@/lib/utils/categorizeJob';
import { NextResponse } from 'next/server';
import { BATCH_SIZE, fetchWithTimeout, TECH_KEYWORDS } from '@/lib/utils';
import { ArbeitnowJob, JobicyJob, JoobleJob, StandardizedJob, TheMuseJob } from '@/lib/interfaces';
import { arbeitnowApiUrl, jobicyApiUrl, joobleApiKey, joobleApiUrl, museApiKey, museApiUrl } from '@/lib/constants/env';

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY! });

function buildUpsertOp(job: StandardizedJob, categoryId: string) {
	return {
		updateOne: {
			filter: { sourceId: job.sourceId || job.url },
			update: {
				$set: {
					title: job.title,
					description: job.description,
					location: job.location || 'Remote',
					url: job.url,
					company: job.company || '',
					companyLogo: job.companyLogo || '',
					level: job.level || 'Not Specified',
					categoryId,
					postedAt: job.postedAt ? new Date(job.postedAt) : new Date(),
					source: job.source,
					lastSyncedAt: new Date(),
				},
			},
			upsert: true,
		},
	};
}

async function batchCategorizeAI(
	batch: { title: string; description: string; job: StandardizedJob }[],
) {
	const prompt = `
Classify each job into ONE of these slugs:
technology, marketing, healthcare, finance, engineering, sales, design, education

Return ONLY an array of slugs in JSON. No extra text.

Jobs:
${batch.map((j) => `Title: ${j.title}\nDescription: ${j.description?.slice(0, 500)}`).join('\n\n')}
`;
	try {
		const response = await ai.models.generateContent({
			model: 'gemini-1.5-flash',
			contents: prompt,
		});
		const result = JSON.parse(response.text!);
		if (!Array.isArray(result) || result.length !== batch.length) {
			console.warn('[AI] Unexpected batch AI result, defaulting to technology');
			return batch.map(() => 'technology');
		}
		return result.map((r: string) => r.toLowerCase());
	} catch (error) {
		console.error('[AI] Batch classification failed:', error);
		return batch.map(() => 'technology');
	}
}

async function fetchArbeitnow() {
	const res = await fetchWithTimeout(`${arbeitnowApiUrl}/job-board-api`);
	const { data } = await res.json();
	return data.map((job: ArbeitnowJob) => ({
		title: job.title,
		description: job.description,
		company: job.company_name,
		location: job.location,
		url: job.url,
		postedAt: new Date(job.created_at * 1000),
		source: 'arbeitnow',
		sourceId: `arbeit-${job.slug}`,
	}));
}

async function fetchTheMuse() {
	const res = await fetchWithTimeout(
		`${museApiUrl}/public/jobs?api_key=${museApiKey}&page=1&descending=true`,
	);
	const { results } = await res.json();
	return results.map((job: TheMuseJob) => ({
		title: job.name,
		description: job.contents || '',
		company: job.company.name,
		location: job.locations[0]?.name || 'Remote',
		url: job.refs.landing_page,
		postedAt: new Date(job.publication_date),
		source: 'themuse',
		sourceId: `muse-${job.id}`,
	}));
}

async function fetchJobicy() {
	const res = await fetchWithTimeout(`${jobicyApiUrl}/remote-jobs?count=100`);
	const data = await res.json();
	const jobs = data.jobs || [];
	return jobs.map((job: JobicyJob) => ({
		title: job.jobTitle.replace(/<[^>]*>/g, ''),
		description: job.jobDescription?.replace(/<[^>]*>/g, '').slice(0, 800),
		company: job.companyName,
		companyLogo: job.companyLogo,
		location: job.jobGeo || 'Remote',
		level: job.jobLevel,
		postedAt: new Date(job.pubDate),
		source: 'jobicy',
		sourceId: `jobicy-${job.id}`,
	}));
}

async function fetchJooble() {
	const res = await fetchWithTimeout(`${joobleApiUrl}/${joobleApiKey}`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ keywords: TECH_KEYWORDS, location: 'Nigeria', page: 1 }),
	});
	if (!res.ok) throw new Error(`Jooble API error ${res.status}`);
	const data = await res.json();
	const jobs = data.jobs || [];
	return jobs.map((job: JoobleJob) => ({
		title: job.title,
		description: job.snippet?.replace(/<[^>]*>/g, '').slice(0, 800),
		company: job.company,
		location: job.location || 'Remote',
		url: job.link,
		postedAt: new Date(job.updated || Date.now()),
		source: 'jooble',
		sourceId: `jooble-${job.id}`,
	}));
}

export async function GET(req: Request) {
	const authHeader = req.headers.get('authorization');
	if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
		return new Response('Unauthorized', { status: 401 });
	}

	await dbConnect();
	console.log('[SYNC] Starting job sync...');

	try {
		const categories = await Category.find();
		const categoryMap = new Map(categories.map((c) => [c.slug, c]));

		const [arbeitJobs, museJobs, jobicyJobs, joobleJobs] = await Promise.all([
			fetchArbeitnow(),
			fetchTheMuse(),
			fetchJobicy(),
			fetchJooble(),
		]);

		let allJobs = [...arbeitJobs, ...museJobs, ...jobicyJobs, ...joobleJobs];
		console.log(`[SYNC] Total fetched jobs: ${allJobs.length}`);

		const seenUrls = new Set();
		allJobs = allJobs.filter((job) => {
			if (!job.url || seenUrls.has(job.url)) return false;
			seenUrls.add(job.url);
			return true;
		});
		console.log(`[SYNC] Deduplicated jobs: ${allJobs.length}`);

		const ops: ReturnType<typeof buildUpsertOp>[] = [];
		const toProcessAI: { title: string; description: string; job: StandardizedJob }[] = [];

		for (const job of allJobs) {
			const cleanDescription = job.description || '';
			const categorySlug = ruleBasedCategorize(job.title, cleanDescription) || null;
			if (!categorySlug || !categoryMap.has(categorySlug)) {
				toProcessAI.push({ title: job.title, description: cleanDescription, job });
			} else {
				ops.push(buildUpsertOp(job, categoryMap.get(categorySlug)!._id));
			}
		}

		for (let i = 0; i < toProcessAI.length; i += BATCH_SIZE) {
			const batch = toProcessAI.slice(i, i + BATCH_SIZE);
			const aiResults = await batchCategorizeAI(batch);
			for (let j = 0; j < batch.length; j++) {
				const { job } = batch[j];
				const categorySlug = aiResults[j];
				const category = categoryMap.get(categorySlug) || categoryMap.get('technology')!;
				ops.push(buildUpsertOp(job, category._id));
			}
		}

		if (ops.length > 0) {
			await Job.bulkWrite(ops);
			console.log(`[SYNC] Upserted ${ops.length} jobs`);
		}

		const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
		const deleted = await Job.deleteMany({ postedAt: { $lt: thirtyDaysAgo } });
		console.log(`[SYNC] Deleted ${deleted.deletedCount} old jobs`);

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error('[SYNC] Sync failed:', error);
		return NextResponse.json({ error: String(error) }, { status: 500 });
	}
}
