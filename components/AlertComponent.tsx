import type { AlertComponentProps } from "@/interfaces/props";

import { Alert } from "@heroui/react";
import React, { useEffect, useState } from "react";

export default function AlertComponent({
	title,
	description,
	size = "expanded",
	color = "default",
	variant = "faded",
	placement = "top",
	isVisible = true,
	handleClose,
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

	const placementClass =
		placement === "bottom"
			? "fixed left-0 right-0 bottom-0 z-50 flex items-center justify-center w-full p-3"
			: "fixed left-0 right-0 top-16 z-50 flex items-center justify-center w-full p-3 ";

	return (
		<div className={placementClass}>
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
		</div>
	);
}
