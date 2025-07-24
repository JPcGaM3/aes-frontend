import { GET } from "./httpClient";

export async function getAeAreaAll({ token }: { token: string }): Promise<any> {
	return await GET("/ae-areas", { token });
}

export async function getAeArea({ token }: { token: string }): Promise<any> {
	return await GET("/users/ae-area", { token });
}
