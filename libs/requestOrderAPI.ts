import axios from "axios";
import { UploadedFile } from "@/interfaces/interfaces";

const apiUrl = process.env.API_URL || "http://localhost:8080";
const numberKeys = [
  "ae_id",
  "customer_type_id",
  "start_year",
  "end_year",
  "operation_area_id",
  "target_area",
  "land_number",
  "ap_year",
  "user_id",
];

export async function getRequestOrders({
  paramData,
  token,
}: {
  paramData: Record<string, any>;
  token: string;
}) {
  const params: Record<string, any> = {};

  Object.entries(paramData).forEach(([key, value]) => {
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
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

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

export async function uploadRequestOrder({
  uploadedFiles,
  aeId,
  userId,
  token,
}: {
  uploadedFiles: UploadedFile[];
  aeId: number;
  userId: number;
  token: string;
}) {
  // Create formData object -> handle files
  const formData = new FormData();

  // Append each file to formData object -> use key 'files'
  uploadedFiles.forEach((fileData) => {
    formData.append("files", fileData.file);
  });

  formData.append("ae_id", aeId.toString());
  formData.append("user_id", userId.toString());

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
    if (axios.isAxiosError(error) && error.response) {
      console.error("API Error Response:", error.response.data);
      console.error("API Status:", error.response.status);
    } else if (axios.isAxiosError(error) && error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Error:", error);
    }
  }
}

export async function KeyInRequestOrder({
  data,
}: {
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
