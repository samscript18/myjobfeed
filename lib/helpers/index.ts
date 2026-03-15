import { GoogleGenAI } from "@google/genai";
import {
	ResolvedPagination,
	ResolvePaginationQuery,
} from "../interfaces/pagination.interface";
import { NormalizedJob } from "../interfaces/job.interface";
import { googleApiKey } from "../constants/env";
import { cleanText, parseDate } from "../utils";

export function resolvePaginationQuery(
	query: ResolvePaginationQuery,
): ResolvedPagination {
	const page = Math.max(Number(query.page) || 1, 1);

	let limit =
		query.limit !== undefined && query.limit !== null
			? Number(query.limit)
			: 20;

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

	return {
		updateOne: {
			filter: { sourceId: job.sourceId || job.url },
			update: {
				$set: {
					title: job.title,
					description: job.description,
					location:
						job.location ||
						"Remote",
					url: job.url,
					slug: job.slug,
					company:
						job.company ||
						"Unknown",
					companyLogo:
						job.companyLogo ||
						"",
					level:
						job.level ||
						"Not Specified",
					type:
						job.type ||
						"Not Specified",
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
export async function batchCategorizeAI(
	batch: { title: string; description: string; job: NormalizedJob }[],
) {
	const prompt = `
Classify each job into ONE of these slugs:
technology, marketing, healthcare, finance, engineering, sales, design, education

Return ONLY an array of slugs in JSON. No extra text.

Jobs:
${batch.map((j) => `Title: ${j.title}\nDescription: ${cleanText(j.description)?.slice(0, 500)}`).join("\n\n")}
`;
	try {
		const response = await ai.models.generateContent({
			model: "gemini-3-flash-preview",
			contents: prompt,
		});
		const result = JSON.parse(response.text!);
		if (
			!Array.isArray(result) ||
			result.length !== batch.length
		) {
			console.warn(
				"[AI] Unexpected batch AI result, defaulting to technology",
			);
			return batch.map(() => "technology");
		}
		return result.map((r: string) => r.toLowerCase());
	} catch (error) {
		console.error("[AI] Batch classification failed:", error);
		return batch.map(() => "technology");
	}
}

