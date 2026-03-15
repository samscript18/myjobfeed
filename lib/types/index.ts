export type PostJob = {
	title: string;
	description: string;
	company: string;
	location: string;
	level: string;
	type: string;
	categoryId: string;
	url: string;
	salaryRange?: string;
};

export type GetJobs = {
	page?: number;
	limit?: number;
	keyword?: string;
	category?: string;
	location?: string;
	level?: string;
	type?: string;
	datePosted?: number;
};

export type ContactUsType = {
	name: string;
	email: string;
	subject: string;
	message: string;
};
