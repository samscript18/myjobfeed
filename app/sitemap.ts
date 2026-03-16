import { APP_URL } from "@/lib/constants/env";
import Category from "@/lib/db/models/category";
import Job from "@/lib/db/models/job";
import dbConnect from "@/lib/db/mongodb";

export default async function sitemap() {
	await dbConnect();

	const jobs = await Job.find();
	const categories = await Category.find().select("slug");

	const jobUrls = jobs.map((job) => ({
		url: `${APP_URL}/jobs/${job.slug}`,
		lastModified: job.updatedAt,
	}));

	const categoryUrls = categories.map((category) => ({
		url: `${APP_URL}/category/${category.slug}`,
		lastModified: new Date(),
	}));

	return [
		{
			url: `${APP_URL}`,
			lastModified: new Date(),
		},
		...jobUrls,
		...categoryUrls,
	];
}
