import { GET } from "./httpClient";

export async function getActivities({
	token,
}: {
	token: string;
}): Promise<any> {
	return await GET("/activities", { token });
}
