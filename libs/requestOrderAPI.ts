import axios from "axios";

export default async function getRequestOrders() {
  const apiUrl = process.env.API_URL || "http://localhost:8080";

  try {
    const response = await axios.get(`${apiUrl}/api/v1/request-orders`, {
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true", // TODO: Remove ngrok-skip-browser-warning in production
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
