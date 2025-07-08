import axios from "axios";

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
			throw new Error(
				`${error.response?.statusText}: ${error.response?.data.message || error.message}`
			);
		}

		throw error;
	}
}

export async function getProfile({ token }: { token: string }): Promise<any> {
	const apiUrl = process.env.API_URL || "http://localhost:8080";

	try {
		const response = await axios.get(`${apiUrl}/api/v1/mitr-portal/profile`, {
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json",
			},
		});

		return response.data.data;
	} catch (error: any) {
		if (axios.isAxiosError(error)) {
			throw new Error(
				`${error.response?.statusText}: ${error.response?.data.message || error.message}`
			);
		}

		throw error;
	}
}

export async function getUsers({ token }: { token: string }) {
	const apiUrl = process.env.API_URL || "http://localhost:8080";

	try {
		const response = await axios.get(`${apiUrl}/api/v1/users`, {
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json",
			},
		});

		return response.data.data;
	} catch (error: any) {
		if (axios.isAxiosError(error)) {
			throw new Error(
				`${error.response?.statusText}: ${error.response?.data.message || error.message}`
			);
		}

		throw error;
	}
}
