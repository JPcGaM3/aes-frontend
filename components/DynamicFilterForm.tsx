import type { FormSection } from "@/interfaces/interfaces";

import React, { useState, useEffect, useCallback } from "react";
import { Form } from "@heroui/react";

import Header from "./Header";
import FormFields from "./FormFieldsComponent";
import FormButtons from "./FormButtons";

interface DynamicFilterFormProps {
	title?: string;
	subtitle?: string;
	getSections: (values: any) => FormSection[];
	submitLabel?: string;
	cancelLabel?: string;
	isSubmitting?: boolean;
	isCanceling?: boolean;
	values?: any;
	className?: string;
	onCancel?: () => void;
	onSubmit?: (values: any) => void;
	onValueChange?: (name: string, value: any, allValues: any) => any;
}

export default function DynamicFilterForm({
	title,
	subtitle,
	getSections,
	submitLabel,
	cancelLabel,
	isSubmitting,
	isCanceling,
	values = {},
	className,
	onCancel,
	onSubmit,
	onValueChange,
}: DynamicFilterFormProps) {
	const [formValues, setFormValues] = useState<any>(values || {});
	const [internalErrors, setInternalErrors] = useState<
		Record<string, string | null>
	>({});

	useEffect(() => {
		if (values && typeof values === "object") {
			setFormValues(values);
		}
	}, [JSON.stringify(values)]);

	const handleValueChange = useCallback(
		(name: string, value: any) => {
			let newValues = { ...formValues, [name]: value };

			// Apply custom logic if provided
			if (onValueChange) {
				newValues = onValueChange(name, value, newValues) || newValues;
			}

			setFormValues(newValues);

			// Clear error for this field
			if (internalErrors[name] !== undefined) {
				const newErrors = { ...internalErrors };

				delete newErrors[name];
				setInternalErrors(newErrors);
			}
		},
		[formValues, internalErrors, onValueChange]
	);

	const validateForm = useCallback(() => {
		const newErrors: Record<string, string | null> = {};
		const sections = getSections(formValues);

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
		});

		setInternalErrors(newErrors);

		return Object.keys(newErrors).length === 0;
	}, [formValues, getSections]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (!validateForm()) {
			return;
		}

		if (onSubmit) {
			onSubmit(formValues);
		}
	};

	// Get current sections based on current form values
	const sections = getSections(formValues);

	return (
		<div
			className={`w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl ${className}`}
		>
			{onSubmit ? (
				<Form
					className={"flex flex-col w-full gap-8"}
					validationBehavior="aria"
					onSubmit={handleSubmit}
				>
					<Header
						hasBorder={true}
						subtitle={subtitle}
						title={title}
					/>

					<FormFields
						errors={internalErrors}
						isCompact={true}
						sections={sections}
						values={formValues}
						onValueChange={handleValueChange}
					/>

					<FormButtons
						cancelLabel={cancelLabel}
						hasBorder={true}
						isCanceling={isCanceling}
						isSubmitting={isSubmitting}
						size="compact"
						submitLabel={submitLabel}
						onCancel={onCancel}
					/>
				</Form>
			) : (
				<div className="flex flex-col w-full gap-8">
					<Header
						hasBorder={true}
						subtitle={subtitle}
						title={title}
					/>

					<FormFields
						errors={internalErrors}
						isCompact={true}
						sections={sections}
						values={formValues}
						onValueChange={handleValueChange}
					/>
				</div>
			)}
		</div>
	);
}
