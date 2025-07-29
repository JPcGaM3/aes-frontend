import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import qs from "qs";

import { getApiBaseUrl } from "@/utils/functions";

const API_BASE_URL = getApiBaseUrl();

async function handleRequest(
	request: NextRequest,
	method: string,
	path: string[]
) {
	try {
		const token = request.headers.get("authorization");
		const url = new URL(request.url);

		const apiPath = `/${path.join("/")}`;
		const fullApiUrl = `${API_BASE_URL}/api/v1${apiPath}`;

		let requestData: any = {};
		let queryParams: Record<string, any> = {};

		url.searchParams.forEach((value, key) => {
			if (queryParams[key]) {
				if (Array.isArray(queryParams[key])) {
					queryParams[key].push(value);
				} else {
					queryParams[key] = [queryParams[key], value];
				}
			} else {
				queryParams[key] = value;
			}
		});

		const headers: Record<string, string> = {};

		if (token) {
			headers.Authorization = token;
		}

		const contentType = request.headers.get("content-type") || "";

		if (
			["POST", "PATCH", "PUT"].includes(method) &&
			contentType.includes("multipart/form-data")
		) {
			const body = await request.arrayBuffer();
			const axiosConfig = {
				timeout: 10000,
				headers: {
					...headers,
					"Content-Type": contentType,
				},
				params: queryParams,
				paramsSerializer: (params: any) =>
					qs.stringify(params, { arrayFormat: "repeat" }),
			};

			const response = await axios.post(
				fullApiUrl,
				Buffer.from(body),
				axiosConfig
			);

			return NextResponse.json(response.data.data || response.data);
		}

		if (["POST", "PATCH", "PUT"].includes(method)) {
			try {
				const requestBody = await request.json();

				requestData = requestBody.body || {};
				if (requestBody.params) {
					queryParams = { ...queryParams, ...requestBody.params };
				}
			} catch (error: any) {
				error.status = 400;
				throw error;
			}
		}

		const axiosConfig = {
			timeout: 10000,
			headers: {
				...headers,
				"Content-Type": "application/json",
			},
			params: queryParams,
			paramsSerializer: (params: any) =>
				qs.stringify(params, { arrayFormat: "repeat" }),
		};

		let response;

		switch (method) {
			case "GET":
				response = await axios.get(fullApiUrl, axiosConfig);
				break;
			case "POST":
				response = await axios.post(
					fullApiUrl,
					requestData,
					axiosConfig
				);
				break;
			case "PATCH":
				response = await axios.patch(
					fullApiUrl,
					requestData,
					axiosConfig
				);
				break;
			case "PUT":
				response = await axios.put(
					fullApiUrl,
					requestData,
					axiosConfig
				);
				break;
			case "DELETE":
				response = await axios.delete(fullApiUrl, axiosConfig);
				break;
			default:
				return NextResponse.json(
					{ message: `Method ${method} not allowed` },
					{ status: 405 }
				);
		}

		return NextResponse.json(response.data.data || response.data);
	} catch (error: any) {
		if (axios.isAxiosError(error)) {
			if (error.code === "ENOTFOUND" || error.code === "ECONNREFUSED") {
				return NextResponse.json(
					{
						status: 503,
						message: `Backend service unavailable. Cannot connect to ${API_BASE_URL}`,
						details: error.message,
					},
					{ status: 503 }
				);
			}

			return NextResponse.json(
				{
					status: error.response?.status || 500,
					message: `${error.response?.statusText}: ${error.response?.data?.message || error.message}`,
				},
				{ status: error.response?.status || 500 }
			);
		}

		return NextResponse.json(
			{
				message: error.message,
				details: `Failed to connect to backend at ${API_BASE_URL}`,
			},
			{ status: 500 }
		);
	}
}

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ path: string[] }> }
) {
	const resolvedParams = await params;

	return handleRequest(request, "GET", resolvedParams.path);
}

export async function POST(
	request: NextRequest,
	{ params }: { params: Promise<{ path: string[] }> }
) {
	const resolvedParams = await params;

	return handleRequest(request, "POST", resolvedParams.path);
}

export async function PATCH(
	request: NextRequest,
	{ params }: { params: Promise<{ path: string[] }> }
) {
	const resolvedParams = await params;

	return handleRequest(request, "PATCH", resolvedParams.path);
}

export async function PUT(
	request: NextRequest,
	{ params }: { params: Promise<{ path: string[] }> }
) {
	const resolvedParams = await params;

	return handleRequest(request, "PUT", resolvedParams.path);
}

export async function DELETE(
	request: NextRequest,
	{ params }: { params: Promise<{ path: string[] }> }
) {
	const resolvedParams = await params;

	return handleRequest(request, "DELETE", resolvedParams.path);
}
