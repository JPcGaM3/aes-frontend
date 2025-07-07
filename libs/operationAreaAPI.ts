import axios from "axios";

export async function getOperationAreas({
  token,
  paramData,
}: {
  token?: string;
  paramData?: Record<string, any>;
}) {
  const apiUrl = process.env.API_URL || "http://localhost:8080";
  const params: Record<string, any> = {};

  Object.entries(paramData || {}).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") {
      params[key] = null;
    } else {
      params[key] = value;
    }
  });

  try {
    const response = await axios.get(`${apiUrl}/api/v1/operation-areas`, {
      params: params,
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
