import dbConnect from "@/lib/db/mongodb";
import Job from "@/lib/db/models/job";
import { NextResponse } from "next/server";

export async function GET() {
	await dbConnect();

	try {
		const locations = await Job.aggregate([
			{
				$group: {
					_id: "$location",
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
			message: "Locations fetched successfully",
			data: locations,
		});
	} catch (err) {
		console.error("[Locations GET] Error:", err);

		return NextResponse.json({
			success: false,
			error: "Failed to fetch locations",
		});
	}
}
