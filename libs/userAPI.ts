import axios from "axios";

export default async function LoginUser(
  username: string,
  password: string
): Promise<any> {
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

    console.log("Login Response:", response);

    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        `Failed to fetch token: ${error.response?.status} ${error.response?.statusText || error.message}`
      );
    }

    throw error;
  }
}
