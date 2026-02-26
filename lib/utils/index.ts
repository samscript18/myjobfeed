export function createSlug(title: string, company: string) {
	return `${title.toLowerCase().replace(/\s+/g, '-')}-${company.toLowerCase().replace(/\s+/g, '-')}`;
}
export const BATCH_SIZE = 20;

export const TECH_KEYWORDS = [
	'software engineer',
	'frontend',
	'backend',
	'fullstack',
	'devops',
	'data scientist',
	'machine learning',
	'ai',
	'product manager',
	'designer',
	'ux',
	'ui',
	'qa',
	'cloud',
	'network engineer',
	'security',
	'it support',
	'mobile developer',
	'android',
	'ios',
];

export async function fetchWithTimeout(url: string, options?: RequestInit, timeout = 15000) {
	const controller = new AbortController();
	const id = setTimeout(() => controller.abort(), timeout);
	try {
		const res = await fetch(url, { ...options, signal: controller.signal });
		return res;
	} finally {
		clearTimeout(id);
	}
}

