import { GET } from "./httpClient";

export async function getCars({
	token,
	paramData,
}: {
	token: string;
	paramData?: {
		ae_id?: number;
	};
}): Promise<any> {
	return await GET("/cars", {
		token,
		params: paramData,
	});
}
