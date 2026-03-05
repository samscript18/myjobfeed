export interface CreateJobDto {
	title: string;
	company: string;
	url: string;
	location?: string;
	category?: string;
	level?: string;
	description?: string;
}

export interface GetJobsQueryDto {
	page?: number;
	limit?: number;
	keywords?: string;
	category?: string;
	location?: string;
	level?: number;
	datePosted?: number;
}

export interface GetJobsSearchQueryDto {
	page?: number;
	limit?: number;
	search?: string;
	location?: number;
}
