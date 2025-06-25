import axios from "axios";

export default async function getRequestOrders(params: any) {
  const apiUrl = process.env.API_URL || "http://localhost:8080";

  try {
    const response = await axios.get(`${apiUrl}/api/v1/request-orders`, {
      params: {
        ...params,
      },
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true", // TODO: Remove ngrok-skip-browser-warning in production
      },
    });

    console.log("Fetched orders:", response.data.data);

    return response.data.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        `Failed to fetch orders: ${error.response?.status} ${error.response?.statusText || error.message}`
      );
    }
    
    throw error;
  }
}
