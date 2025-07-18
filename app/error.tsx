"use client";

import clsx from "clsx";
import { Button } from "@heroui/button";

import { fontMono } from "@/config/fonts";
import FuzzyText from "@/components/FuzzyTextComponent";

export default function Error({
	error,
	reset,
}: {
	error: Error;
	reset: () => void;
}) {
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
							color="rgba(239, 68, 68, 0.9)"
							fontSize="9rem"
							fontWeight={700}
							hoverIntensity={0.35}
						>
							ERROR
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
							Something went wrong !
						</FuzzyText>
					</div>
				</div>

				{/* Error Message Section */}
				<div className="w-full px-6 py-4 border rounded-lg bg-danger-50 dark:bg-danger-900/20 border-danger-200 dark:border-danger-800">
					<p className="text-xs font-medium leading-relaxed break-words sm:text-sm md:text-md text-danger-700 dark:text-danger-300">
						{error.message}
					</p>
				</div>

				{/* Action Button */}
				<div className="flex justify-center w-full">
					<Button
						className="w-full px-8 py-3 font-semibold transition-all duration-200 transform hover:scale-105"
						color="danger"
						radius="sm"
						size="lg"
						variant="solid"
						onPress={() => reset()}
					>
						ลองอีกครั้ง
					</Button>
				</div>
			</div>

			{/* Additional Info */}
			<div className="w-full text-xs text-center sm:text-sm text-foreground/50">
				<p>
					หากยังพบปัญหานี้อยู่ กรุณาติดต่อฝ่ายสนับสนุน
					หรือรีเฟรชหน้าเว็บเพื่อแก้ไขปัญหา
				</p>
			</div>
		</div>
	);
}
