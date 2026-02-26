// pages/api/search.ts
import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/db/mongodb';
import Job from '@/lib/db/models/job';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	await dbConnect();

	if (req.method !== 'GET')
		return res.status(405).json({ success: false, error: 'Method not allowed' });

	try {
		const { q, location, category, salaryMin, salaryMax } = req.query;
		const filter: Record<string, any> = {};

		if (q)
			filter.$or = [
				{ title: { $regex: q, $options: 'i' } },
				{ description: { $regex: q, $options: 'i' } },
				{ company: { $regex: q, $options: 'i' } },
			];
		if (location) filter.location = { $regex: location, $options: 'i' };
		if (category) filter.category = category;

		// salary filter can be added if salary fields exist in Job schema
		// if (salaryMin || salaryMax) { ... }

		const jobs = await Job.find(filter).sort({ postedAt: -1 }).limit(100);
		res.status(200).json({ success: true, jobs });
	} catch (err) {
		console.error('[Search GET] Error:', err);
		res.status(500).json({ success: false, error: 'Search failed' });
	}
}
