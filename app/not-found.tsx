"use client";

import { useRouter } from "next/navigation";
import { Button } from "@heroui/button";
import clsx from "clsx";

import FuzzyText from "@/components/FuzzyTextComponent";
import { fontMono } from "@/config/fonts";

export default function NotFoundPage() {
	const router = useRouter();

	return (
		// <div className="flex flex-col items-center justify-center w-full h-[calc(100vh-120px)]">
		// 	<div className="flex flex-col items-center justify-center w-full h-full max-w-lg gap-12 text-center">
		// 		<div
		// 			className={clsx(
		// 				"flex flex-col items-center w-full gap-2",
		// 				fontMono.className
		// 			)}
		// 		>
		// 			<FuzzyText
		// 				baseIntensity={0.15}
		// 				color="rgba(156, 163, 175, 1)"
		// 				fontSize="9rem"
		// 				fontWeight={700}
		// 				hoverIntensity={0.35}
		// 			>
		// 				404
		// 			</FuzzyText>
		// 			<FuzzyText
		// 				baseIntensity={0.12}
		// 				color="rgba(156, 163, 175, 0.9)"
		// 				fontSize="2rem"
		// 				fontWeight={500}
		// 				hoverIntensity={0.25}
		// 			>
		// 				This page could not be found.
		// 			</FuzzyText>
		// 		</div>
		// 		<div className="w-full px-6 py-4 border rounded-lg bg-danger-50 border-danger-200">
		// 			<p className="text-xs font-medium leading-relaxed break-words sm:text-sm md:text-md text-danger-700">
		// 				ขออภัย ไม่พบหน้าที่คุณร้องขอ กรุณาตรวจสอบ URL
		// 				หรือกลับไปหน้าหลัก
		// 			</p>
		// 		</div>
		// 		<Button
		// 			className="w-full px-8 py-3 font-semibold transition-all duration-200 transform hover:scale-105"
		// 			color="primary"
		// 			radius="sm"
		// 			size="lg"
		// 			variant="solid"
		// 			onPress={() => router.push("/home")}
		// 		>
		// 			กลับหน้าหลัก
		// 		</Button>
		// 	</div>
		// </div>

		<div className="flex flex-col items-center justify-between w-full h-[calc(100vh-120px)] ">
			<div className="flex flex-col items-center justify-center w-full h-full max-w-lg gap-12 text-center">
				{/* Error Title Section */}
				<div
					className={clsx(
						"flex flex-col items-center justify-center w-full",
						fontMono.className
					)}
				>
					<div className="relative w-full">
						<FuzzyText
							baseIntensity={0.15}
							color="rgba(156, 163, 175, 1)"
							fontSize="9rem"
							fontWeight={700}
							hoverIntensity={0.35}
						>
							404
						</FuzzyText>
					</div>

					<div className="relative w-full">
						<FuzzyText
							baseIntensity={0.12}
							color="rgba(156, 163, 175, 0.9)"
							fontSize="2rem"
							fontWeight={500}
							hoverIntensity={0.25}
						>
							This page could not be found.
						</FuzzyText>
					</div>
				</div>

				{/* Error Message Section */}
				<div className="w-full px-6 py-4 border rounded-lg bg-default-50 dark:bg-default-900/20 border-default-200 dark:border-default-800">
					<p className="text-xs font-medium leading-relaxed break-words sm:text-sm md:text-md text-default-700 dark:text-default-300">
						ขออภัย ไม่พบหน้าที่คุณร้องขอ กรุณาตรวจสอบ URL
						หรือกลับไปหน้าหลัก
					</p>
				</div>

				{/* Action Button */}
				<div className="flex flex-row justify-center w-full gap-2">
					<Button
						className="w-full px-8 py-3 font-semibold transition-all duration-200 transform hover:scale-105"
						color="default"
						radius="sm"
						size="lg"
						variant="flat"
						onPress={() => {
							router.back();
						}}
					>
						ย้อนกลับ
					</Button>

					<Button
						className="w-full px-8 py-3 font-semibold transition-all duration-200 transform hover:scale-105"
						color="default"
						radius="sm"
						size="lg"
						variant="solid"
						onPress={() => router.push("/home")}
					>
						กลับหน้าหลัก
					</Button>
				</div>
			</div>

			{/* Additional Info */}
			<div className="max-w-md text-xs text-center sm:text-sm text-foreground/50">
				<p>
					หากยังพบปัญหานี้อยู่ กรุณาติดต่อฝ่ายสนับสนุน
					หรือรีเฟรชหน้าเว็บเพื่อแก้ไขปัญหา
				</p>
			</div>
		</div>
	);
}
