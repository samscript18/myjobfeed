import Job from "@/lib/db/models/job";
import dbConnect from "@/lib/db/mongodb";
import Category from "@/lib/db/models/category";
import { ruleBasedCategorize } from "@/lib/utils/categorizeJob";
import { NextResponse } from "next/server";
import { BATCH_SIZE } from "@/lib/utils";
import { NormalizedJob } from "@/lib/interfaces/job.interface";
import { fetchArbeitnow, fetchFindwork, fetchJobDataAfrica, fetchJobDataNigeria, fetchJobicy, fetchJooble, fetchRemotive, fetchTheMuse } from "@/lib/services/job.service";
import { batchCategorizeAI, buildUpsertOp } from "@/lib/helpers";
import { DEFAULT_CATEGORIES, seedCategories } from "@/lib/db/seed";

export async function GET() {
	console.log("[SYNC] Starting job sync...");

	try {
		await dbConnect();
		let categories = await Category.find().select("_id slug").lean();
		const existingSlugs = new Set(categories.map((category) => category.slug));
		if (DEFAULT_CATEGORIES.some((category) => !existingSlugs.has(category.slug))) {
			console.log("[SYNC] Seeding missing categories");
			await seedCategories();
			categories = await Category.find().select("_id slug").lean();
		}
		const categoryMap = new Map(categories.map((c) => [c.slug, c]));
		const fallbackCategory = categoryMap.get("technology");
		if (!fallbackCategory?._id) {
			throw new Error("Sync requires the technology fallback category; category initialization failed");
		}

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

		let aiAvailable = true;
		let fallbackCount = 0;
		for (let i = 0; i < toProcessAI.length; i += BATCH_SIZE) {
			const batch = toProcessAI.slice(i, i + BATCH_SIZE);
			const aiResults = aiAvailable ? await batchCategorizeAI(batch) : [];
			if (aiAvailable && !aiResults.some((slug) => slug !== null)) {
				aiAvailable = false;
				console.warn("[SYNC] AI classification unavailable; using fallback for remaining jobs");
			}
			for (let j = 0; j < batch.length; j++) {
				const { job } = batch[j];
				const categorySlug = aiResults[j];
				const matchedCategory = categorySlug ? categoryMap.get(categorySlug) : undefined;
				if (!matchedCategory) fallbackCount++;
				const category = matchedCategory || fallbackCategory;
				ops.push(buildUpsertOp(job, category._id));
			}
		}
		if (fallbackCount > 0) console.warn(`[SYNC] Used technology fallback for ${fallbackCount} jobs`);

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
