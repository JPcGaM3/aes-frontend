import type { FormComponentProps } from "@/interfaces/props";

import React, { useState, useEffect } from "react";
import { Form } from "@heroui/react";

import Header from "./Header";
import FormFields from "./FormFieldsComponent";
import FormButtons from "./FormButtons";

export default function FormComponent({
	hasHeader = true,
	hasBorder = true,
	size = "compact",
	title,
	subtitle,
	sections,
	submitLabel,
	cancelLabel,
	isSubmitting,
	isCanceling,
	values = {},
	children = null,
	className,
	subtitleClassName,
	onCancel,
	onSubmit,
	onChange,
}: FormComponentProps & { isCompact?: boolean }) {
	const [formValues, setFormValues] = useState<any>(values);

	useEffect(() => {
		setFormValues(values);
	}, [JSON.stringify(values)]);

	const handleValueChange = (name: string, value: any) => {
		const newValues = { ...formValues, [name]: value };

		setFormValues(newValues);

		if (onChange) {
			onChange(newValues);
		}
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (onSubmit) {
			(onSubmit as any)(formValues);
		}
	};

	let computedClassName = "";

	if (size === "compact") {
		computedClassName =
			"w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl";
	} else if (size === "expanded") {
		computedClassName =
			"w-full max-w-sm sm:max-w-lg md:max-w-2xl lg:max-w-4xl";
	} else {
		computedClassName = "w-full";
	}

	return (
		<div className={`${computedClassName} ${className}`}>
			{onSubmit ? (
				<Form
					className={"flex flex-col w-full gap-8"}
					validationBehavior="aria"
					onSubmit={handleSubmit}
				>
					{hasHeader && (
						<Header
							hasBorder={hasBorder}
							subtitle={subtitle}
							subtitleClassName={subtitleClassName}
							title={title}
						/>
					)}

					<FormFields
						isCompact={size === "compact"}
						sections={sections}
						values={formValues}
						onValueChange={handleValueChange}
					/>

					{children}

					<FormButtons
						cancelLabel={cancelLabel}
						hasBorder={hasBorder}
						isCanceling={isCanceling}
						isSubmitting={isSubmitting}
						size={size}
						submitLabel={submitLabel}
						onCancel={onCancel}
					/>
				</Form>
			) : (
				<div className="flex flex-col w-full gap-8">
					{hasHeader && (
						<Header
							hasBorder={hasBorder}
							subtitle={subtitle}
							subtitleClassName={subtitleClassName}
							title={title}
						/>
					)}

					<FormFields
						isCompact={size === "compact"}
						sections={sections}
						values={formValues}
						onValueChange={handleValueChange}
					/>

					{children}
				</div>
			)}
		</div>
	);
}
