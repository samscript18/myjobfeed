// pages/api/categories/index.ts
import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/db/mongodb';
import Category from '@/lib/db/models/category';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	await dbConnect();

	if (req.method !== 'GET') {
		return res.status(405).json({ success: false, error: 'Method not allowed' });
	}

	try {
		const categories = await Category.find().sort({ name: 1 });
		res.status(200).json({ success: true, categories });
	} catch (err) {
		console.error('[Categories GET] Error:', err);
		res.status(500).json({ success: false, error: 'Failed to fetch categories' });
	}
}
