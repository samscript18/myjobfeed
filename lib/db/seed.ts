import Category from '@/lib/db/models/category';
import dbConnect from './mongodb';

export const DEFAULT_CATEGORIES = [
	{
		name: 'Technology',
		slug: 'technology',
		description: 'Software, IT, data, cloud and tech roles.',
	},
	{
		name: 'Marketing',
		slug: 'marketing',
		description: 'Digital marketing, SEO, brand and growth roles.',
	},
	{
		name: 'Healthcare',
		slug: 'healthcare',
		description: 'Medical and health related jobs.',
	},
	{
		name: 'Finance',
		slug: 'finance',
		description: 'Accounting, banking and finance roles.',
	},
	{
		name: 'Engineering',
		slug: 'engineering',
		description: 'Mechanical, civil and electrical engineering roles.',
	},
	{
		name: 'Sales',
		slug: 'sales',
		description: 'Sales and business development roles.',
	},
	{
		name: 'Design',
		slug: 'design',
		description: 'UI, UX and graphic design roles.',
	},
	{
		name: 'Education',
		slug: 'education',
		description: 'Teaching and education roles.',
	},
];

export async function seedCategories() {
	await dbConnect();
	for (const category of DEFAULT_CATEGORIES) {
		await Category.updateOne({ slug: category.slug }, { $setOnInsert: category }, { upsert: true });
	}
}

