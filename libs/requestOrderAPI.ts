import { GET, POST, PATCH } from "./httpClient";

import { UploadedFile } from "@/interfaces/interfaces";

export async function getRequestOrders({
	token,
	paramData,
}: {
	token: string;
	paramData?: Record<string, any>;
}): Promise<any> {
	return await GET("/request-orders", {
		token,
		params: paramData,
	});
}

export async function getRequestOrderWithTask({
	token,
	requestId,
}: {
	token: string;
	requestId: number;
}): Promise<any> {
	return await GET(`/request-orders/${requestId}/get-task`, {
		token,
	});
}

export async function KeyInRequestOrder({
	token,
	data,
}: {
	token: string;
	data: Record<string, any>;
}): Promise<any> {
	return await POST("/request-orders/create/key-in", {
		token,
		body: data,
	});
}

export async function SetStatusRequestOrder({
	token,
	rid,
	paramData,
}: {
	token: string;
	rid: number;
	paramData?: {
		status?: string;
		comment?: string;
	};
}): Promise<any> {
	return await PATCH(`/request-orders/${rid}/set/status`, {
		token,
		body: paramData,
	});
}

// export async function uploadRequestOrder({
// 	token,
// 	ae_id,
// 	uploadedFiles,
// }: {
// 	token: string;
// 	ae_id: number;
// 	uploadedFiles: UploadedFile[];
// }) {
// 	const formData = new FormData();

// 	formData.append("ae_id", ae_id.toString());
// 	uploadedFiles.forEach((fileData) => {
// 		formData.append("files", fileData.file);
// 	});

// 	const response = await fetch("/api/proxy/request-orders/create/excel", {
// 		method: "POST",
// 		headers: {
// 			Authorization: `Bearer ${token}`,
// 		},
// 		body: formData,
// 	});

// 	if (!response.ok) {
// 		const errorData = await response.json();

// 		throw {
// 			status: response.status,
// 			message: errorData.message,
// 		};
// 	}

// 	return await response.json();
// }

export async function uploadRequestOrder({
	token,
	ae_id,
	uploadedFiles,
}: {
	token: string;
	ae_id: number;
	uploadedFiles: UploadedFile[];
}): Promise<any> {
	const formData = new FormData();

	formData.append("ae_id", ae_id.toString());
	uploadedFiles.forEach((fileData) => {
		formData.append("files", fileData.file);
	});

	try {
		const response = await fetch(
			"/aes/api/proxy/request-orders/create/excel",
			{
				method: "POST",
				headers: {
					Authorization: `Bearer ${token}`,
				},
				body: formData,
			}
		);

		const data = await response.json();

		if (!response.ok) {
			throw {
				status: response.status,
				message: data?.message || response.statusText,
			};
		}

		return data;
	} catch (error: any) {
		if (error.status && error.message) {
			throw error;
		}
		throw {
			status: 500,
			message: error?.message || "Unknown error",
		};
	}
}
