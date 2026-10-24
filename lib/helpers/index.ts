import { GoogleGenAI } from "@google/genai";
import { ResolvedPagination, ResolvePaginationQuery } from "../interfaces/pagination.interface";
import { Job, NormalizedJob } from "../interfaces/job.interface";
import { googleApiKey } from "../constants/env";
import { cleanText, parseDate } from "../utils";
import { JobLevel, JobType } from "../enums";
import { INTERNAL_CATEGORIES, InternalCategory } from "../utils/categorizeJob";

export function resolvePaginationQuery(query: ResolvePaginationQuery): ResolvedPagination {
	const page = Math.max(Number(query.page) || 1, 1);
	const MAX_LIMIT = 100;

	let limit = query.limit !== undefined && query.limit !== null ? Number(query.limit) : 20;

	if (limit < 0) limit = 10;
	if (limit > MAX_LIMIT) limit = MAX_LIMIT;

	if (limit === 0) {
		limit = query.count === 0 ? 1 : Math.min(query.count, MAX_LIMIT);
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

export async function batchCategorizeAI(batch: { title: string; description: string; job: NormalizedJob }[], maxRetries = 3, concurrency = 1, chunkSize = 20): Promise<(InternalCategory | null)[]> {
	if (!batch.length) return [];
	if (![maxRetries, concurrency, chunkSize].every((value) => Number.isInteger(value) && value > 0)) {
		throw new Error("AI retry, concurrency and chunk size settings must be positive integers");
	}
	const fallback = (jobs: typeof batch) => jobs.map(() => null);
	const promptForBatch = (jobs: typeof batch) => `
Classify each job into ONE of these slugs:
${INTERNAL_CATEGORIES.join(", ")}

Return ONLY an array of ${jobs.length} slugs in JSON, in the same order as the jobs. No extra text.

Jobs:
${jobs.map((j) => `Title: ${j.title}\nDescription: ${cleanText(j.description)?.slice(0, 500)}`).join("\n\n")}
`;

	let unavailable = false;
	const tryGenerate = async (jobs: typeof batch, attempt = 1): Promise<(InternalCategory | null)[]> => {
		try {
			const response = await ai.models.generateContent({
				model: "gemini-3-flash-preview",
				contents: promptForBatch(jobs),
				config: {
					responseMimeType: "application/json",
					httpOptions: { timeout: 10_000 },
				},
			});
			const result: unknown = JSON.parse(response.text || "null");
			if (!Array.isArray(result) || result.length !== jobs.length) {
				console.warn("[AI] Unexpected result; using category fallback");
				return fallback(jobs);
			}
			return result.map((value: unknown) => {
				const slug = typeof value === "string" ? value.trim().toLowerCase() : "";
				return INTERNAL_CATEGORIES.find((category) => category === slug) ?? null;
			});
		} catch (err: unknown) {
			const status = typeof err === "object" && err !== null && "status" in err ? Number(err.status) : undefined;
			const message = err instanceof Error ? err.message : String(err);
			const retryable = (status !== undefined && [408, 429, 500, 502, 503, 504].includes(status)) || /high demand|timeout|timed out|aborted/i.test(message);
			if (attempt < maxRetries && retryable) {
				const delay = 1000 * Math.pow(2, attempt - 1) + Math.floor(Math.random() * 250);
				console.warn(`[AI] Request unavailable, retrying in ${delay}ms (attempt ${attempt})`);
				await new Promise((res) => setTimeout(res, delay));
				return tryGenerate(jobs, attempt + 1);
			} else {
				unavailable = true;
				console.error("[AI] Batch classification failed:", err);
				return fallback(jobs);
			}
		}
	};

	const chunks: (typeof batch)[] = [];
	for (let i = 0; i < batch.length; i += chunkSize) {
		chunks.push(batch.slice(i, i + chunkSize));
	}

	const results: (InternalCategory | null)[][] = new Array(chunks.length);
	let index = 0;

	const pool: Promise<void>[] = [];

	const runNext = async () => {
		if (index >= chunks.length) return;
		const currentIndex = index++;
		const chunk = chunks[currentIndex];
		results[currentIndex] = unavailable ? fallback(chunk) : await tryGenerate(chunk);
		await runNext();
	};

	for (let i = 0; i < Math.min(concurrency, chunks.length); i++) {
		pool.push(runNext());
	}

	await Promise.all(pool);

	return results.flat();
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
	const shuffled = [...arr].sort(() => 0.5 - Math.random());
	return shuffled.slice(0, size);
}

export function extractKeywords(title: string) {
	return title
		.toLowerCase()
		.split(/\s+/)
		.filter((word) => word.length > 2); 
}
