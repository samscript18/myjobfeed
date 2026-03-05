import { GoogleGenAI } from '@google/genai';
import { ResolvedPagination, ResolvePaginationQuery } from '../interfaces/pagination.interface';
import { ArbeitnowJob, JobicyJob, JoobleJob, StandardizedJob, TheMuseJob } from '../interfaces/job.interface';
import { googleApiKey } from '../constants/env';

export function resolvePaginationQuery(query: ResolvePaginationQuery): ResolvedPagination {
	const page = Math.max(Number(query.page) || 1, 1);

	let limit = query.limit !== undefined && query.limit !== null ? Number(query.limit) : 20;

	if (limit < 0) limit = 10;

	if (limit === 0) {
		limit = query.count === 0 ? 1 : query.count;
	}

	const skip = (page - 1) * limit;
	const totalPages = limit > 0 ? Math.ceil(query.count / limit) : 1;

	return {
		skip,
		page,
		limit,
		totalPages,
		count: query.count,
	};
}

const ai = new GoogleGenAI({ apiKey: googleApiKey });

export function buildUpsertOp(job: StandardizedJob, categoryId: string) {
	return {
		updateOne: {
			filter: { sourceId: job.sourceId || job.url },
			update: {
				$set: {
					title: job.title,
					description: job.description,
					location: job.location || 'Remote',
					url: job.url || job,
					slug: job.slug,
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

export async function batchCategorizeAI(
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
			model: 'gemini-3-flash-preview',
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

export function standardizeArbeit(job: ArbeitnowJob): StandardizedJob {
	return {
		title: job.title,
		description: job.description,
		company: job.company_name,
		location: job.location,
		url: job.url,
		postedAt: new Date(job.created_at * 1000),
		source: 'arbeitnow',
		sourceId: job.slug,
		slug: job.slug,
	};
}

export function standardizeMuse(job: TheMuseJob): StandardizedJob {
	return {
		title: job.name,
		description: job.contents,
		company: job.company?.name,
		location: job.locations?.[0]?.name,
		url: job.refs?.landing_page,
		level: job.levels?.[0]?.name,
		postedAt: new Date(job.publication_date),
		source: 'themuse',
		sourceId: String(job.id),
		slug: `themuse-${job.id}`,
	};
}

export function standardizeJobicy(job: JobicyJob): StandardizedJob {
	return {
		title: job.jobTitle,
		description: job.jobDescription,
		company: job.companyName,
		location: job.jobGeo,
		url: job.url,
		level: job.jobLevel,
		companyLogo: job.companyLogo,
		postedAt: new Date(job.pubDate),
		source: 'jobicy',
		sourceId: String(job.id),
		slug: job.jobSlug,
	};
}

export function standardizeJooble(job: JoobleJob): StandardizedJob {
	return {
		title: job.title,
		description: job.snippet,
		company: job.company,
		location: job.location,
		url: job.link,
		postedAt: job.updated ? new Date(job.updated) : undefined,
		source: 'jooble',
		sourceId: job.id,
		slug: `jooble-${job.id}`,
	};
}