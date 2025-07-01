import axios from "axios";

export interface LoginParams {
  username: string;
  password: string;
  ae_id: number | null;
  operation_area_id: number | null;
}

export async function LoginUser({
  username,
  password,
  ae_id,
  operation_area_id,
}: LoginParams): Promise<any> {
  const apiUrl = process.env.API_URL || "http://localhost:8080";

  const isEmail = username.includes("@mitrphol.com");
  const body = isEmail
    ? { email: username, password: password, ae_id, operation_area_id }
    : { username: username, password: password, ae_id, operation_area_id };

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

// export async function getProfile(userId: number): Promise<any> {
//   const apiUrl = process.env.API_URL || "http://localhost:8080";

//   try {
//     const response = await axios.get(`${apiUrl}/api/v1/mitr-portal/users/${userId}`, {
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });

//     return response.data.data;
//   } catch (error: any) {
//     if (axios.isAxiosError(error)) {
//       throw new Error(
//         `Failed to fetch user profile: ${error.response?.status} ${error.response?.statusText || error.message}`
//       );
//     }

//     throw error;
//   }
// }