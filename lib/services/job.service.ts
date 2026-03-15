import { AxiosErrorShape, errorHandler } from "../config/axios.error";
import { appApi, arbeitnowApi, jobicyApi, joobleApi, museApi } from "../config/axios.instance";
import { joobleApiKey, museApiKey } from "../constants/env";
import { ArbeitnowJob, Category, Job, JobicyJob, JoobleJob, TheMuseJob } from "../interfaces/job.interface";
import { cleanText, createSlug, parseDate, TECH_KEYWORDS } from "../utils";
import { ApiResponse } from "../interfaces";
import { CreateJobDto, GetJobsQueryDto, GetJobsSearchQueryDto } from "../dtos/job.dto";

export async function fetchArbeitnow() {
	try {
		const res = await arbeitnowApi.get("/job-board-api");
		const data = res.data?.data || [];

		return data.map((job: ArbeitnowJob) => ({
			title: job.title,
			description: job.description,
			slug: job.slug || createSlug(job.title, job.company_name),
			company: job.company_name || "Unknown",
			location: job.location || "Remote",
			url: job.url,
			postedAt: parseDate(job.created_at),
			source: "arbeitnow",
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

		return results.map((job: TheMuseJob) => ({
			title: job.name,
			description: job.contents,
			slug: createSlug(job.name, job.company?.name || "company"),
			company: job.company?.name || "Unknown",
			location: job.locations?.[0]?.name || "Remote",
			level: job.levels?.[0]?.name,
			category: job.categories?.[0]?.name,
			url: job.refs?.landing_page,
			postedAt: parseDate(job.publication_date),
			source: "themuse",
			sourceId: `muse-${job.id}`,
		}));
	} catch (error) {
		errorHandler(error as AxiosErrorShape);
		return [];
	}
}

export async function fetchJobicy() {
	try {
		const res = await jobicyApi.get("/remote-jobs?count=100");
		const jobs = res.data?.jobs || [];

		return jobs.map((job: JobicyJob) => ({
			title: cleanText(job.jobTitle),
			description: job.jobDescription,
			slug: job.jobSlug || createSlug(job.jobTitle, job.companyName),
			company: job.companyName,
			companyLogo: job.companyLogo,
			location: job.jobGeo || "Remote",
			level: job.jobLevel,
			industry: job.jobIndustry?.[0],
			type: job.jobType?.[0],
			url: job.url || job.applyUrl,
			salaryMin: job.salaryMin,
			salaryMax: job.salaryMax,
			salaryCurrency: job.salaryCurrency,
			postedAt: parseDate(job.pubDate),
			source: "jobicy",
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
			page: 1,
		});

		const jobs = res.data?.jobs || [];

		return jobs.map((job: JoobleJob) => ({
			title: job.title || "",
			description: job.snippet,
			slug: createSlug(job.title || "job", job.company || "company"),
			company: job.company || "Unknown",
			location: job.location || "Remote",
			url: job.link,
			postedAt: parseDate(job.updated),
			source: "jooble",
			sourceId: `jooble-${job.id}`,
		}));
	} catch (error) {
		errorHandler(error as AxiosErrorShape);
		return [];
	}
}

export const postJob = async (data: CreateJobDto) => {
	try {
		const response = await appApi.post<ApiResponse<Job>>("/jobs", data);
		return response.data.data;
	} catch (error) {
		errorHandler(error as AxiosErrorShape | string);
		throw error;
	}
};

export const getJobs = async (query?: GetJobsQueryDto) => {
	try {
		const response = await appApi.get<ApiResponse<Job[]>>("/jobs", {
			params: {
				keyword: query?.keyword || "",
				location: query?.location || "",
				level: query?.level || "",
				type: query?.type || "",
				categoryId: query?.category || "",
				datePosted: query?.datePosted || "",
				page: Number(query?.page || 1),
				limit: Number(query?.limit) || 50,
			},
		});

		return response?.data;
	} catch (error) {
		errorHandler(error as AxiosErrorShape | string);
		throw error;
	}
};

export const getJobsSearch = async (query?: GetJobsSearchQueryDto) => {
	try {
		const response = await appApi.get<ApiResponse<Job[]>>("/jobs/search", {
			params: {
				search: query?.search,
				location: query?.location,
				page: Number(query?.page),
				limit: Number(query?.limit) || 50,
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
