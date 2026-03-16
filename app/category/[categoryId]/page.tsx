import CategoryPageUI from "@/components/ui/pages/CategoryPage";
import { APP_URL } from "@/lib/constants/env";
import dbConnect from "@/lib/db/mongodb";
import { Metadata } from "next";
import Category from "@/lib/db/models/category";
import Job from "@/lib/db/models/job";

export interface CategoryPageProps {
	params: Promise<{
		categoryId: string;
	}>;
}

const CategoryPage = async ({ params }: CategoryPageProps) => {
	const { categoryId } = await params;

	await dbConnect();

	const category = await Category.findOne({ _id: categoryId }).lean();

	if (!category) return <div>Category not found</div>;

	const jobs = await Job.find({ categoryId: category._id }).sort({ postedAt: -1 }).limit(50).populate("categoryId", "name slug").lean();

	const structuredData = {
		"@context": "https://schema.org",
		"@type": "ItemList",
		name: `${category.name} Jobs`,
		itemListElement: jobs.map((job, index) => ({
			"@type": "ListItem",
			position: index + 1,
			url: `${APP_URL}/jobs/${job.slug}`,
		})),
	};

	return (
		<>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(structuredData),
				}}
			/>
			<CategoryPageUI categoryId={categoryId} />;
		</>
	);
};
export default CategoryPage;

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
	const { categoryId } = await params;

	await dbConnect();

	const category = await Category.findOne({
		_id: categoryId,
	})
		.select("name slug")
		.lean();

	if (!category) {
		return {
			title: "Category not found | MyJobFeed",
		};
	}

	return {
		title: `${category.name} Jobs | MyJobFeed`,
		description: `Browse latest ${category.name.toLowerCase()} jobs from top companies.`,
		alternates: {
			canonical: `${APP_URL}/category/${category.slug}`,
		},
		openGraph: {
			title: `${category.name} Jobs | MyJobFeed`,
			description: `Find the latest ${category.name.toLowerCase()} jobs.`,
			url: `${APP_URL}/category/${category.slug}`,
		},
	};
}
