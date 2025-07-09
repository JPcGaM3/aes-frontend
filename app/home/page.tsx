"use client";

import { useEffect } from "react";

import Header from "@/components/Header";
import { useLoading } from "@/providers/LoadingContext";

export default function HomePage() {
	const { setIsLoading } = useLoading();

	useEffect(() => {
		setIsLoading(true);
		setIsLoading(false);
	}, []);

	return (
		<div>
			<Header subtitle="ยินดีต้อนรับสู่ AE Service" title="หน้าหลัก" />
		</div>
	);
}
