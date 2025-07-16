"use client";

import clsx from "clsx";

import FuzzyText from "@/components/FuzzyTextComponent";
import { fontMono } from "@/config/fonts";

export default function UnAuthorizePage() {
	return (
		<div className="flex items-center justify-center w-full h-full px-12">
			<div className="w-full max-w-lg space-y-8 text-center">
				<div
					className={clsx(
						"flex flex-col space-y-8 justify-center items-center",
						fontMono.className
					)}
				>
					<FuzzyText
						baseIntensity={0.15}
						color="rgba(59, 130, 246, 0.9)"
						enableHover={true}
						fontFamily="inherit"
						fontSize="9rem"
						fontWeight={700}
						// fullWidth={true}
						hoverIntensity={0.35}
					>
						401
					</FuzzyText>

					<FuzzyText
						baseIntensity={0.12}
						color="#000"
						enableHover={true}
						fontFamily="inherit"
						fontSize="3rem"
						fontWeight={500}
						// fullWidth={true}
						hoverIntensity={0.25}
					>
						Unauthorized
					</FuzzyText>
				</div>

				<div className="w-full pl-2 md:pl-3 lg:pl-4">
					<p className="text-sm font-medium leading-relaxed sm:text-md md:text-lg lg:text-xl text-foreground/60">
						การเข้าถึงถูกปฏิเสธ คุณไม่มีสิทธิ์ในการดูหน้านี้
						กรุณาติดต่อผู้ดูแลระบบหรือเข้าสู่ระบบใหม่อีกครั้ง
					</p>
				</div>
			</div>
		</div>
	);
}
