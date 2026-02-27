import { seedCategories } from '@/lib/db/seed';

export async function GET() {
	await seedCategories();
}