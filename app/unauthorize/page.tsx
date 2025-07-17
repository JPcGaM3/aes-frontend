"use client";

import clsx from "clsx";
import { Button } from "@heroui/button";
import { useRouter } from "next/navigation";

import FuzzyText from "@/components/FuzzyTextComponent";
import { fontMono } from "@/config/fonts";

export default function UnAuthorizePage() {
	const router = useRouter();

	return (
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
							color="rgba(59, 130, 246, 0.9)"
							fontSize="9rem"
							fontWeight={700}
							hoverIntensity={0.35}
						>
							401
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
							Something went wrong!
						</FuzzyText>
					</div>
				</div>

				{/* Error Message Section */}
				<div className="w-full px-6 py-4 border rounded-lg bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-800">
					<p className="text-xs font-medium leading-relaxed break-words sm:text-sm md:text-md text-primary-700 dark:text-primary-300">
						การเข้าถึงถูกปฏิเสธ คุณไม่มีสิทธิ์ในการดูหน้านี้
						กรุณาติดต่อผู้ดูแลระบบหรือเข้าสู่ระบบใหม่อีกครั้ง
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
						color="primary"
						radius="sm"
						size="lg"
						variant="solid"
						onPress={() => {
							router.push("/login");
						}}
					>
						เข้าสู่ระบบใหม่
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
