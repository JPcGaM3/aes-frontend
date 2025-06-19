import axios from "axios";

export default async function getRequestOrder() {
  const apiUrl = process.env.API_URL || "http://localhost:8080/api/v1";

  try {
    const response = await axios.get(`${apiUrl}/api/v1/request-orders`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        `Failed to fetch orders: ${error.response?.status} ${error.response?.statusText || error.message}`
      );
    }
    throw error;
  }
}
