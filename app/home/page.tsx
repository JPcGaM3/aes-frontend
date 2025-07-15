"use client";

import { useEffect } from "react";

import Header from "@/components/Header";
import { useLoading } from "@/providers/LoadingContext";
import ProtectedRoute from "@/components/HigherOrderComponent";
import { USERROLE } from "@/utils/enum";

export default function HomePage() {
	const { setIsLoading } = useLoading();

	useEffect(() => {
		setIsLoading(true);
		setIsLoading(false);
	}, []);

	return (
		<ProtectedRoute
			allowedRoles={[
				USERROLE.Admin,
				USERROLE.DepartmentHead,
				USERROLE.UnitHead,
				USERROLE.Driver,
			]}
		>
			<div>
				<Header
					subtitle="ยินดีต้อนรับสู่ AE Service"
					title="หน้าหลัก"
				/>
			</div>
		</ProtectedRoute>
	);
}
