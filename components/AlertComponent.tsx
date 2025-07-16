import type { AlertComponentProps } from "@/interfaces/props";

import { Alert } from "@heroui/react";
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export default function AlertComponent({
	title,
	description,
	color = "default",
	variant = "faded",
	handleClose,
	stackIndex = 0,
	totalAlerts = 1,
	hideAllAlerts,
	isClosing: externalIsClosing,
}: AlertComponentProps) {
	const [isMounted, setIsMounted] = useState(false);
	const [isClosing, setIsClosing] = useState(false);
	const [isHoveringBadge, setIsHoveringBadge] = useState(false);

	const effectiveIsClosing = externalIsClosing ?? isClosing;

	useEffect(() => {
		const timer = setTimeout(() => {
			setIsMounted(true);
		}, 10);

		return () => clearTimeout(timer);
	}, []);

	const performClose = () => {
		setIsClosing(true);
		setTimeout(() => {
			handleClose?.();
		}, 300);
	};

	useEffect(() => {
		// Only start timer for the first visible alert (stackIndex === 0)
		if (isMounted && !effectiveIsClosing && stackIndex === 0) {
			const timer = setTimeout(
				performClose,
				color === "success" ? 2000 : 3000
			);

			return () => clearTimeout(timer);
		}
	}, [isMounted, effectiveIsClosing, color, stackIndex]);

	const getTotalAlertBadgeClasses = () => {
		const baseClasses = `absolute z-10 flex items-center justify-center min-w-6 w-fit h-6 text-xs font-semibold rounded-full -top-2 -right-2 shadow-lg ${isHoveringBadge ? "px-2" : "px-0"}`;

		const colorClasses = {
			default: {
				solid: "bg-default text-default-foreground",
				flat: "bg-default-100 text-default-foreground",
				faded: "bg-default-100 border-1 border-default-300 text-default-foreground",
				bordered: "bg-transparent border-1 border-default text-default",
			},
			primary: {
				solid: "bg-primary text-primary-foreground",
				flat: "bg-primary-50 text-primary-600",
				faded: "bg-primary-50 border-1 border-primary-200 text-primary-600",
				bordered: "bg-transparent border-1 border-primary text-primary",
			},
			secondary: {
				solid: "bg-secondary text-secondary-foreground",
				flat: "bg-secondary-50 text-secondary-600",
				faded: "bg-secondary-50 border-1 border-secondary-200 text-secondary-600",
				bordered:
					"bg-transparent border-1 border-secondary text-secondary",
			},
			success: {
				solid: "bg-success text-success-foreground",
				flat: "bg-success-50 text-success-700",
				faded: "bg-success-50 border-1 border-success-300 text-success-700",
				bordered: "bg-transparent border-1 border-success text-success",
			},
			warning: {
				solid: "bg-warning text-warning-foreground",
				flat: "bg-warning-50 text-warning-700",
				faded: "bg-warning-50 border-1 border-warning-300 text-warning-700",
				bordered: "bg-transparent border-1 border-warning text-warning",
			},
			danger: {
				solid: "bg-danger text-danger-foreground",
				flat: "bg-danger-50 text-danger-600",
				faded: "bg-danger-50 border-1 border-danger-200 text-danger-600",
				bordered: "bg-transparent border-1 border-danger text-danger",
			},
		};

		const colorClass =
			colorClasses[color]?.[variant] ||
			colorClasses.default[variant] ||
			"bg-primary-400 text-white";

		return `${baseClasses} ${colorClass}`;
	};

	const stackOffset = stackIndex * 10;
	const zIndex = 45 + (totalAlerts - stackIndex);

	const placementClass =
		"fixed left-3 mt-3 right-3 sm:left-auto md:right-6 sm:w-96 transition-all duration-300 ease-in-out";

	const scaleTransform = `scale(${Math.max(1 - stackIndex * 0.05, 0.9)})`;
	const slideTransform =
		isMounted && !effectiveIsClosing ? "translateX(0)" : "translateX(100%)";

	const stackStyle = {
		top: `${64 + stackOffset}px`,
		zIndex: zIndex,
		opacity:
			isMounted && !effectiveIsClosing
				? stackIndex === 0
					? 1
					: Math.max(0.7 - stackIndex * 0.1, 0.4)
				: 0,
		transform: `${scaleTransform} ${slideTransform}`,
	};

	const alertContent = (
		<div className={placementClass} style={stackStyle}>
			<Alert
				className="shadow-xl"
				color={color}
				description={description}
				isClosable={true}
				isVisible={true}
				radius="lg"
				title={title}
				variant={variant}
				onClose={performClose}
			/>

			{totalAlerts > 1 && stackIndex === 0 && (
				<button
					className={`${getTotalAlertBadgeClasses()} cursor-pointer transition-all duration-200 hover:scale-110 focus:ring-2 focus:ring-primary focus:ring-offset-1 focus:outline-none`}
					title={
						isHoveringBadge
							? "Clear all alerts"
							: `${totalAlerts} alerts`
					}
					type="button"
					onClick={() => hideAllAlerts?.()}
					onMouseEnter={() => setIsHoveringBadge(true)}
					onMouseLeave={() => setIsHoveringBadge(false)}
				>
					{isHoveringBadge ? "Clear All" : totalAlerts}
				</button>
			)}
		</div>
	);

	return createPortal(alertContent, document.body);
}
