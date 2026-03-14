export interface ArbeitnowJob {
	slug: string;
	title: string;
	company_name: string;
	location: string;
	description: string;
	url: string;
	created_at: number;
}
export interface TheMuseJob {
	id: number;
	name: string;
	company: { name: string };
	locations: Array<{ name: string }>;
	levels: Array<{ name: string }>;
	categories: Array<{ name: string }>;
	refs: { landing_page: string };
	contents: string;
	publication_date: string;
}
export interface JobicyJob {
	id: number;
	jobTitle: string;
	companyName: string;
	companyLogo: string;
	jobIndustry: string[];
	jobType: string[];
	jobGeo: string;
	jobLevel: string;
	jobDescription: string;
	pubDate: string;
	jobSlug: string;
	url: string;
	applyUrl: string;
	salaryMin?: number;
	salaryMax?: number;
	salaryCurrency?: string;
	salaryPeriod?: string;
}

export interface normalizedJob {
	title: string;
	description?: string;
	company?: string;
	companyLogo?: string;
	location?: string;
	level?: string;
	url?: string;
	postedAt?: Date;
	source: string;
	sourceId: string;
	slug: string;
}

export interface NormalizedJob {
	title: string;
	description: string;
	slug: string;
	company: string;
	location: string;
	url: string;
	postedAt: Date;
	source: "arbeitnow" | "themuse" | "jobicy" | "jooble";
	sourceId: string;

	level?: string;
	category?: string;
	industry?: string;
	type?: string;
	companyLogo?: string;

	salaryMin?: number;
	salaryMax?: number;
	salaryCurrency?: string;
}

export interface JoobleJob {
	title: string;
	snippet?: string;
	company: string;
	location?: string;
	link: string;
	updated?: string;
	id: string;
}

export interface IJob {
	title: string;
	description?: string;
	company: string;
	slug: string;
	location: string;
	level: string;
	categoryId: string | Category;
	source: string;
	sourceId: string;
	postedAt: Date;
	url: string;
}

export interface Job extends IJob {
	_id: string;
	createdAt: Date;
	updatedAt: Date;
}

export interface Category {
	_id: string;
	name: string;
	slug: string;
	description: string;
	jobCount: number;
}
