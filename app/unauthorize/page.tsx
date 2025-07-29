"use client";

import clsx from "clsx";
import { Button } from "@heroui/button";
import { useRouter } from "next/navigation";

import FuzzyText from "@/components/FuzzyTextComponent";
import { fontMono } from "@/config/fonts";
import { useAuth } from "@/providers/AuthContext";

export default function UnAuthorizePage() {
	const router = useRouter();
	const { logout } = useAuth();

	return (
		<div className="flex flex-col justify-between items-center w-full h-[calc(100vh-120px)]">
			<div className="flex flex-col justify-center items-center gap-12 w-full max-w-lg h-full text-center">
				{/* Error Title Section */}
				<div
					className={clsx(
						"flex flex-col justify-center items-center w-full",
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
							Unauthorize!
						</FuzzyText>
					</div>
				</div>

				{/* Error Message Section */}
				<div className="bg-primary-50 dark:bg-primary-900/20 px-6 py-4 border border-primary-200 dark:border-primary-800 rounded-lg w-full">
					<p className="font-medium text-primary-700 md:text-md dark:text-primary-300 text-xs sm:text-sm break-words leading-relaxed">
						การเข้าถึงถูกปฏิเสธ คุณไม่มีสิทธิ์ในการดูหน้านี้
						กรุณาติดต่อผู้ดูแลระบบหรือเข้าสู่ระบบใหม่อีกครั้ง
					</p>
				</div>

				{/* Action Button */}
				<div className="flex flex-row justify-center gap-2 w-full">
					<Button
						className="px-8 py-3 w-full font-semibold hover:scale-105 transition-all duration-200 transform"
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
						className="px-8 py-3 w-full font-semibold hover:scale-105 transition-all duration-200 transform"
						color="primary"
						radius="sm"
						size="lg"
						variant="solid"
						onPress={() => {
							logout();
							router.push("/login");
						}}
					>
						เข้าสู่ระบบใหม่
					</Button>
				</div>
			</div>

			{/* Additional Info */}
			<div className="w-full text-foreground/50 text-xs sm:text-sm text-center">
				<p>
					หากยังพบปัญหานี้อยู่ กรุณาติดต่อฝ่ายสนับสนุน
					หรือรีเฟรชหน้าเว็บเพื่อแก้ไขปัญหา
				</p>
			</div>
		</div>
	);
}
