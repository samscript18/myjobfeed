import axios, { AxiosInstance } from 'axios';
import { API_URL, arbeitnowApiUrl, jobicyApiUrl, joobleApiUrl, museApiUrl } from '../constants/env';

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
	headers: { 'Content-Type': 'application/json' },
});
