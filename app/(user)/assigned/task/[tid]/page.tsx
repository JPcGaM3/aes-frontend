"use client";

import React from "react";
import { use } from "react";

import ProtectedRoute from "@/components/HigherOrderComponent";
import { USERROLE } from "@/utils/enum";

export default function TaskManagementPage({
	params,
}: {
	params: Promise<{ tid: string }>;
}) {
	const { tid } = use(params);

	return (
		<>
			<ProtectedRoute allowedRoles={[USERROLE.Admin, USERROLE.Driver]}>
				Task Management Page for {tid}
			</ProtectedRoute>
		</>
	);
}
