import { POST, PATCH } from "../libs/httpClient";

import { TaskOrderOperation, RequestOrderFormData } from "@/types/form-state";

export interface TaskOrderAPIService {
	updateRequestOrder: (
		token: string,
		requestId: number,
		data: Partial<RequestOrderFormData>
	) => Promise<any>;
	createTaskOrder: (
		token: string,
		requestId: number,
		data: any
	) => Promise<any>;
	updateTaskOrder: (token: string, taskId: number, data: any) => Promise<any>;
	deleteTaskOrder: (
		token: string,
		taskId: number,
		userId: number
	) => Promise<any>;
	processTaskOrderOperations: (
		token: string,
		requestId: number,
		operations: TaskOrderOperation[],
		userId: number
	) => Promise<{
		success: boolean;
		results: any[];
		errors: any[];
	}>;
}

export const taskOrderAPIService: TaskOrderAPIService = {
	updateRequestOrder: async (
		token: string,
		requestId: number,
		data: Partial<RequestOrderFormData>
	) => {
		return await PATCH(`/request-orders/${requestId}/update`, {
			token,
			body: data,
		});
	},

	createTaskOrder: async (token: string, requestId: number, data: any) => {
		const taskData = {
			...data,
			request_order_id: requestId,
		};

		return await POST("/task-orders/create", {
			token,
			body: taskData,
		});
	},

	updateTaskOrder: async (token: string, taskId: number, data: any) => {
		return await PATCH(`/task-orders/${taskId}/set/assigned`, {
			token,
			body: data,
		});
	},

	deleteTaskOrder: async (token: string, taskId: number) => {
		return await PATCH(`/task-orders/${taskId}/set/active`, {
			token,
			body: {
				active: false,
			},
		});
	},

	processTaskOrderOperations: async (
		token: string,
		requestId: number,
		operations: TaskOrderOperation[],
		userId: number
	) => {
		const results: any[] = [];
		const errors: any[] = [];

		for (const operation of operations) {
			try {
				let result;

				switch (operation.type) {
					case "create":
						result = await taskOrderAPIService.createTaskOrder(
							token,
							requestId,
							{
								...operation.data,
								created_by: userId,
								updated_by: userId,
							}
						);
						break;

					case "update":
						if (!operation.data.id) {
							throw new Error(
								"รหัสใบงานย่อย (task ID) จำเป็นสำหรับการอัปเดต"
							);
						}
						result = await taskOrderAPIService.updateTaskOrder(
							token,
							operation.data.id,
							{
								...operation.data,
								updated_by: userId,
							}
						);
						break;

					case "delete":
						if (!operation.data.id) {
							throw new Error(
								"รหัสใบงานย่อย (task ID) จำเป็นสำหรับการลบ"
							);
						}

						result = await taskOrderAPIService.deleteTaskOrder(
							token,
							operation.data.id,
							userId
						);

						break;

					default:
						throw new Error(
							`Unknown operation type: ${operation.type}`
						);
				}

				results.push({
					operation: operation.type,
					taskId: operation.data.id,
					success: true,
					data: result,
				});
			} catch (error: any) {
				errors.push({
					operation: operation.type,
					taskId: operation.data.id,
					success: false,
					error: error.message,
				});
			}
		}

		return {
			success: errors.length === 0,
			results,
			errors,
		};
	},
};

export async function updateTaskOrderStatus({
	token,
	taskId,
	status,
	comment,
	user_id,
}: {
	token: string;
	taskId: number;
	status: string;
	comment?: string;
	user_id: number;
}) {
	return await PATCH(`/task-orders/${taskId}/set/status`, {
		token,
		body: {
			status,
			comment,
			user_id,
		},
	});
}

export async function updateTaskOrderActualArea({
	token,
	taskId,
	addActualArea,
	user_id,
}: {
	token: string;
	taskId: number;
	addActualArea: number;
	user_id: number;
}) {
	return await PATCH(`/task-orders/${taskId}/set/actual-area`, {
		token,
		body: {
			addActualArea,
			user_id,
		},
	});
}
