import dbConnect from "@/lib/db/mongodb";
import Job from "@/lib/db/models/job";
import { resolvePaginationQuery } from "@/lib/helpers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ locationSlug: string }> }) {
	await dbConnect();

	const { locationSlug } = await params;

	try {
		const { searchParams } = new URL(req.url);

		const queryPage = searchParams.get("page") || 1;
		const queryLimit = searchParams.get("limit") || 50;

		const filter = {
			locationSlug,
		};

		const count = await Job.countDocuments(filter);

		const { skip, page, totalPages, limit } = resolvePaginationQuery({
			page: queryPage,
			limit: queryLimit,
			count,
		});

		const jobs = await Job.find(filter).sort({ postedAt: -1 }).skip(skip).limit(limit).populate("categoryId", "name").lean();

		return NextResponse.json({
			success: true,
			message: "Location jobs fetched successfully",
			data: jobs,
			meta: {
				count,
				page,
				totalPages,
				limit,
			},
		});
	} catch (err) {
		console.error("[Location Jobs GET] Error:", err);

		return NextResponse.json({
			success: false,
			error: "Failed to fetch location jobs",
		});
	}
}
