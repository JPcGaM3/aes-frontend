import axios from "axios";
import { UploadedFile } from "@/interfaces/interfaces";

const apiUrl = process.env.API_URL || "http://localhost:8080";
const numberKeys = [
  "start_year",
  "end_year",
  "target_area",
  "land_number",
  "ap_year",
];

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
    } else if (numberKeys.includes(key)) {
      const num = Number(value);
      params[key] = isNaN(num) ? null : num;
    } else {
      params[key] = value;
    }
  });

  try {
    const response = await axios.get(`${apiUrl}/api/v1/request-orders`, {
      params,
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return response.data.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        throw new Error("ไม่มีรายการในขณะนี้");
      }
      
      throw new Error(
        `Failed to fetch orders: ${error.response?.status} ${error.response?.statusText || error.message}`
      );
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
    if (axios.isAxiosError(error)) {
      throw new Error(
        `Failed to fetch operation areas: ${error.response?.status} ${error.response?.statusText || error.message}`
      );
    }

    throw error;
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
    } else if (numberKeys.includes(key)) {
      const num = Number(value);
      body[key] = isNaN(num) ? null : num;
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
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        throw new Error("There is no request orders.");
      }
      throw new Error(
        `Failed to fetch orders: ${error.response?.status} ${error.response?.statusText || error.message}`
      );
    }

    throw error;
  }
}
