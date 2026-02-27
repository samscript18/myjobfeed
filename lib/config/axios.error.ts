import { toast } from 'sonner';

export type AxiosErrorShape = {
	response?: {
		data?: {
			message?: string;
			error?: string;
		};
	};
	message?: string;
};

export function errorHandler<T = AxiosErrorShape | string>(error: AxiosErrorShape | string): T {
	const extractedError =
		typeof error === 'object' && 'response' in error
			? error.response?.data?.message || error.response?.data?.error || error.message
			: error;

	console.error('[Axios Error]', extractedError);

	return extractedError as T;
}
