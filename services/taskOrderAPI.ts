import axios from "axios";

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

// Implementation of the service
export const taskOrderAPIService: TaskOrderAPIService = {
	// Update request order
	updateRequestOrder: async (
		token: string,
		requestId: number,
		data: Partial<RequestOrderFormData>
	) => {
		const apiUrl = process.env.API_URL || "http://localhost:8080";

		try {
			const response = await axios.patch(
				`${apiUrl}/api/v1/request-orders/${requestId}/update`,
				data,
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
					`Failed to update request order: ${error.response?.status} ${error.response?.statusText || error.message}`
				);
			}

			throw error;
		}
	},

	// Create new task order
	createTaskOrder: async (token: string, requestId: number, data: any) => {
		const apiUrl = process.env.API_URL || "http://localhost:8080";

		const taskData = {
			...data,
			request_order_id: requestId,
		};

		try {
			const response = await axios.post(
				`${apiUrl}/api/v1/task-orders/create`,
				taskData,
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
					`Failed to create task order: ${error.response?.status} ${error.response?.statusText || error.message}`
				);
			}

			throw error;
		}
	},

	// Update existing task order
	updateTaskOrder: async (token: string, taskId: number, data: any) => {
		const apiUrl = process.env.API_URL || "http://localhost:8080";

		try {
			const response = await axios.patch(
				`${apiUrl}/api/v1/task-orders/${taskId}/set/assigned`,
				data,
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
					`Failed to update task order: ${error.response?.status} ${error.response?.statusText || error.message}`
				);
			}

			throw error;
		}
	},

	// Delete task order (set active to false)
	deleteTaskOrder: async (token: string, taskId: number) => {
		const apiUrl = process.env.API_URL || "http://localhost:8080";

		try {
			const response = await axios.patch(
				`${apiUrl}/api/v1/task-orders/${taskId}/set/active`,
				{
					active: false,
				},
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
					`Failed to delete task order: ${error.response?.status} ${error.response?.statusText || error.message}`
				);
			}

			throw error;
		}
	},

	// Process all task order operations
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
							throw new Error("Task order ID is required for update");
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
							throw new Error("Task order ID is required for delete");
						}

						result = await taskOrderAPIService.deleteTaskOrder(
							token,
							operation.data.id,
							userId
						);

						break;

					default:
						throw new Error(`Unknown operation type: ${operation.type}`);
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
	const apiUrl = process.env.API_URL || "http://localhost:8080";

	try {
		const response = await axios.patch(
			`${apiUrl}/api/v1/task-orders/${taskId}/set/status`,
			{
				status,
				comment,
				user_id,
			},
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
				`Failed to update task order status: ${error.response?.status} ${error.response?.statusText || error.message}`
			);
		}

		throw error;
	}
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
	const apiUrl = process.env.API_URL || "http://localhost:8080";

	try {
		const response = await axios.patch(
			`${apiUrl}/api/v1/task-orders/${taskId}/set/actual-area`,
			{
				addActualArea,
				user_id,
			},
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
				`Failed to update task order actual area: ${error.response?.status} ${error.response?.statusText || error.message}`
			);
		}

		throw error;
	}
}
