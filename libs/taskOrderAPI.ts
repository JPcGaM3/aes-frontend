import axios from "axios";

const apiUrl = process.env.API_URL || "http://localhost:8080";

export async function getAssignedTask({
	token,
	paramData,
}: {
	token: string;
	paramData?: any | undefined;
}) {
	const queryParams: Record<string, string | undefined> = {};

	if (paramData) {
		if (paramData.start_date) queryParams.start_date = paramData.start_date;
		if (paramData.end_date) queryParams.end_date = paramData.end_date;
		if (paramData.status) queryParams.status = paramData.status;
	}

	try {
		const response = await axios.get(
			`${apiUrl}/api/v1/task-orders/${paramData.user_id}/get-task`,
			{
				params: queryParams,
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
			}
		);

		return response.data.data;
	} catch (error: any) {
		if (axios.isAxiosError(error)) {
			throw new Error(
				`Failed to fetch cars: ${error.response?.status} ${error.response?.statusText || error.message}`
			);
		}

		throw error;
	}
}

export async function getTaskById({
	token,
	paramData,
}: {
	token: string;
	paramData?: any | undefined;
}) {
	try {
		const response = await axios.get(
			`${apiUrl}/api/v1/task-orders/${paramData.taskId}`,
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
			throw new Error(
				`Failed to fetch cars: ${error.response?.status} ${error.response?.statusText || error.message}`
			);
		}

		throw error;
	}
}

export async function SetStatusTaskOrder({
	token,
	tid,
	paramData,
}: {
	token: string;
	tid: number;
	paramData: {
		status?: string;
		comment?: string;
	};
}) {
	const params: Record<string, any> = {};
	const body: Record<string, any> = {};

	if (paramData) {
		if (paramData.status) body.status = paramData.status;
		if (paramData.comment) body.comment = paramData.comment;
	}

	try {
		const response = await axios.patch(
			`${apiUrl}/api/v1/task-orders/${tid}/set/status`,
			body,
			{
				params,
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
			}
		);

		return response.data.data;
	} catch (error: any) {
		throw new Error(
			`${error.response?.statusText}: ${error.response?.data.message || error.message}`
		);
	}
}
