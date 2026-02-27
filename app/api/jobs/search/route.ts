import dbConnect from '@/lib/db/mongodb';
import Job from '@/lib/db/models/job';
import { NextRequest, NextResponse } from 'next/server';
import { IJob } from '@/lib/interfaces/job.interface';
import { QueryFilter } from 'mongoose';
import { resolvePaginationQuery } from '@/lib/helpers';

export async function GET(req: NextRequest) {
	await dbConnect();

	try {
		const { searchParams } = new URL(req.url);

		const search = searchParams.get('search');
		const location = searchParams.get('location');
		const queryPage = searchParams.get('page');
		const queryLimit = searchParams.get('limit');

		const filter: QueryFilter<IJob> = {};

		if (search) {
			filter.$or = [
				{ title: { $regex: search, $options: 'i' } },
				{ description: { $regex: search, $options: 'i' } },
				{ company: { $regex: search, $options: 'i' } },
				{ slug: { $regex: search, $options: 'i' } },
			];
		}
		if (location) filter.location = { $regex: location, $options: 'i' };

		const count = await Job.countDocuments(filter);

		const { skip, page, totalPages, limit } = resolvePaginationQuery({
			page: queryPage,
			limit: queryLimit,
			count,
		});

		const jobs = await Job.find(filter).sort({ postedAt: -1 }).skip(skip).limit(limit);
		return NextResponse.json({
			success: true,
			message: 'jobs search successful',
			data: jobs,
			meta: { count, page, totalPages, limit },
		});
	} catch (err) {
		console.error('[Search GET] Error:', err);
		return NextResponse.json({ success: false, error: 'Search failed' });
	}
}
