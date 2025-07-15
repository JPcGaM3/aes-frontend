"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { useAuth } from "@/providers/AuthContext";
import { useLoading } from "@/providers/LoadingContext";

interface ProtectedRouteProps {
	children: React.ReactNode;
	allowedRoles: string[];
}

export default function ProtectedRoute({
	children,
	allowedRoles,
}: ProtectedRouteProps) {
	const { userContext, isReady } = useAuth();
	const { setIsLoading } = useLoading();
	const router = useRouter();

	const hasPermission = (allowedRoles: string[]) => {
		if (!allowedRoles || allowedRoles.length === 0) {
			return true;
		}

		if (!userContext?.token || !userContext?.role) return false;

		const allowedRoleStrings = allowedRoles.map((role) => String(role));

		if (Array.isArray(userContext.role)) {
			return userContext.role.some((userRole) =>
				allowedRoleStrings.includes(String(userRole))
			);
		}

		return allowedRoleStrings.includes(String(userContext.role));
	};

	useEffect(() => {
		if (!isReady) {
			setIsLoading(true);

			return;
		}

		if (!userContext?.token) {
			setIsLoading(false);
			router.push("/login");

			return;
		}

		if (!hasPermission(allowedRoles)) {
			setIsLoading(false);
			router.push("/unauthorize");

			return;
		}

		setIsLoading(false);
	}, [userContext, isReady, router, allowedRoles, setIsLoading]);

	if (!isReady || !userContext?.token || !hasPermission(allowedRoles)) {
		return null;
	}

	return <>{children}</>;
}
