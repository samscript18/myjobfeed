// import { seedCategories } from '@/lib/db/seed';

import Job from '@/lib/db/models/job';
import dbConnect from '@/lib/db/mongodb';
import { NextApiRequest } from 'next';
import { NextResponse } from 'next/server';

// export async function GET(req: Request) {
// 	await seedCategories();
// }

export default async function GET(req: NextApiRequest) {
	await dbConnect();

	try {
		const { keyword, location, category, level, datePosted } = req.query;

		const filter: Record<string, any> = {};
		if (keyword)
			filter.$or = [
				{ title: { $regex: keyword, $options: 'i' } },
				{ description: { $regex: keyword, $options: 'i' } },
				{ company: { $regex: keyword, $options: 'i' } },
			];
		if (location) filter.location = { $regex: location, $options: 'i' };
		if (category) filter.category = category;
		if (level) filter.level = level;
		if (datePosted) {
			const days = parseInt(datePosted as string, 10);
			if (!isNaN(days)) {
				const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
				filter.postedAt = { $gte: cutoff };
			}
		}

		const jobs = await Job.find(filter).sort({ postedAt: -1 }).limit(100);
		NextResponse.json(
			{ success: true, message: 'Jobs fetched successfully', data: jobs },
			{ status: 200 },
		);
	} catch (err) {
		console.error('[Jobs GET] Error:', err);
		NextResponse.json({ success: false, error: 'Failed to fetch jobs' }, { status: 500 });
	}
}

export async function POST(req: NextApiRequest) {
	if (req.method === 'POST') {
		try {
			const { title, company, location, category, level, description, url } = req.body;

			if (!title || !company || !url) {
				return res
					.status(400)
					.json({ success: false, error: 'Title, company, and url are required' });
			}

			const slug = `${title.toLowerCase().replace(/\s+/g, '-')}-${company.toLowerCase().replace(/\s+/g, '-')}`;
			const newJob = await Job.create({
				sourceId: `user-${Date.now()}`, // generate unique id for user-posted jobs
				source: 'user',
				slug,
				title,
				company,
				location: location || 'Remote',
				category: category || 'technology',
				level: level || 'Not Specified',
				description,
				url,
				postedAt: new Date(),
			});

			res.status(201).json({ success: true, job: newJob });
		} catch (err) {
			console.error('[Job POST] Error:', err);
			res.status(500).json({ success: false, error: 'Failed to create job' });
		}
	}
}