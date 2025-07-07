import axios from "axios";

const numberKeys = ["ae_id", "customer_type_id"];

export async function getOperationAreas({
  paramData,
}: {
  paramData?: Record<string, any>;
}) {
  const apiUrl = process.env.API_URL || "http://localhost:8080";
  const params: Record<string, any> = {};

  Object.entries(paramData || {}).forEach(([key, value]) => {
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
    throw new Error(
      `${error.response?.statusText}: ${error.response?.data.message || error.message}`
    );
  }
}

export async function getOperationAreasUser({ token }: { token: string }) {
  const apiUrl = process.env.API_URL || "http://localhost:8080";

  try {
    const response = await axios.get(`${apiUrl}/api/v1/users/operation-area`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return response.data.data;
  } catch (error: any) {
    throw new Error(
      `${error.response?.statusText}: ${error.response?.data.message || error.message}`
    );
  }
}
