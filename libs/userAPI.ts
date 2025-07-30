import { GET, POST } from "./httpClient";

export interface LoginProps {
	params: {
		ae_id: number | null;
	};
	body:
	| { email: string; password: string }
	| { username: string; password: string };
}

export async function LoginUser({ params, body }: LoginProps): Promise<any> {
	console.log("LoginUser:", params, body)
	return await POST("/mitr-portal/login", {
		params,
		body,
	});
}

export async function getNewToken({ token }: { token: string }): Promise<any> {
	console.log("getNewToken:", token)
	return await GET("/mitr-portal/refresh-token", {
		token,
	});
}

export async function getProfile({ token }: { token: string }): Promise<any> {
	console.log("getProfile:", token)
	return await GET("/mitr-portal/profile", {
		token,
	});
}

export async function getUsers({
	token,
	paramData,
}: {
	token: string;
	paramData?: { ae_id?: number; role?: string[] };
}): Promise<any> {
	console.log("getUsers:", paramData)
	return await GET("/users", {
		token,
		params: paramData,
	});
}
