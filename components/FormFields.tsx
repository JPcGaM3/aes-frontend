"use client";

import React, { useState } from "react";

import { FormField, InputConfig } from "@/interfaces/interfaces";
import { EyeFilledIcon, EyeSlashFilledIcon } from "../utils/icons";

import { Input, Textarea } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { DatePicker, DateRangePicker, NumberInput } from "@heroui/react";
import { translateEnumValue } from "@/utils/functions";
import { FormFieldsProps, InputRendererProps } from "@/interfaces/props";

export default function FormFields({
	fields,
	onValueChange,
	values = {},
}: FormFieldsProps) {
	return (
		<div className="flex flex-col w-full gap-4">
			{fields.map((field, index) =>
				Array.isArray(field) ? (
					<div key={index} className="flex flex-row w-full gap-2">
						{field.map((subField, subIndex) => (
							<InputRenderer
								key={`${index}-${subIndex}`}
								inputConfig={subField}
								onValueChange={onValueChange}
								value={values[subField.name]}
							/>
						))}
					</div>
				) : (
					<InputRenderer
						key={index}
						inputConfig={field}
						onValueChange={onValueChange}
						value={values[field.name]}
					/>
				)
			)}
		</div>
	);
}

function InputRenderer({
	inputConfig,
	onValueChange,
	value,
}: InputRendererProps) {
	const label =
		inputConfig.hasLabel === false
			? undefined
			: inputConfig.label
				? translateEnumValue(inputConfig.label, inputConfig.translator || {})
				: translateEnumValue(inputConfig.name, inputConfig.translator || {});

	const placeholder =
		inputConfig.hasPlaceholder === false
			? undefined
			: inputConfig.placeholder ||
				(inputConfig.type === "dropdown"
					? `โปรดเลือก ${label}`
					: `โปรดกรอก ${label}`);

	const commonProp: any = {
		name: inputConfig.name,
		label: label,
		size: inputConfig.size || "md",
		labelPlacement: inputConfig.labelPlacement || "outside",
		hasPlaceholder: inputConfig.hasPlaceholder || true,
		placeholder: placeholder,
		description: inputConfig.description || null,
		startContent: inputConfig.startContent || null,
		endContent: inputConfig.endContent || null,
		isRequired: inputConfig.isRequired || false,
		isInvalid: inputConfig.isInvalid || false,
		errorMessage: inputConfig.errorMessage || null,
		className: `${inputConfig.className || ""} break-all`,
	};

	const [isVisible, setIsVisible] = useState(false);
	const toggleVisibility = () => setIsVisible((state) => !state);

	const getControlledValue = (type: string, value: any) => {
		switch (type) {
			case "text":
			case "email":
			case "password":
			case "textarea":
				return value ?? "";

			case "number":
				return value ?? "";

			case "dropdown":
				return value ?? "";

			case "date":
			case "date-range":
				return value ?? null;

			default:
				return value;
		}
	};

	switch (inputConfig.type) {
		case "text":
		case "email":
			return (
				<Input
					{...commonProp}
					radius="sm"
					type={inputConfig.type}
					onValueChange={
						onValueChange
							? (v) => onValueChange(inputConfig.name, v)
							: undefined
					}
					value={getControlledValue(inputConfig.type, value)}
				/>
			);

		case "password": {
			return (
				<Input
					{...commonProp}
					radius="sm"
					endContent={
						<button
							aria-label="toggle password visibility"
							className="focus:outline-none"
							tabIndex={-1}
							type="button"
							onClick={toggleVisibility}
						>
							{isVisible ? (
								<EyeSlashFilledIcon className="text-2xl pointer-events-none text-default-400" />
							) : (
								<EyeFilledIcon className="text-2xl pointer-events-none text-default-400" />
							)}
						</button>
					}
					type={isVisible ? "text" : "password"}
					onValueChange={
						onValueChange
							? (v) => onValueChange(inputConfig.name, v)
							: undefined
					}
					value={getControlledValue(inputConfig.type, value)}
				/>
			);
		}

		case "textarea":
			return (
				<Textarea
					{...commonProp}
					radius="sm"
					onValueChange={
						onValueChange
							? (v) => onValueChange(inputConfig.name, v)
							: undefined
					}
					value={getControlledValue(inputConfig.type, value)}
				/>
			);

		case "number":
			return (
				<NumberInput
					{...commonProp}
					radius="sm"
					max={inputConfig.max}
					min={inputConfig.min}
					onValueChange={
						onValueChange
							? (v) => onValueChange(inputConfig.name, String(v))
							: undefined
					}
					value={getControlledValue(inputConfig.type, value)}
				/>
			);

		case "dropdown":
			const optionType =
				inputConfig.options && inputConfig.options.length > 0
					? typeof inputConfig.options[0].value
					: "string";
			return (
				<Select
					{...commonProp}
					radius="sm"
					selectionMode={inputConfig.selectionMode || "single"}
					onSelectionChange={
						onValueChange
							? (keys) => {
									let selected = Array.isArray(keys)
										? keys[0]
										: keys instanceof Set
											? Array.from(keys)[0]
											: keys;

									let value = selected;
									if (
										optionType === "number" &&
										selected !== undefined &&
										selected !== null &&
										selected !== ""
									) {
										const num = Number(selected);
										value = isNaN(num) ? selected : num;
									}

									onValueChange(inputConfig.name, value);
								}
							: undefined
					}
					selectedKeys={
						value !== undefined && value !== null && value !== ""
							? new Set([String(value)])
							: new Set()
					}
				>
					{inputConfig.options.map((option) => (
						<SelectItem key={String(option.value)}>{option.label}</SelectItem>
					))}
				</Select>
			);

		case "date":
			return (
				<DatePicker
					{...commonProp}
					radius="sm"
					value={getControlledValue(inputConfig.type, value)}
					onChange={(v: any) => {
						onValueChange ? onValueChange(inputConfig.name, v) : undefined;
					}}
					showMonthAndYearPickers
				/>
			);

		case "date-range": {
			commonProp["aria-label"] =
				inputConfig.label || inputConfig.name || "Date range";

			return (
				<DateRangePicker
					{...commonProp}
					radius="sm"
					value={getControlledValue(inputConfig.type, value)}
					onValueChange={
						onValueChange
							? (v: [Date, Date]) =>
									onValueChange(
										inputConfig.name,
										v && v[0] && v[1]
											? `${v[0].toLocaleDateString()}|${v[1].toLocaleDateString()}`
											: ""
									)
							: undefined
					}
					showMonthAndYearPickers
				/>
			);
		}
	}
}
