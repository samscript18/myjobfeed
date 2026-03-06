import Job from '@/lib/db/models/job';
import dbConnect from '@/lib/db/mongodb';
import Category from '@/lib/db/models/category';
import { ruleBasedCategorize } from '@/lib/utils/categorizeJob';
import { NextResponse } from 'next/server';
import { BATCH_SIZE } from '@/lib/utils';
import { StandardizedJob } from '@/lib/interfaces/job.interface';
import { fetchArbeitnow, fetchJobicy, fetchJooble, fetchTheMuse } from '@/lib/services/job.service';
import {
	batchCategorizeAI,
	buildUpsertOp,
	standardizeArbeit,
	standardizeJobicy,
	standardizeJooble,
	standardizeMuse,
} from '@/lib/helpers';

export async function GET() {
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

		console.log(
			`[SYNC] Fetched jobs - Arbeitnow: ${arbeitJobs.length}, The Muse: ${museJobs.length}, Jobicy: ${jobicyJobs.length}, Jooble: ${joobleJobs.length}`,
		);

		const standardizedJobs: StandardizedJob[] = [
			...arbeitJobs.map(standardizeArbeit),
			...museJobs.map(standardizeMuse),
			...jobicyJobs.map(standardizeJobicy),
			...joobleJobs.map(standardizeJooble),
		];
		console.log(`[SYNC] Total fetched jobs: ${standardizedJobs.length}`);

		const seen = new Set<string>();

		const uniqueJobs = standardizedJobs.filter((job) => {
			const key = `${job.company?.toLowerCase()}-${job.title?.toLowerCase()}-${job.location?.toLowerCase()}`;

			if (seen.has(key)) return false;

			seen.add(key);
			return true;
		});
		console.log(`[SYNC] Deduplicated jobs: ${uniqueJobs.length}`);

		const ops: ReturnType<typeof buildUpsertOp>[] = [];
		const toProcessAI: { title: string; description: string; job: StandardizedJob }[] = [];

		for (const job of uniqueJobs) {
			const cleanDescription = job.description || '';
			const categorySlug = ruleBasedCategorize(job.title, cleanDescription) || null;
			if (!categorySlug || !categoryMap.has(categorySlug)) {
				toProcessAI.push({ title: job.title, description: cleanDescription, job });
			} else {
				if (!job.title || !job.company || !job.url) {
					console.log('[SYNC] Invalid job skipped:', job);
					continue;
				}
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
			const data = await Job.bulkWrite(ops);
			console.log(
				`[SYNC] Upserted ${data.upsertedCount} new jobs, Modified ${data.modifiedCount} existing jobs`,
			);
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
