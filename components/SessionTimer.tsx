"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { clsx } from "clsx";

import { useAuth } from "@/providers/AuthContext";
import { useAlert } from "@/providers/AlertContext";
import { fontMono } from "@/config/fonts";
import { HourglassAnimatedIcon } from "@/utils/animated-icons";

export default function SessionTimer() {
	const router = useRouter();
	const { sessionTimeLeft, isSessionExpired, logout } = useAuth();
	const { showAlert } = useAlert();

	useEffect(() => {
		if (isSessionExpired) {
			showAlert({
				title: "เซสชันหมดอายุ",
				description: "เซสชันของคุณหมดอายุแล้ว กรุณาเข้าสู่ระบบใหม่",
				color: "warning",
			});

			setTimeout(() => {
				logout();
				router.push("/login");
			}, 2000);
		}
	}, [isSessionExpired, showAlert, logout, router]);

	const formatTime = (seconds: number) => {
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = seconds % 60;

		return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
	};

	const getTimerColor = () => {
		if (sessionTimeLeft <= 300) return "text-red-500";
		if (sessionTimeLeft <= 600) return "text-orange-500";

		return "text-gray-600";
	};

	if (sessionTimeLeft <= 0) return null;

	return (
		<div
			className={clsx(
				"flex flex-row justify-center items-center bg-default-100 pl-2 pr-4 gap-2 rounded-lg h-full font-mono font-semibold text-sm",
				fontMono.variable,
				getTimerColor()
			)}
		>
			<div className="items-center opacity-70">
				<HourglassAnimatedIcon format="lottie" size={40} />
			</div>

			<span className="items-center sm:text-l md:text-xl lg:text-2xl">
				{formatTime(sessionTimeLeft)}
			</span>
		</div>
	);
}
