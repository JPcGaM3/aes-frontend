import axios from "axios";

export async function getCars({
	token,
	paramData,
}: {
	token: string;
	paramData?: {
		ae_id?: number;
	};
}) {
	const apiUrl = process.env.API_URL || "http://localhost:8080";
	const params: Record<string, any> = {};

	if (paramData) {
		if (paramData.ae_id) {
			params.ae_id = paramData.ae_id;
		}
	}

	try {
		const response = await axios.get(`${apiUrl}/api/v1/cars`, {
			params,
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
