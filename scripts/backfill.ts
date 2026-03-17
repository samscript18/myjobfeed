import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

import dbConnect from "../lib/db/mongodb";
import Job from "../lib/db/models/job";
import { createBasicSlug } from "../lib/utils";

const backfillLocationSlugs = async () => {
	const jobs = await Job.find({
		location: { $exists: true, $ne: null },
		locationSlug: { $exists: false },
	}).lean();

	console.log(`Found ${jobs.length} jobs to update`);

	for (const job of jobs) {
		const locationSlug = createBasicSlug(job.location);

		await Job.updateOne({ _id: job._id }, { $set: { locationSlug } });
	}

	console.log("✅ Location slugs backfill complete");
};

const backfillCompaniesSlugs = async () => {
	const jobs = await Job.find({
		company: { $exists: true, $ne: null },
		companySlug: { $exists: false },
	}).lean();

	console.log(`Found ${jobs.length} jobs to update`);

	for (const job of jobs) {
		const companySlug = createBasicSlug(job.company);

		await Job.updateOne({ _id: job._id }, { $set: { companySlug } });
	}

	console.log("✅ Company slugs backfill complete");
};

async function run() {
	await dbConnect();

	await backfillLocationSlugs();

	await backfillCompaniesSlugs();

	process.exit(0);
}

run().catch((err) => {
	console.error(err);
	process.exit(1);
});
