import dbConnect from '@/lib/db/mongodb';
import Category from '@/lib/db/models/category';
import { NextResponse } from 'next/server';
import Job from '@/lib/db/models/job';

export async function GET() {
	await dbConnect();

	try {
		const categories = await Category.find().sort({ name: 1 });

		const updatedCategories = await Promise.all(
			categories.map(async (category) => {
				const jobCount = await Job.countDocuments({ categoryId: category._id });
				return {
					_id: category._id,
					name: category.name,
					slug: category.slug,
					description: category.description,
					jobCount,
				};
			}),
		);

		return NextResponse.json({
			success: true,
			messaage: 'Categories fetched successfully',
			data: updatedCategories,
		});
	} catch (err) {
		console.error('[Categories GET] Error:', err);
		return NextResponse.json({ success: false, error: 'Failed to fetch categories' });
	}
}
