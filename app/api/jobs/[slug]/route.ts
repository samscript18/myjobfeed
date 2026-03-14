import dbConnect from "@/lib/db/mongodb";
import Job from "@/lib/db/models/job";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
	req: NextRequest,
	{ params }: { params: Promise<{ slug: string }> },
) {
	await dbConnect();
	const { slug } = await params;

	try {
		const job = await Job.findOne({
			slug: slug as string,
		}).populate("categoryId", "name slug");
		if (!job)
			return NextResponse.json({
				success: false,
				error: "Job not found",
			});
		return NextResponse.json({
			success: true,
			message: "Job retrieved successfully",
			data: job,
		});
	} catch (err) {
		console.error("[Job GET] Error:", err);
		return NextResponse.json({
			success: false,
			error: "Failed to fetch job",
		});
	}
}
