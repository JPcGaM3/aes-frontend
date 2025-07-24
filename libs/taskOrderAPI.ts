import { GET, PATCH } from "./httpClient";

export async function getAssignedTask({
	token,
	paramData,
}: {
	token: string;
	paramData?: any | undefined;
}): Promise<any> {
	const { user_id, ...queryParams } = paramData || {};

	return await GET(`/task-orders/${user_id}/get-task`, {
		token,
		params: queryParams,
	});
}

export async function getTaskById({
	token,
	paramData,
}: {
	token: string;
	paramData?: any | undefined;
}): Promise<any> {
	const { taskId } = paramData || {};

	return await GET(`/task-orders/${taskId}`, {
		token,
	});
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
}): Promise<any> {
	return await PATCH(`/task-orders/${tid}/set/status`, {
		token,
		body: paramData,
	});
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
}): Promise<any> {
	return await PATCH(`/task-orders/${tid}/set/actual-area`, {
		token,
		body: paramData,
	});
}
