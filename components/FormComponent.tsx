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
	errors: externalErrors = {},
	onCancel,
	onSubmit,
	onChange,
}: FormComponentProps & { isCompact?: boolean }) {
	const [formValues, setFormValues] = useState<any>(values || {});
	const [internalErrors, setInternalErrors] = useState<
		Record<string, string | null>
	>({});

	// Merge external errors with internal validation errors
	const mergedErrors = { ...externalErrors, ...internalErrors };

	useEffect(() => {
		if (values && typeof values === "object") {
			setFormValues(values);
		}
	}, [JSON.stringify(values)]);

	const handleValueChange = (name: string, value: any) => {
		const newValues = { ...formValues, [name]: value };

		setFormValues(newValues);

		if (mergedErrors[name] !== undefined) {
			const newErrors = { ...internalErrors };

			delete newErrors[name];
			setInternalErrors(newErrors);
		}

		if (onChange) {
			onChange(newValues);
		}
	};

	const validateForm = () => {
		const newErrors: Record<string, string | null> = {};

		const allFields: any[] = [];

		sections.forEach((section) => {
			section.fields.forEach((field) => {
				if (Array.isArray(field)) {
					allFields.push(...field);
				} else {
					allFields.push(field);
				}
			});
		});

		allFields.forEach((field) => {
			if (field.isRequired) {
				const value = formValues[field.name];
				const isEmpty =
					value === undefined ||
					value === null ||
					value === "" ||
					(Array.isArray(value) && value.length === 0);

				if (isEmpty) {
					newErrors[field.name] = null;
				}
			}

			// Add custom validation logic here
			// For password validation EX.
			// if (field.type === "password" && field.name === "passwordField") {
			// 	const password = formValues[field.name];

			// 	if (password && password.length > 0 && password.length < 8) {
			// 		newErrors[field.name] =
			// 			"รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร";
			// 	}
			// }
		});

		setInternalErrors(newErrors);

		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (!validateForm()) {
			return;
		}

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
						errors={mergedErrors}
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
						errors={mergedErrors}
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
