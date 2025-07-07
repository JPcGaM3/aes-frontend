import axios from "axios";
import { UploadedFile } from "@/interfaces/interfaces";

const apiUrl = process.env.API_URL || "http://localhost:8080";

export async function getRequestOrders({
    token,
    paramData,
}: {
    token: string;
    paramData?: Record<string, any>;
}) {
    const params: Record<string, any> = {};

    Object.entries(paramData || {}).forEach(([key, value]) => {
        if (
            value === undefined ||
            value === null ||
            value === "" ||
            value === "all"
        ) {
            params[key] = null;
        } else {
            params[key] = value;
        }
    });

    try {
        const response = await axios.get(`${apiUrl}/api/v1/request-orders`, {
            params,
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

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

export async function getRequestOrderWithTask({
    token,
    requestId,
}: {
    token: string;
    requestId: number;
}) {
    try {
        const response = await axios.get(
            `${apiUrl}/api/v1/request-orders/${requestId}/get-task`,
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

export async function uploadRequestOrder({
    token,
    uploadedFiles,
}: {
    token: string;
    uploadedFiles: UploadedFile[];
}) {
    const formData = new FormData();

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

        return response.data.data;
    } catch (error: any) {
        throw new Error(
            `${error.response?.statusText}: ${error.response?.data.message || error.message}`
        );
    }
}

export async function KeyInRequestOrder({
    token,
    data,
}: {
    token: string;
    data: Record<string, any>;
}) {
    const body: Record<string, any> = {};

    Object.entries(data).forEach(([key, value]) => {
        if (
            value === undefined ||
            value === null ||
            value === "" ||
            value === "all"
        ) {
            body[key] = null;
        } else {
            body[key] = value;
        }
    });

    try {
        const response = await axios.post(
            `${apiUrl}/api/v1/request-orders/create/key-in`,
            body,
            {
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
