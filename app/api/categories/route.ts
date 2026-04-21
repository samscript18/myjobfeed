import dbConnect from "@/lib/db/mongodb";
import Category from "@/lib/db/models/category";
import { NextResponse } from "next/server";
import Job from "@/lib/db/models/job";

export async function GET() {
	await dbConnect();

	try {
		const [categories, counts] = await Promise.all([Category.find().sort({ name: 1 }).lean(), Job.aggregate([{ $group: { _id: "$categoryId", jobCount: { $sum: 1 } } }])]);

		const countMap = new Map(counts.map((item) => [String(item._id), item.jobCount]));

		const updatedCategories = categories.map((category) => ({
			_id: category._id,
			name: category.name,
			slug: category.slug,
			description: category.description,
			jobCount: countMap.get(String(category._id)) || 0,
		}));

		return NextResponse.json({
			success: true,
			messaage: "Categories fetched successfully",
			data: updatedCategories,
		});
	} catch (err) {
		console.error("[Categories GET] Error:", err);
		return NextResponse.json({ success: false, error: "Failed to fetch categories" });
	}
}
