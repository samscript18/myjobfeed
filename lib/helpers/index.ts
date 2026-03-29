import { GoogleGenAI } from "@google/genai";
import { ResolvedPagination, ResolvePaginationQuery } from "../interfaces/pagination.interface";
import { Job, NormalizedJob } from "../interfaces/job.interface";
import { googleApiKey } from "../constants/env";
import { cleanText, parseDate } from "../utils";
import { JobLevel, JobType } from "../enums";

export function resolvePaginationQuery(query: ResolvePaginationQuery): ResolvedPagination {
	const page = Math.max(Number(query.page) || 1, 1);

	let limit = query.limit !== undefined && query.limit !== null ? Number(query.limit) : 20;

	if (limit < 0) limit = 10;

	if (limit === 0) {
		limit = query.count === 0 ? 1 : query.count;
	}

	const skip = (page - 1) * limit;
	const totalPages = limit > 0 ? Math.ceil(query.count / limit) : 1;

	return {
		skip,
		page,
		limit,
		totalPages,
		count: query.count,
	};
}

const ai = new GoogleGenAI({ apiKey: googleApiKey });

export function buildUpsertOp(job: NormalizedJob, categoryId: string) {
	const postedAt = parseDate(job.postedAt);
	let salaryRange;
	if (job.salaryMin && job.salaryMax && job.salaryCurrency) {
		salaryRange = `${job.salaryMin}-${job.salaryMax} ${job.salaryCurrency || ""}`;
	} else if (job.salaryRange) {
		salaryRange = job.salaryRange;
	} else {
		salaryRange = "Not Specified";
	}
	return {
		updateOne: {
			filter: { sourceId: job.sourceId || job.url },
			update: {
				$set: {
					title: job.title,
					description: job.description,
					location: job.location || "Remote",
					url: job.url,
					slug: job.slug,
					company: job.company || "Unknown",
					companyLogo: job.companyLogo || "",
					level: job.level || "Not Specified",
					type: job.type || "Not Specified",
					salaryRange,
					categoryId,
					postedAt,
					source: job.source,
					lastSyncedAt: new Date(),
				},
			},
			upsert: true,
		},
	};
}

export async function batchCategorizeAI(batch: { title: string; description: string; job: NormalizedJob }[], maxRetries = 3, concurrency = 3, chunkSize = 10) {
	const promptForBatch = (jobs: typeof batch) => `
Classify each job into ONE of these slugs:
technology, marketing, healthcare, finance, engineering, sales, design, education

Return ONLY an array of slugs in JSON. No extra text.

Jobs:
${jobs.map((j) => `Title: ${j.title}\nDescription: ${cleanText(j.description)?.slice(0, 500)}`).join("\n\n")}
`;

	const tryGenerate = async (jobs: typeof batch, attempt = 1): Promise<string[]> => {
		try {
			const response = await ai.models.generateContent({
				model: "gemini-3-flash-preview",
				contents: promptForBatch(jobs),
			});
			const result = JSON.parse(response.text!);
			if (!Array.isArray(result) || result.length !== jobs.length) {
				console.warn("[AI] Unexpected result, defaulting to technology");
				return jobs.map(() => "technology");
			}
			return result.map((r: string) => r.toLowerCase());
		} catch (err: any) {
			if (attempt < maxRetries && (err?.status === 503 || err?.message?.includes("high demand"))) {
				const delay = 500 * Math.pow(2, attempt); // exponential backoff
				console.warn(`[AI] Model busy, retrying in ${delay}ms (attempt ${attempt})`);
				await new Promise((res) => setTimeout(res, delay));
				return tryGenerate(jobs, attempt + 1);
			} else {
				console.error("[AI] Batch classification failed:", err);
				return jobs.map(() => "technology");
			}
		}
	};

	const chunks: (typeof batch)[] = [];
	for (let i = 0; i < batch.length; i += chunkSize) {
		chunks.push(batch.slice(i, i + chunkSize));
	}

	const results: string[] = [];
	let index = 0;

	const pool: Promise<void>[] = [];

	const runNext = async () => {
		if (index >= chunks.length) return;
		const currentIndex = index++;
		const chunkResult = await tryGenerate(chunks[currentIndex]);
		results.push(...chunkResult);
		await runNext();
	};

	for (let i = 0; i < Math.min(concurrency, chunks.length); i++) {
		pool.push(runNext());
	}

	await Promise.all(pool);

	return results;
}

export function normalizeJobType(type?: string): JobType | string {
	if (!type) return "Not Specified";

	const t = type.toLowerCase().replace(/[-_\s]/g, "");

	switch (t) {
		case "fulltime":
		case "ft":
			return JobType.FULL_TIME;

		case "parttime":
		case "pt":
			return JobType.PART_TIME;

		case "contract":
		case "temp":
		case "temporary":
		case "freelance":
			return JobType.CONTRACT;

		case "internship":
		case "intern":
			return JobType.INTERNSHIP;

		case "volunteer":
		case "voluntary":
			return JobType.VOLUNTEER;

		case "apprenticeship":
		case "apprentice":
			return JobType.APPRENTICESHIP;

		default:
			return "Not Specified";
	}
}

export function normalizeJobLevel(title?: string): JobLevel | string {
	if (!title) return "Not Specified";

	const t = title.toLowerCase();

	if (/(intern|student)/.test(t)) return JobLevel.INTERN;
	if (/(entry|en)/.test(t)) return JobLevel.ENTRY_LEVEL;
	if (/(junior|jr|jnr|associate)/.test(t)) return JobLevel.JUNIOR;
	if (/(mid|mid-level|mi|intermediate)/.test(t)) return JobLevel.MID_LEVEL;
	if (/(senior|sr|se|snr)/.test(t)) return JobLevel.SENIOR;
	if (/(lead|manager|head)/.test(t)) return JobLevel.LEAD;
	if (/(director)/.test(t)) return JobLevel.DIRECTOR;
	if (/(chief|cto|ceo|coo|cfo|executive|ex)/.test(t)) return JobLevel.EXECUTIVE;

	return "Not Specified";
}

export function isValidEmail(email: string) {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidURL(url: string) {
	try {
		const parsed = new URL(url);
		return parsed.protocol === "http:" || parsed.protocol === "https:";
	} catch {
		return false;
	}
}

export function getRandomSubset(arr: Job[], size: number): Job[] {
	const shuffled = arr.sort(() => 0.5 - Math.random());
	return shuffled.slice(0, size);
}

export function extractKeywords(title: string) {
	return title
		.toLowerCase()
		.split(/\s+/)
		.filter((word) => word.length > 2); 
}