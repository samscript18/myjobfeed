import { AxiosErrorShape, errorHandler } from "../config/axios.error";
import { appApi, arbeitnowApi, findWorkApi, jobDataApi, jobicyApi, joobleApi, museApi, remotiveApi } from "../config/axios.instance";
import { joobleApiKey, museApiKey } from "../constants/env";
import { ArbeitnowJob, Category, Job, JobicyJob, JoobleJob, TheMuseJob } from "../interfaces/job.interface";
import { cleanText, createSlug, parseDate, TECH_KEYWORDS } from "../utils";
import { ApiResponse } from "../interfaces";
import { CreateJobDto, GetJobsQueryDto, GetJobsSearchQueryDto } from "../dtos/job.dto";
import { JobSource } from "../enums";
import { normalizeJobLevel, normalizeJobType } from "../helpers";

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
			source: JobSource.ARBEITNOW,
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
			level: normalizeJobLevel(job.levels?.[0]?.name),
			category: job.categories?.[0]?.name,
			url: job.refs?.landing_page,
			postedAt: parseDate(job.publication_date),
			source: JobSource.THEMUSE,
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
			level: normalizeJobLevel(job.jobLevel),
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
			source: JobSource.JOOBLE,
			sourceId: `jooble-${job.id}`,
		}));
	} catch (error) {
		errorHandler(error as AxiosErrorShape);
		return [];
	}
}

export async function fetchFindwork() {
	try {
		const res = await findWorkApi.get("/jobs");

		const jobs = res.data?.results || [];

		return jobs.map((job: any) => ({
			title: job.role,
			description: job.text,
			slug: createSlug(job.role, job.company_name),
			company: job.company_name || "Unknown",
			companyLogo: job.logo,
			location: job.location || (job.remote ? "Remote" : "Unknown"),
			type: normalizeJobType(job.employment_type),
			level: normalizeJobLevel(job.role),
			url: job.url,
			postedAt: parseDate(job.date_posted),
			source: JobSource.FINDWORK,
			sourceId: `findwork-${job.id}`,
		}));
	} catch (error) {
		errorHandler(error as AxiosErrorShape);
		return [];
	}
}

export async function fetchRemotive() {
	try {
		const res = await remotiveApi.get("/remote-jobs");
		const jobs = res.data?.jobs || [];

		return jobs.map((job: any) => ({
			title: job.title,
			description: job.description,
			slug: createSlug(job.title, job.company_name),
			company: job.company_name || "Unknown",
			companyLogo: job.company_logo,
			location: job.candidate_required_location || "Remote",
			type: normalizeJobType(job.job_type),
			level: normalizeJobLevel(job.title),
			salaryRange: job.salary || null,
			url: job.url,
			postedAt: parseDate(job.publication_date),
			source: JobSource.REMOTIVE,
			sourceId: `remotive-${job.id}`,
		}));
	} catch (error) {
		errorHandler(error as AxiosErrorShape);
		return [];
	}
}

export async function fetchJobDataAfrica() {
	try {
		const res = await jobDataApi.get("/jobs/?location=africa");
		console.log("Africa Jobs Response:", res.data);
		const jobs = res.data?.results || [];

		return jobs.map((job: any) => ({
			title: job.title || "Unknown",
			description: job.description || "",
			slug: createSlug(job.title, job.company?.name || "company"),
			company: job.company?.name || "Unknown",
			companyLogo: job.company?.logo || undefined,
			location: job.location || job.cities?.[0]?.name || "Remote",
			level: normalizeJobLevel(job.experience_level),
			type: normalizeJobType(job.types?.[0]?.name),
			url: job.application_url || job.company?.website_url,
			salaryMin: job.salary_min,
			salaryMax: job.salary_max,
			salaryCurrency: job.salary_currency,
			postedAt: parseDate(job.published),
			source: JobSource.JOBDATA,
			sourceId: `jobdata-${job.id}`,
		}));
	} catch (error) {
		errorHandler(error as AxiosErrorShape);
		return [];
	}
}

export async function fetchJobDataNigeria() {
	try {
		const res = await jobDataApi.get("/jobs/?location=nigeria");
		console.log("Raw Nigeria Jobs Data:", res.data);
		const jobs = res.data?.results || [];

		return jobs.map((job: any) => ({
			title: job.title || "Unknown",
			description: job.description || "",
			slug: createSlug(job.title, job.company?.name || "company"),
			company: job.company?.name || "Unknown",
			companyLogo: job.company?.logo || undefined,
			location: job.location || job.cities?.[0]?.name || "Remote",
			level: normalizeJobLevel(job.experience_level),
			type: normalizeJobType(job.types?.[0]?.name),
			url: job.application_url || job.company?.website_url,
			salaryMin: job.salary_min,
			salaryMax: job.salary_max,
			salaryCurrency: job.salary_currency,
			postedAt: parseDate(job.published),
			source: JobSource.JOBDATA,
			sourceId: `jobdata-${job.id}`,
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
		const response = await appApi.get<ApiResponse<Category[]>>(`/categories`);

		return response?.data?.data;
	} catch (error) {
		errorHandler(error as AxiosErrorShape | string);
		throw error;
	}
};

export const getCategory = async (categoryId: string) => {
	try {
		const response = await appApi.get<ApiResponse<Category>>(`/categories/${categoryId}`);

		return response?.data?.data;
	} catch (error) {
		errorHandler(error as AxiosErrorShape | string);
		throw error;
	}
};
