import axios, { AxiosInstance } from "axios";
import { API_URL, arbeitnowApiUrl, findWorkApiKey, findWorkApiUrl, jobDataApiUrl, jobicyApiUrl, joobleApiUrl, museApiUrl, remotiveApiUrl } from "../constants/env";

export const appApi: AxiosInstance = axios.create({
	baseURL: API_URL,
});
export const arbeitnowApi: AxiosInstance = axios.create({
	baseURL: arbeitnowApiUrl,
});
export const museApi: AxiosInstance = axios.create({
	baseURL: museApiUrl,
});
export const jobicyApi: AxiosInstance = axios.create({
	baseURL: jobicyApiUrl,
});
export const joobleApi: AxiosInstance = axios.create({
	baseURL: joobleApiUrl,
	headers: { "Content-Type": "application/json" },
});
export const findWorkApi: AxiosInstance = axios.create({
	baseURL: findWorkApiUrl,
	headers: { Authorization: `Token ${findWorkApiKey}` },
});
export const remotiveApi: AxiosInstance = axios.create({
	baseURL: remotiveApiUrl,
});
export const jobDataApi: AxiosInstance = axios.create({
	baseURL: jobDataApiUrl,
});
