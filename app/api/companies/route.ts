import dbConnect from "@/lib/db/mongodb";
import Job from "@/lib/db/models/job";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
	await dbConnect();

	try {
		const companies = await Job.aggregate([
			{
				$group: {
					_id: "$company",
					jobCount: { $sum: 1 },
				},
			},
			{
				$project: {
					name: "$_id",
					slug: {
						$toLower: {
							$replaceAll: {
								input: "$_id",
								find: " ",
								replacement: "-",
							},
						},
					},
					jobCount: 1,
					_id: 0,
				},
			},
			{ $sort: { jobCount: -1 } },
		]);

		return NextResponse.json({
			success: true,
			message: "Companies fetched successfully",
			data: companies,
		});
	} catch (err) {
		console.error("[Companies GET] Error:", err);

		return NextResponse.json(
			{
				success: false,
				error: "Failed to fetch companies",
			},
			{ status: 500 },
		);
	}
}
