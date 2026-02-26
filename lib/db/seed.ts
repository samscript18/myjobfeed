import Category from '@/lib/db/models/category';
import dbConnect from './mongodb';

const categories = [
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
  try {
    const db = await dbConnect();
		console.log('[SEED] Connected to DB');

		for (const cat of categories) {
			const exists = await Category.findOne({ slug: cat.slug });
			if (!exists) {
				await Category.create(cat);
				console.log(`[SEED] Inserted category: ${cat.name}`);
			} else {
				console.log(`[SEED] Category already exists: ${cat.name}`);
			}
		}

		console.log('[SEED] Categories seeding completed');
    process.exit(0);
	} catch (error) {
		console.error('[SEED] Error seeding categories:', error);
		process.exit(1);
	}
}

