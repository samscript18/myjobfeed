export const INTERNAL_CATEGORIES = [
	'technology',
	'marketing',
	'healthcare',
	'finance',
	'engineering',
	'sales',
	'design',
	'education',
] as const;

type InternalCategory = (typeof INTERNAL_CATEGORIES)[number];

const CATEGORY_KEYWORDS: Record<InternalCategory, string[]> = {
	technology: [
		'developer',
		'software',
		'engineer',
		'frontend',
		'backend',
		'full stack',
		'data',
		'devops',
		'cloud',
		'react',
		'node',
		'python',
	],

	marketing: ['marketing', 'seo', 'growth', 'content', 'brand'],

	healthcare: ['nurse', 'doctor', 'medical', 'clinical', 'health'],

	finance: ['finance', 'accountant', 'bank', 'investment', 'tax'],

	engineering: ['mechanical', 'civil', 'electrical', 'structural'],

	sales: ['sales', 'account executive', 'business development'],

	design: ['designer', 'ui', 'ux', 'graphic', 'product designer'],

	education: ['teacher', 'tutor', 'lecturer', 'instructor'],
};

export function ruleBasedCategorize(
	title: string,
	description?: string,
	industry?: string,
): InternalCategory | null {
	const text = `${title} ${description || ''} ${industry || ''}`.toLowerCase();

	for (const category of INTERNAL_CATEGORIES) {
		for (const keyword of CATEGORY_KEYWORDS[category]) {
			if (text.includes(keyword)) {
				return category;
			}
		}
	}

	return null;
}
