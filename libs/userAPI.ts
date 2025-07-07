import axios from "axios";

export interface LoginParams {
  username: string;
  password: string;
  ae_area_id: number | null;
}

export async function LoginUser({
  username,
  password,
  ae_area_id,
}: LoginParams): Promise<any> {
  const apiUrl = process.env.API_URL || "http://localhost:8080";

  const isEmail = username.includes("@mitrphol.com");
  const body = isEmail
    ? { email: username, password: password }
    : { username: username, password: password };

  const queryParams = ae_area_id ? `?ae_id=${ae_area_id}` : "";

  try {
    const response = await axios.post(
      `${apiUrl}/api/v1/mitr-portal/login${queryParams}`,
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
      throw new Error(
        `${error.response?.statusText}: ${error.response?.data.message || error.message}`
      );
    }

    throw error;
  }
}

export async function getProfile({ token }: { token: string }): Promise<any> {
  const apiUrl = process.env.API_URL || "http://localhost:8080";

  try {
    const response = await axios.get(`${apiUrl}/api/v1/mitr-portal/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return response.data.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        `${error.response?.statusText}: ${error.response?.data.message || error.message}`
      );
    }

    throw error;
  }
}

export async function getUsers({ token }: { token: string }) {
  const apiUrl = process.env.API_URL || "http://localhost:8080";

  try {
    const response = await axios.get(`${apiUrl}/api/v1/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return response.data.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        `${error.response?.statusText}: ${error.response?.data.message || error.message}`
      );
    }

    throw error;
  }
}
