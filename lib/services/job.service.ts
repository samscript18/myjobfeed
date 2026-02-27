import { toast } from 'sonner';
import { AxiosErrorShape, errorHandler } from '../config/axios.error';
import { appApi, arbeitnowApi, jobicyApi, joobleApi, museApi } from '../config/axios.instance';
import { joobleApiKey, museApiKey } from '../constants/env';
import {
	ArbeitnowJob,
	Category,
	Job,
	JobicyJob,
	JoobleJob,
	TheMuseJob,
} from '../interfaces/job.interface';
import { createSlug, TECH_KEYWORDS } from '../utils';
import { ApiResponse } from '../interfaces';
import { CreateJobDto, GetJobsQueryDto, GetJobsSearchQueryDto } from '../dtos/job.dto';

export async function fetchArbeitnow() {
	try {
		const res = await arbeitnowApi.get('/job-board-api');
		const data = res.data?.data || [];

		return data?.map((job: ArbeitnowJob) => ({
			title: job.title,
			description: job.description
				.replace(/&nbsp;/g, ' ')
				.replace(/\.\.\./g, '')
				.replace(/<[^>]+>/g, '')
				.replace(/\s+/g, ' ')
				.trim(),
			slug: createSlug(job.title, job.company_name),
			company: job.company_name,
			location: job.location,
			url: job.url,
			postedAt: new Date(job.created_at * 1000),
			source: 'arbeitnow',
			sourceId: `arbeit-${job.slug}`,
		}));
	} catch (error) {
		errorHandler(error as AxiosErrorShape);
		return [];
	}
}

export async function fetchTheMuse() {
	try {
		const res = await museApi.get(`/public/jobs?api_key=${museApiKey}&page=1&descending=true`);

		const results = res.data?.results || [];

		return results?.map((job: TheMuseJob) => ({
			title: job.name,
			description:
				job.contents
					.replace(/&nbsp;/g, ' ')
					.replace(/\.\.\./g, '')
					.replace(/<[^>]+>/g, '')
					.replace(/\s+/g, ' ')
					.trim() || '',
			slug: createSlug(job.name, job.company?.name),
			company: job.company?.name,
			location: job.locations?.[0]?.name || 'Remote',
			url: job.refs?.landing_page,
			postedAt: new Date(job.publication_date),
			source: 'themuse',
			sourceId: `muse-${job.id}`,
		}));
	} catch (error) {
		errorHandler(error as AxiosErrorShape);
		return [];
	}
}

export async function fetchJobicy() {
	try {
		const res = await jobicyApi.get('/remote-jobs?count=100');

		const jobs = res.data?.jobs || [];

		return jobs?.map((job: JobicyJob) => ({
			title: job.jobTitle?.replace(/<[^>]*>/g, ''),
			description: job.jobDescription
				?.replace(/&nbsp;/g, ' ')
				.replace(/\.\.\./g, '')
				.replace(/<[^>]+>/g, '')
				.replace(/\s+/g, ' ')
				.trim(),
			slug: createSlug(job.jobTitle, job.companyName),
			company: job.companyName,
			companyLogo: job.companyLogo,
			location: job.jobGeo || 'Remote',
			level: job.jobLevel,
			postedAt: new Date(job.pubDate),
			source: 'jobicy',
			sourceId: `jobicy-${job.id}`,
		}));
	} catch (error) {
		errorHandler(error as AxiosErrorShape);
		return [];
	}
}

export async function fetchJooble() {
	try {
		const res = await joobleApi.post(`/${joobleApiKey}`, {
			keywords: TECH_KEYWORDS,
			// location: 'Nigeria',
			page: 1,
		});

		const jobs = res.data?.jobs || [];

		return jobs?.map((job: JoobleJob) => ({
			title: job.title,
			description: job.snippet
				?.replace(/&nbsp;/g, ' ')
				.replace(/\.\.\./g, '')
				.replace(/<[^>]+>/g, '')
				.replace(/\s+/g, ' ')
				.trim(),
			slug: createSlug(job.title, job.company ?? job.id),
			company: job.company,
			location: job.location || 'Remote',
			url: job.link,
			postedAt: new Date(job.updated || Date.now()),
			source: 'jooble',
			sourceId: `jooble-${job.id}`,
		}));
	} catch (error) {
		errorHandler(error as AxiosErrorShape);
		return [];
	}
}

export const createJob = async (data: CreateJobDto) => {
	try {
		const response = await appApi.post<ApiResponse<Job>>('/jobs', data);
		toast.success('Job created successfully');
		return response.data.data;
	} catch (error) {
		errorHandler(error as AxiosErrorShape | string);
		throw error;
	}
};

export const getJobs = async (query?: GetJobsQueryDto) => {
	try {
		const response = await appApi.get<ApiResponse<Job[]>>('/jobs', {
			params: {
				keywords: query?.keywords,
				location: query?.location,
				level: query?.level,
				category: query?.category,
				datePosted: query?.datePosted,
				page: Number(query?.page),
				limit: Number(query?.limit),
			},
		});

		return response?.data?.data;
	} catch (error) {
		errorHandler(error as AxiosErrorShape | string);
		throw error;
	}
};

export const getJobsSearch = async (query?: GetJobsSearchQueryDto) => {
	try {
		const response = await appApi.get<ApiResponse<Job[]>>('/jobs/search', {
			params: {
				search: query?.search,
				location: query?.location,
				page: Number(query?.page),
				limit: Number(query?.limit),
			},
		});

		return response?.data?.data;
	} catch (error) {
		errorHandler(error as AxiosErrorShape | string);
		throw error;
	}
};

export const getJob = async (slug: string) => {
	try {
		const response = await appApi.get<ApiResponse<Job>>(`/jobs/${slug}`);

		return response?.data?.data;
	} catch (error) {
		errorHandler(error as AxiosErrorShape | string);
		throw error;
	}
};

export const getJobCategories = async () => {
	try {
		const response = await appApi.get<ApiResponse<Category[]>>(`/category`);

		return response?.data?.data;
	} catch (error) {
		errorHandler(error as AxiosErrorShape | string);
		throw error;
	}
};

export const getCategory = async (categoryId: string) => {
	try {
		const response = await appApi.get<ApiResponse<Category>>(`/category/${categoryId}`);

		return response?.data?.data;
	} catch (error) {
		errorHandler(error as AxiosErrorShape | string);
		throw error;
	}
};

