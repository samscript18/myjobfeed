import dbConnect from "@/lib/db/mongodb";
import { NextRequest, NextResponse } from "next/server";
import Category from "@/lib/db/models/category";

export async function GET(req: NextRequest, { params }: { params: Promise<{ categoryId: string }> }) {
	await dbConnect();
	const { categoryId } = await params;

	try {
		const category = await Category.findOne({ _id: categoryId }).select("_id name slug description").lean();
		if (!category) return NextResponse.json({ success: false, error: "Category not found" });
		return NextResponse.json({
			success: true,
			message: "Category retrieved successfully",
			data: category,
		});
	} catch (err) {
		console.error("[Category GET] Error:", err);
		return NextResponse.json({ success: false, error: "Failed to fetch category" });
	}
}
