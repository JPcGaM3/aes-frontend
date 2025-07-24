import axios from "axios";
import qs from "qs";

export interface LoginProps {
	params: {
		ae_id: number | null;
	};
	body:
		| { email: string; password: string }
		| { username: string; password: string };
}

export async function LoginUser({ params, body }: LoginProps): Promise<any> {
	const apiUrl = process.env.API_URL || "http://localhost:8080";

	try {
		const response = await axios.post(
			`${apiUrl}/api/v1/mitr-portal/login`,
			body,
			{
				params: params,
				headers: {
					"Content-Type": "application/json",
				},
			}
		);

		return response.data.data;
	} catch (error: any) {
		if (axios.isAxiosError(error)) {
			throw {
				status: error.response?.status,
				message: `${error.response?.statusText}: ${error.response?.data.message || error.message}`,
			};
		}

		throw error;
	}
}

export async function getNewToken({ token }: { token: string }): Promise<any> {
	const apiUrl = process.env.API_URL || "http://localhost:8080";

	try {
		const response = await axios.get(
			`${apiUrl}/api/v1/mitr-portal/refresh-token`,
			{
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
			}
		);

		return response.data.data;
	} catch (error: any) {
		if (axios.isAxiosError(error)) {
			throw {
				status: error.response?.status,
				message: `${error.response?.statusText}: ${error.response?.data.message || error.message}`,
			};
		}

		throw error;
	}
}

export async function getProfile({ token }: { token: string }): Promise<any> {
	const apiUrl = process.env.API_URL || "http://localhost:8080";

	try {
		const response = await axios.get(
			`${apiUrl}/api/v1/mitr-portal/profile`,
			{
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
			}
		);

		return response.data.data;
	} catch (error: any) {
		if (axios.isAxiosError(error)) {
			throw {
				status: error.response?.status,
				message: `${error.response?.statusText}: ${error.response?.data.message || error.message}`,
			};
		}

		throw error;
	}
}

export async function getUsers({
	token,
	paramData,
}: {
	token: string;
	paramData?: { ae_id?: number; role?: string[] };
}) {
	const apiUrl = process.env.API_URL || "http://localhost:8080";
	const params: Record<string, any> = {};

	if (paramData) {
		if (paramData.ae_id) params.ae_id = paramData.ae_id;
		if (paramData.role && paramData.role.length > 0) {
			params.role = paramData.role;
		}
	}

	try {
		const response = await axios.get(`${apiUrl}/api/v1/users`, {
			params,
			paramsSerializer: (params) =>
				qs.stringify(params, { arrayFormat: "repeat" }),
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json",
			},
		});

		return response.data.data;
	} catch (error: any) {
		if (axios.isAxiosError(error)) {
			throw {
				status: error.response?.status,
				message: `${error.response?.statusText}: ${error.response?.data.message || error.message}`,
			};
		}

		throw error;
	}
}
