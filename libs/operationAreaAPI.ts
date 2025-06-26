import axios from "axios";

const numberKeys = ["ae_id", "customer_type_id"];

export async function getOperationAreas(paramData: Record<string, any>) {
  const apiUrl = process.env.API_URL || "http://localhost:8080";

  const params: Record<string, any> = {};

  Object.entries(paramData).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") {
      params[key] = null;
    } else if (numberKeys.includes(key)) {
      const num = Number(value);
      params[key] = isNaN(num) ? null : num;
    } else {
      params[key] = value;
    }
  });

  try {
    const response = await axios.get(`${apiUrl}/api/v1/operation-areas`, {
      params,
      headers: {
        "Content-Type": "application/json",
      },
    });

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