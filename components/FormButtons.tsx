import type { FormButtonsProps } from "@/interfaces/props";

import React from "react";
import { Button } from "@heroui/button";

export default function FormButtons({
	onSubmit,
	onCancel,
	hasBorder = true,
	submitLabel = "Submit",
	cancelLabel = "Cancel",
	submitColor = "primary",
	cancelColor = "default",
	isSubmitting = false,
	isCanceling = false,
	className = "flex flex-col w-full text-center",
}: FormButtonsProps) {
	return (
		<div className={className}>
			{hasBorder && <hr className="mb-6 border-gray-200" />}

			<div className="flex w-full gap-2">
				{onCancel && (
					<Button
						className="w-full font-semibold text-gray-500"
						color={cancelColor}
						size="lg"
						radius="sm"
						variant="flat"
						isLoading={isCanceling}
						onPress={onCancel}
					>
						{cancelLabel}
					</Button>
				)}

				{onSubmit ? (
					<Button
						className="w-full font-bold"
						color={submitColor}
						size="lg"
						radius="sm"
						variant="flat"
						isLoading={isSubmitting}
						onPress={onSubmit}
					>
						{submitLabel}
					</Button>
				) : (
					<Button
						className="w-full font-bold"
						color={submitColor}
						size="lg"
						radius="sm"
						variant="flat"
						isLoading={isSubmitting}
						type="submit"
					>
						{submitLabel}
					</Button>
				)}
			</div>
		</div>
	);
}
