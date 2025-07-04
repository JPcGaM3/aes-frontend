import axios from "axios";

export interface LoginParams {
  username: string;
  password: string;
  operation_area_id: number | null;
}

export async function LoginUser({
  username,
  password,
}: LoginParams): Promise<any> {
  const apiUrl = process.env.API_URL || "http://localhost:8080";

  const isEmail = username.includes("@mitrphol.com");
  const body = isEmail
    ? { email: username, password: password }
    : { username: username, password: password };

  try {
    const response = await axios.post(
      `${apiUrl}/api/v1/mitr-portal/login`,
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
      if (error.response?.status === 401) {
        throw new Error("Invalid username or password.");
      }

      throw new Error(
        `Failed to fetch token: ${error.response?.status} ${error.response?.statusText || error.message}`
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
      if (error.response?.status === 401) {
        throw new Error("Unauthorized access - please log in.");
      } else if (error.response?.status === 404) {
        throw new Error("User profile not found.");
      }

      throw new Error(
        `Failed to fetch user profile: ${error.response?.status} ${error.response?.statusText || error.message}`
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
        `Failed to fetch cars: ${error.response?.status} ${error.response?.statusText || error.message}`
      );
    }

    throw error;
  }
}
