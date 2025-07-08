"use client";

import React from "react";
import { use } from "react";

export default function TaskManagementPage({
	params,
}: {
	params: Promise<{ tid: string }>;
}) {
	const { tid } = use(params);

	return <>Task Management Page for {tid}</>;
}
