import axios, { AxiosInstance } from 'axios';
import { API_URL, APP_URL } from '../constants/env';
import { AxiosErrorShape, errorHandler } from './axios-error';
import Cookies from 'js-cookie';

export const appApi: AxiosInstance = axios.create({
	baseURL: APP_URL,
});

export const publicApi: AxiosInstance = axios.create({
	baseURL: API_URL,
	withCredentials: false,
});

export const authApi: AxiosInstance = axios.create({
	baseURL: API_URL,
	withCredentials: true,
	headers: {
		'Content-Type': 'application/json',
		Accept: 'application/json',
	},
});

authApi.interceptors.request.use(
	(req) => {
		const accessToken = sessionStorage.getItem('user-store')
			? JSON.parse(sessionStorage.getItem('user-store')!)?.state?.accessToken
			: undefined;

		if (accessToken) {
			req.headers.Authorization = `Bearer ${accessToken}`;
		}

		return req;
	},
	(error) => Promise.reject(error),
);

let logoutHandler: (() => void) | null = null;

export function setLogoutHandler(fn: () => void) {
	logoutHandler = fn;
}

authApi.interceptors.response.use(
	(response) => response,
	async (error) => {
		if ([401, 403].includes(error.response?.status)) {
			if (logoutHandler) logoutHandler();
			Cookies.remove('access_token');
			Cookies.remove('refresh_token');
			delete authApi.defaults.headers.common['Authorization'];
			errorHandler(error as AxiosErrorShape | string);
			window.location.href = '/login';
		}
		return Promise.reject(error);
	},
);
