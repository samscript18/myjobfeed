import he from "he";

export const BATCH_SIZE = 20;

export const TECH_KEYWORDS = "software engineer, frontend, backend, fullstack, devops, data scientist, machine learning, ai, product manager, designer, ux, ui, qa, cloud, network engineer, security, it support, mobile developer, android, ios";

export function createSlug(title: string, company: string) {
	const clean = (str: string) =>
		str
			.toLowerCase()
			.normalize("NFD")
			.replace(/[\u0300-\u036f]/g, "")
			.replace(/[^a-z0-9]+/g, "-")
			.replace(/^-+|-+$/g, "");

	return `${clean(title)}-${clean(company)}`;
}

export function createBasicSlug(text: string) {
	return text
		.toLowerCase()
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.replace(/[^\w\s-]/g, "")
		.replace(/\s+/g, "-")
		.trim();
}

export function cleanText(text?: string) {
	if (!text) return "";

	return text
		.replace(/&nbsp;/g, " ")
		.replace(/&amp;/g, "&")
		.replace(/&#\d+;/g, "")
		.replace(/<[^>]+>/g, "")
		.replace(/\.\.\./g, "")
		.replace(/\s+/g, " ")
		.trim();
}

export function parseDate(date?: string | number | Date) {
	if (!date) return new Date();

	if (typeof date === "number") {
		return new Date(date * 1000);
	}

	if (typeof date === "string") {
		return new Date(date);
	}

	return date;
}

export function sanitizeDescription(rawText: string) {
	if (!rawText) return "";

	const text = he.decode(rawText);

	return cleanText(text);
}

export const getPagination = (current: number, total: number) => {
	const delta = 2; 
	const range: (number | string)[] = [];

	const left = Math.max(2, current - delta);
	const right = Math.min(total - 1, current + delta);

	range.push(1);

	if (left > 2) {
		range.push("...");
	}

	for (let i = left; i <= right; i++) {
		range.push(i);
	}

	if (right < total - 1) {
		range.push("...");
	}

	if (total > 1) {
		range.push(total);
	}

	return range;
};