import axios from "axios";
import qs from "qs";

interface HttpClientOptions {
	token?: string;
	params?: Record<string, any>;
	body?: Record<string, any>;
	headers?: Record<string, string>;
}

class HttpClient {
	private baseURL: string;

	constructor() {
		this.baseURL = `/aes/api/proxy`;
	}

	private buildHeaders(
		token?: string,
		additionalHeaders?: Record<string, string>
	) {
		const headers: Record<string, string> = {
			"Content-Type": "application/json",
			...additionalHeaders,
		};

		if (token) {
			headers.Authorization = `Bearer ${token}`;
		}

		return headers;
	}

	async GET(path: string, options: HttpClientOptions = {}) {
		const { token, params, headers: additionalHeaders } = options;

		try {
			const response = await axios.get(`${this.baseURL}${path}`, {
				params,
				paramsSerializer: (params) =>
					qs.stringify(params, { arrayFormat: "repeat" }),
				headers: this.buildHeaders(token, additionalHeaders),
			});

			return response.data;
		} catch (error: any) {
			if (axios.isAxiosError(error)) {
				throw {
					status: error.response?.status,
					message: error.response?.data?.message || error.message,
				};
			}
			throw error;
		}
	}

	async POST(path: string, options: HttpClientOptions = {}) {
		const { token, params, body, headers: additionalHeaders } = options;

		try {
			const response = await axios.post(
				`${this.baseURL}${path}`,
				{ body, params },
				{
					headers: this.buildHeaders(token, additionalHeaders),
				}
			);

			return response.data;
		} catch (error: any) {
			if (axios.isAxiosError(error)) {
				throw {
					status: error.response?.status,
					message: error.response?.data?.message || error.message,
				};
			}
			throw error;
		}
	}

	async PATCH(path: string, options: HttpClientOptions = {}) {
		const { token, params, body, headers: additionalHeaders } = options;

		try {
			const response = await axios.patch(
				`${this.baseURL}${path}`,
				{ body, params },
				{
					headers: this.buildHeaders(token, additionalHeaders),
				}
			);

			return response.data;
		} catch (error: any) {
			if (axios.isAxiosError(error)) {
				throw {
					status: error.response?.status,
					message: error.response?.data?.message || error.message,
				};
			}
			throw error;
		}
	}

	async PUT(path: string, options: HttpClientOptions = {}) {
		const { token, params, body, headers: additionalHeaders } = options;

		try {
			const response = await axios.put(
				`${this.baseURL}${path}`,
				{ body, params },
				{
					headers: this.buildHeaders(token, additionalHeaders),
				}
			);

			return response.data;
		} catch (error: any) {
			if (axios.isAxiosError(error)) {
				throw {
					status: error.response?.status,
					message: error.response?.data?.message || error.message,
				};
			}
			throw error;
		}
	}

	async DELETE(path: string, options: HttpClientOptions = {}) {
		const { token, params, headers: additionalHeaders } = options;

		try {
			const response = await axios.delete(`${this.baseURL}${path}`, {
				params,
				headers: this.buildHeaders(token, additionalHeaders),
			});

			return response.data;
		} catch (error: any) {
			if (axios.isAxiosError(error)) {
				throw {
					status: error.response?.status,
					message: error.response?.data?.message || error.message,
				};
			}
			throw error;
		}
	}
}

export const httpClient = new HttpClient();

export const GET = (path: string, options?: HttpClientOptions) =>
	httpClient.GET(path, options);
export const POST = (path: string, options?: HttpClientOptions) =>
	httpClient.POST(path, options);
export const PATCH = (path: string, options?: HttpClientOptions) =>
	httpClient.PATCH(path, options);
export const PUT = (path: string, options?: HttpClientOptions) =>
	httpClient.PUT(path, options);
export const DELETE = (path: string, options?: HttpClientOptions) =>
	httpClient.DELETE(path, options);
