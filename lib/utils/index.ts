export function createSlug(title: string, company: string) {
	const clean = (str: string) =>
		str
			.toLowerCase()
			.normalize('NFD')
			.replace(/[\u0300-\u036f]/g, '')
			.replace(/[^a-z0-9]+/g, '-')
			.replace(/^-+|-+$/g, '');

	return `${clean(title)}-${clean(company)}`;
}

export const BATCH_SIZE = 20;

export const TECH_KEYWORDS =
	'software engineer, frontend, backend, fullstack, devops, data scientist, machine learning, ai, product manager, designer, ux, ui, qa, cloud, network engineer, security, it support, mobile developer, android, ios';
