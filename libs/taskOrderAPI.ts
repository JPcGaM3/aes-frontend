import axios from "axios";
import moment from "moment";

export async function getAssignedTask({
	token,
	user_id,
	params,
}: {
	token: string;
	user_id: number;
	params?: any | undefined;
}) {
	const apiUrl = process.env.API_URL || "http://localhost:8080";

	const queryParams: Record<string, string | undefined> = {};

	if (params) {
		if (params.start_date) queryParams.start_date = params.start_date;
		if (params.end_date) queryParams.end_date = params.end_date;
		if (params.status) queryParams.status = params.status;
	}

	try {
		const response = await axios.get(
			`${apiUrl}/api/v1/task-orders/${user_id}/get-task`,
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
