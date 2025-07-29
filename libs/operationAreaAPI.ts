import { GET } from "./httpClient";

export async function getOperationAreas({
	token,
	paramData,
}: {
	token?: string;
	paramData?: Record<string, any>;
}): Promise<any> {
	return await GET("/operation-areas", {
		token,
		params: paramData,
	});
}

export async function getOperationAreasUser({
	token,
}: {
	token: string;
}): Promise<any> {
	return await GET("/users/operation-area", { token });
}
