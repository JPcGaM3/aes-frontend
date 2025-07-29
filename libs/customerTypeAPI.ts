import { GET } from "./httpClient";

export async function getCustomerTypes({
	token,
}: {
	token: string;
}): Promise<any> {
	return await GET("/customer-types", { token });
}
