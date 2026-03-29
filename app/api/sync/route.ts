import Job from "@/lib/db/models/job";
import dbConnect from "@/lib/db/mongodb";
import Category from "@/lib/db/models/category";
import { ruleBasedCategorize } from "@/lib/utils/categorizeJob";
import { NextResponse } from "next/server";
import { BATCH_SIZE } from "@/lib/utils";
import { NormalizedJob } from "@/lib/interfaces/job.interface";
import { fetchArbeitnow, fetchFindwork, fetchJobDataAfrica, fetchJobDataNigeria, fetchJobicy, fetchJooble, fetchRemotive, fetchTheMuse } from "@/lib/services/job.service";
import { batchCategorizeAI, buildUpsertOp } from "@/lib/helpers";

export async function GET() {
	await dbConnect();
	console.log("[SYNC] Starting job sync...");

	try {
		const categories = await Category.find();
		const categoryMap = new Map(categories.map((c) => [c.slug, c]));

		const [arbeitJobs, museJobs, jobicyJobs, joobleJobs, findWorkJobs, remotiveJobs, jobDataAfricaJobs, jobDataNigeriaJobs] = await Promise.all([
			fetchArbeitnow(),
			fetchTheMuse(),
			fetchJobicy(),
			fetchJooble(),
			fetchFindwork(),
			fetchRemotive(),
			fetchJobDataAfrica(),
			fetchJobDataNigeria(),
		]);

		console.log(
			`[SYNC] Fetched jobs - Arbeitnow: ${arbeitJobs.length}, The Muse: ${museJobs.length}, Jobicy: ${jobicyJobs.length}, Jooble: ${joobleJobs.length}, Findwork: ${findWorkJobs.length}, Remotive: ${remotiveJobs.length}, JobData Africa: ${jobDataAfricaJobs.length}, JobData Nigeria: ${jobDataNigeriaJobs.length}`,
		);

		const normalizedJobs: NormalizedJob[] = [...arbeitJobs, ...museJobs, ...jobicyJobs, ...joobleJobs, ...findWorkJobs, ...remotiveJobs, ...jobDataAfricaJobs, ...jobDataNigeriaJobs];
		console.log(`[SYNC] Total fetched jobs: ${normalizedJobs.length}`);

		const seen = new Set<string>();

		const uniqueJobs = normalizedJobs.filter((job) => {
			const key = `${job.company}-${job.title}-${job.location}`.toLowerCase().trim();

			if (seen.has(key)) return false;

			seen.add(key);
			return true;
		});
		console.log(`[SYNC] Deduplicated jobs: ${uniqueJobs.length}`);

		const cleanJobs = uniqueJobs.filter((job) => {
			const valid = job.title.trim() && job.company.trim() && job.url.trim() && job.slug.trim();

			if (!valid) {
				console.log("[SYNC] Invalid job filtered:", job.title);
			}

			return valid;
		});

		console.log(`[SYNC] Valid jobs after filtering: ${cleanJobs.length}`);

		const ops: ReturnType<typeof buildUpsertOp>[] = [];
		const toProcessAI: {
			title: string;
			description: string;
			job: NormalizedJob;
		}[] = [];

		for (const job of cleanJobs) {
			const cleanDescription = job.description || "";
			const categorySlug = ruleBasedCategorize(job.title, cleanDescription) || null;
			if (!categorySlug || !categoryMap.has(categorySlug)) {
				toProcessAI.push({
					title: job.title,
					description: cleanDescription.slice(0, 800),
					job,
				});
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
				const category = categoryMap.get(categorySlug) || categoryMap.get("technology")!;
				ops.push(buildUpsertOp(job, category._id));
			}
		}

		if (ops.length > 0) {
			const data = await Job.bulkWrite(ops);
			console.log(`[SYNC] Upserted ${data.upsertedCount} new jobs, Modified ${data.modifiedCount} existing jobs`);
		}

		const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
		const deleted = await Job.deleteMany({
			postedAt: { $lt: thirtyDaysAgo },
		});
		console.log(`[SYNC] Deleted ${deleted.deletedCount} old jobs`);

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("[SYNC] Sync failed:", error);
		return NextResponse.json({ error: String(error) }, { status: 500 });
	}
}
