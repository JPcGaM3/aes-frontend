import axios from "axios";

import { GET, POST, PATCH } from "./httpClient";

import { UploadedFile } from "@/interfaces/interfaces";
import { getApiBaseUrl } from "@/utils/functions";

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

export async function uploadRequestOrder({
	token,
	ae_id,
	uploadedFiles,
}: {
	token: string;
	ae_id: number;
	uploadedFiles: UploadedFile[];
}) {
	const apiUrl = getApiBaseUrl();

	const formData = new FormData();

	formData.append("ae_id", ae_id.toString());

	uploadedFiles.forEach((fileData) => {
		formData.append("files", fileData.file);
	});

	try {
		const response = await axios.post(
			`${apiUrl}/api/v1/request-orders/create/excel`,
			formData,
			{
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "multipart/form-data",
				},
			}
		);

		return response.data;
	} catch (error: any) {
		throw {
			status: error.response?.status,
			message: `${error.response?.statusText}: ${error.response?.data.message || error.message}`,
		};
	}
}
