import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/db/mongodb';
import Job from '@/lib/db/models/job';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	await dbConnect();
	const { slug } = req.query;

	if (req.method !== 'GET') {
		return res.status(405).json({ success: false, error: 'Method not allowed' });
	}

	try {
		const job = await Job.findOne({ slug: slug as string });
		if (!job) return res.status(404).json({ success: false, error: 'Job not found' });
		res.status(200).json({ success: true, job });
	} catch (err) {
		console.error('[Job GET] Error:', err);
		res.status(500).json({ success: false, error: 'Failed to fetch job' });
	}
}
