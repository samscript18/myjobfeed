import { seedCategories } from "@/lib/db/seed";
import {
	fetchArbeitnow,
	fetchJobicy,
	fetchJooble,
	fetchTheMuse,
} from "@/lib/services/job.service";
import { NextResponse } from "next/server";

export async function GET() {
	// await seedCategories();
	// const arbeitnow = await fetchArbeitnow();
	// const themuse = await fetchTheMuse();
	// const jobicy = await fetchJobicy();
	// const jooble = await fetchJooble();

	// return NextResponse.json({
	// 	success: true,
	// 	data: { arbeitnow, themuse, jobicy, jooble },
	// });
	return NextResponse.json({
		success: true,
	});
}
