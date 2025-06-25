import axios from "axios";

export default async function getCustomerTypes() {
  const apiUrl = process.env.API_URL || "http://localhost:8080";

  try {
    const response = await axios.get(`${apiUrl}/api/v1/customer-types`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.data.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        `Failed to fetch customer types: ${error.response?.status} ${error.response?.statusText || error.message}`
      );
    }
    
    throw error;
  }
}
