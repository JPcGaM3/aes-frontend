import type { AlertComponentProps } from "@/interfaces/props";

import { Alert } from "@heroui/react";
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export default function AlertComponent({
	title,
	description,
	size = "expanded",
	color = "default",
	variant = "faded",
	placement = "top",
	isVisible = true,
	handleClose,
	stackIndex = 0,
	totalAlerts = 1,
}: AlertComponentProps) {
	const [visible, setVisible] = useState(isVisible);

	useEffect(() => {
		setVisible(isVisible);
	}, [isVisible]);

	useEffect(() => {
		if (visible) {
			const timer = setTimeout(
				() => handleClose?.(),
				color == "success" ? 3000 : 5000
			);

			return () => clearTimeout(timer);
		}
	}, [visible]);

	let computedClassName = "";

	if (size === "compact") {
		computedClassName =
			"relative w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl";
	} else if (size === "expanded") {
		computedClassName =
			"relative w-full max-w-sm sm:max-w-lg md:max-w-2xl lg:max-w-4xl";
	} else {
		computedClassName = "relative w-full";
	}

	const stackOffset = stackIndex * 20;
	const zIndex = 45 + (totalAlerts - stackIndex);

	const placementClass =
		placement === "bottom"
			? "fixed left-3 mt-3 right-3 sm:left-auto md:right-6 sm:w-96 transition-all duration-300 ease-out"
			: "fixed left-3 mt-3 right-3 sm:left-auto md:right-6 sm:w-96 transition-all duration-300 ease-out";

	const placementStyle =
		placement === "bottom"
			? {
					bottom: `${16 + stackOffset}px`,
					zIndex: zIndex,
				}
			: {
					top: `${64 + stackOffset}px`,
					zIndex: zIndex,
				};

	const stackStyle = {
		...placementStyle,
		opacity: stackIndex === 0 ? 1 : Math.max(0.8 - stackIndex * 0.2, 0.4),
		transform: `scale(${Math.max(1 - stackIndex * 0.05, 0.9)})`,
	};

	const alertContent = (
		<div className={placementClass} style={stackStyle}>
			<Alert
				className={computedClassName}
				color={color}
				description={description}
				isClosable={true}
				isVisible={visible}
				radius="sm"
				title={title}
				variant={variant}
				onClose={() => {
					setVisible(false);
					handleClose?.();
				}}
			/>

			{totalAlerts > 1 && stackIndex === 0 && (
				<div className="absolute z-10 flex items-center justify-center w-6 h-6 text-xs font-bold text-white rounded-full -top-2 -right-2 bg-primary">
					{totalAlerts}
				</div>
			)}
		</div>
	);

	return createPortal(alertContent, document.body);
}
