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
			throw {
				status: error.response?.status,
				message: `${error.response?.statusText}: ${error.response?.data.message || error.message}`,
			};
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
			throw {
				status: error.response?.status,
				message: `${error.response?.statusText}: ${error.response?.data.message || error.message}`,
			};
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
		throw {
			status: error.response?.status,
			message: `${error.response?.statusText}: ${error.response?.data.message || error.message}`,
		};
	}
}

export async function SetActualTaskOrder({
	token,
	tid,
	paramData,
}: {
	token: string;
	tid: number;
	paramData?: {
		ap_date?: Date;
		oil_start_mile?: number;
		start_mile?: number;
		oil_start?: number;
		car_start_hour?: string;
		start_timer?: Date | string;
		oil_slip?: string;
		end_mile?: number;
		oil_end?: number;
		car_end_hour?: string;
		end_timer?: Date | string;
		actual_area?: number;
	};
}) {
	const params: Record<string, any> = {};
	const body: Record<string, any> = {};

	if (paramData) {
		if (paramData.ap_date) body.ap_date = paramData.ap_date;
		if (paramData.oil_start_mile)
			body.oil_start_mile = paramData.oil_start_mile;
		if (paramData.start_mile) body.start_mile = paramData.start_mile;
		if (paramData.oil_start) body.oil_start = paramData.oil_start;
		if (paramData.car_start_hour)
			body.car_start_hour = paramData.car_start_hour;
		if (paramData.start_timer) body.start_timer = paramData.start_timer;
		if (paramData.oil_slip) body.oil_slip = paramData.oil_slip;
		if (paramData.end_mile) body.end_mile = paramData.end_mile;
		if (paramData.oil_end) body.oil_end = paramData.oil_end;
		if (paramData.car_end_hour) body.car_end_hour = paramData.car_end_hour;
		if (paramData.end_timer) body.end_timer = paramData.end_timer;
		if (paramData.actual_area) body.actual_area = paramData.actual_area;
	}

	try {
		const response = await axios.patch(
			`${apiUrl}/api/v1/task-orders/${tid}/set/actual-area`,
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
		throw {
			status: error.response?.status,
			message: `${error.response?.statusText}: ${error.response?.data.message || error.message}`,
		};
	}
}
