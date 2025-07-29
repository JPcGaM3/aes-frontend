import { GET, PATCH } from "@/libs/httpClient";

export interface GetAssignedTaskProps {
	token: string;
	params?: {
		user_id?: number;
		[key: string]: any;
	};
}

export async function getAssignedTask({
	token,
	params,
}: GetAssignedTaskProps): Promise<any> {
	const { user_id, ...queryParams } = params || {};

	return await GET(`/task-orders/${user_id}/get-task`, {
		token,
		params: queryParams,
	});
}

export interface GetTaskByIdProps {
	token: string;
	params: {
		taskId: number;
	};
}

export async function getTaskById({
	token,
	params,
}: GetTaskByIdProps): Promise<any> {
	const { taskId } = params || {};

	return await GET(`/task-orders/${taskId}`, {
		token,
	});
}

export interface SetStatusTaskOrderProps {
	token: string;
	tid: number;
	body: {
		status?: string;
		comment?: string;
	};
}

export async function SetStatusTaskOrder({
	token,
	tid,
	body,
}: SetStatusTaskOrderProps): Promise<any> {
	return await PATCH(`/task-orders/${tid}/set/status`, {
		token,
		body,
	});
}

export interface SetActualTaskOrderProps {
	token: string;
	tid: number;
	body?: {
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
}

export async function SetActualTaskOrder({
	token,
	tid,
	body,
}: SetActualTaskOrderProps): Promise<any> {
	return await PATCH(`/task-orders/${tid}/set/actual-area`, {
		token,
		body,
	});
}
