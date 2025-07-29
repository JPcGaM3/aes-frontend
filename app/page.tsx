"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/providers/AuthContext";

export default function Home() {
	const router = useRouter();
	const { userContext } = useAuth();

	useEffect(() => {
		{
			userContext.token
				? router.replace("/home")
				: router.replace("/login");
		}
	}, [userContext, router]);

	return null;
}
