import axios from "axios";

export async function getActivities({ token }: { token: string }) {
  const apiUrl = process.env.API_URL || "http://localhost:8080";

  try {
    const response = await axios.get(`${apiUrl}/api/v1/activities`, {
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
