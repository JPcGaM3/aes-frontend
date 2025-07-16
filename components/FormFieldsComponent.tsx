import { useCallback } from "react";
import { Divider } from "@heroui/react";
import { clsx } from "clsx";

import InputRenderer from "./InputRenderer";

import { InputConfig } from "@/interfaces/interfaces";
import { FormFieldsProps } from "@/interfaces/props";
import { getNestedValue, translateEnumValue } from "@/utils/functions";

export default function FormFields({
	sections = [],
	onValueChange,
	values = {},
	errors = {},
	isCompact = false,
}: FormFieldsProps & { isCompact?: boolean }) {
	const getValue = useCallback(
		(config: InputConfig) => {
			if (!config) {
				return "";
			}

			let value;

			if (config.path) {
				value = getNestedValue(values, config.path);
			} else if (
				config.name &&
				typeof values === "object" &&
				values !== null
			) {
				value = values[config.name];
			}

			if (config.type === "date" || config.type === "date-range") {
				return value !== undefined && value !== null && value !== ""
					? value
					: (config.defaultValue ?? null);
			} else {
				return value !== undefined && value !== null && value !== ""
					? value
					: (config.defaultValue ?? "");
			}
		},
		[values]
	);

	const getCommonProp: any = useCallback(
		(config: InputConfig) => {
			const {
				type,
				name,
				hasLabel = true,
				label,
				labelTranslator,
				hasPlaceholder = true,
				labelPlacement,
				isReadOnly,
				isRequired,
				size,
				className,
				...restProps
			} = config;

			const labelValue =
				hasLabel === false
					? undefined
					: label
						? translateEnumValue(label, labelTranslator || {})
						: translateEnumValue(name, labelTranslator || {});

			const placeholder = hasPlaceholder
				? type === "dropdown"
					? `เลือก ${labelValue || name}`
					: `กรอก ${labelValue || name}`
				: undefined;

			const resolvedLabelPlacement =
				labelPlacement || (isCompact ? "outside" : "outside-left");

			const defaultErrorMessage =
				config.type === "dropdown"
					? `กรุณาเลือก ${labelValue || name}`
					: `กรุณากรอก ${labelValue || name}`;

			const errorMessage =
				errors[name] !== undefined && errors[name] !== null
					? errors[name]
					: defaultErrorMessage;
			const isInvalid = errors[name] !== undefined;

			return {
				name: name,
				label: labelValue,
				placeholder: placeholder,
				errorMessage: errorMessage,
				isInvalid: isInvalid,
				radius: "sm",
				size: size || "md",
				isDisabled: isReadOnly || false,
				isRequired: isRequired || false,
				labelPlacement: resolvedLabelPlacement,
				className: clsx("min-w-[100px] p-0", className),
				...restProps,
			};
		},
		[isCompact, errors]
	);

	return (
		<div className="flex flex-col w-full gap-6">
			{sections.map((section, idx) => (
				<div key={idx} className="flex flex-col w-full gap-3">
					{/* Title ----------------------------------------------------------------------------------------------------------------------- */}
					{section.title && (
						<div className="flex items-center w-full gap-5">
							<span className="text-lg font-semibold text-primary">
								{section.title}
							</span>

							<Divider className="flex-1 w-full bg-primary" />
						</div>
					)}

					{/* Fields ---------------------------------------------------------------------------------------------------------------------- */}
					<div
						className={`grid w-full ${isCompact ? "gap-y-4 grid-cols-1" : "gap-x-4 gap-y-2 grid-cols-[repeat(auto-fit,minmax(300px,1fr))]"}`}
					>
						{section.fields.map((field, i) =>
							Array.isArray(field) ? (
								<div
									key={i}
									className="flex flex-row w-full gap-2"
								>
									{field.map(
										(subField, subIndex) =>
											subField && (
												<InputRenderer
													key={subIndex}
													commonProps={getCommonProp(
														subField
													)}
													type={subField.type}
													value={getValue(subField)}
													onValueChange={
														onValueChange
													}
												/>
											)
									)}
								</div>
							) : (
								field && (
									<div key={i} className="w-full col-span-1">
										<InputRenderer
											commonProps={getCommonProp(field)}
											type={field.type}
											value={getValue(field)}
											onValueChange={onValueChange}
										/>
									</div>
								)
							)
						)}
					</div>
				</div>
			))}
		</div>
	);
}
