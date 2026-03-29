import { fetchJobDataAfrica, fetchJobDataNigeria } from "@/lib/services/job.service";
import { NextResponse } from "next/server";

export async function GET() {
	// await seedCategories();
	// const arbeitnow = await fetchArbeitnow();
	// const themuse = await fetchTheMuse();
	// const jobicy = await fetchJobicy();
	// const africa = await fetchJobDataAfrica();
	// const nigeria = await fetchJobDataNigeria();

	// return NextResponse.json({
	// 	success: true,
	// 	data: { africa, nigeria },
	// });

	return NextResponse.json({
		success: true,
		message: "Welcome to MyJobFeed API",
	});
}
