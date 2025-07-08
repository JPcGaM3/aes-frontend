import type { FormButtonsProps } from "@/interfaces/props";

import React from "react";
import { Button } from "@heroui/button";

export default function FormButtons({
	onSubmit,
	onCancel,
	size = "compact",
	buttonSize = "lg",
	hasBorder = true,
	submitLabel = "Submit",
	cancelLabel = "Cancel",
	submitColor = "primary",
	cancelColor = "default",
	isSubmitting = false,
	isCanceling = false,
	isDisabled = false,
	className = "flex flex-col text-center",
}: FormButtonsProps) {
	let computedClassName = "";
	if (size === "compact") {
		computedClassName = "w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl";
	} else if (size === "expanded") {
		computedClassName = "w-full max-w-sm sm:max-w-lg md:max-w-2xl lg:max-w-4xl";
	} else {
		computedClassName = "w-full";
	}

	return (
		<div className={`${computedClassName} ${className}`}>
			{hasBorder && <hr className="mb-6 border-gray-200" />}

			<div className="flex w-full gap-2">
				{onCancel && (
					<Button
						className="w-full font-semibold text-gray-500"
						color={cancelColor}
						size={buttonSize}
						radius="sm"
						variant="flat"
						isLoading={isCanceling}
						disabled={isDisabled}
						disableAnimation={isDisabled}
						onPress={onCancel}
					>
						{cancelLabel}
					</Button>
				)}

				{onSubmit ? (
					<Button
						className="w-full font-bold"
						color={submitColor}
						size={buttonSize}
						radius="sm"
						variant="flat"
						isLoading={isSubmitting}
						disabled={isDisabled}
						disableAnimation={isDisabled}
						onPress={onSubmit}
					>
						{submitLabel}
					</Button>
				) : (
					<Button
						className="w-full font-bold"
						color={submitColor}
						size={buttonSize}
						radius="sm"
						variant="flat"
						isLoading={isSubmitting}
						disabled={isDisabled}
						disableAnimation={isDisabled}
						type="submit"
					>
						{submitLabel}
					</Button>
				)}
			</div>
		</div>
	);
}
