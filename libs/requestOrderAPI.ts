import axios from "axios";

export default async function getRequestOrders(paramData: Record<string, any>) {
  const apiUrl = process.env.API_URL || "http://localhost:8080";

  const numberKeys = ["ae_id", "customer_type_id", "start_year", "end_year"];
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

  console.log("Fetching orders with params:", params);

  try {
    const response = await axios.get(`${apiUrl}/api/v1/request-orders`, {
      params,
      headers: {
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
