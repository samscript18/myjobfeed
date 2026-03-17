import Job from "@/lib/db/models/job";
import dbConnect from "@/lib/db/mongodb";
import { CreateJobDto } from "@/lib/dtos/job.dto";
import { resolvePaginationQuery } from "@/lib/helpers";
import { IJob } from "@/lib/interfaces/job.interface";
import { createBasicSlug, createSlug } from "@/lib/utils";
import { CreateJobSchema } from "@/lib/validator";
import { QueryFilter } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
	await dbConnect();

	try {
		const { searchParams } = new URL(req.url);

		const keyword = searchParams.get("keyword");
		const location = searchParams.get("location");
		const categoryId = searchParams.get("categoryId");
		const level = searchParams.get("level");
		const datePosted = searchParams.get("datePosted");
		const queryPage = searchParams.get("page") || 1;
		const queryLimit = searchParams.get("limit") || 50;

		const filter: QueryFilter<IJob> = {};

		if (keyword)
			filter.$or = [
				{
					title: {
						$regex: keyword,
						$options: "i",
					},
				},
				{
					description: {
						$regex: keyword,
						$options: "i",
					},
				},
				{
					company: {
						$regex: keyword,
						$options: "i",
					},
				},
				{
					slug: {
						$regex: keyword,
						$options: "i",
					},
				},
			];
		if (location)
			filter.location = {
				$regex: location,
				$options: "i",
			};
		if (categoryId) filter.categoryId = categoryId;
		if (level) filter.level = level;
		if (datePosted) {
			const days = parseInt(datePosted as string, 10);
			if (!isNaN(days)) {
				const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
				filter.postedAt = { $gte: cutoff };
			}
		}

		const count = await Job.countDocuments(filter);

		const { skip, page, totalPages, limit } = resolvePaginationQuery({
			page: queryPage,
			limit: queryLimit,
			count,
		});

		const jobs = await Job.find(filter)
			.sort({ postedAt: -1 })
			.skip(skip)
			.limit(limit)
			.populate({
				path: "categoryId",
				select: "name",
			})
			.lean();

		return NextResponse.json(
			{
				success: true,
				message: "Jobs fetched successfully",
				data: jobs,
				meta: {
					count,
					page,
					totalPages,
					limit,
				},
			},
			{ status: 200 },
		);
	} catch (err) {
		console.error("[Jobs GET] Error:", err);
		return NextResponse.json({ success: false, error: "Failed to fetch jobs" }, { status: 500 });
	}
}

export async function POST(req: NextRequest) {
	await dbConnect();

	try {
		const body: CreateJobDto = await req.json();
		const { title, description, company, url, location, categoryId, level, type, salaryRange } = CreateJobSchema.parse(body);

		const slug = createSlug(title, company);
		const companySlug = createBasicSlug(company);
		const locationSlug = createBasicSlug(location);
		const newJob = await Job.create({
			sourceId: `myjobfeed-${Date.now()}`,
			slug,
			title,
			company,
			companySlug,
			location,
			locationSlug,
			categoryId,
			level,
			type,
			description,
			url,
			salaryRange,
			postedAt: new Date(),
		});

		return NextResponse.json({
			success: true,
			message: "Job created successfully",
			data: newJob,
		});
	} catch (err) {
		console.error("[Job POST] Error:", err);
		return NextResponse.json({
			success: false,
			error: "Failed to create job",
		});
	}
}
