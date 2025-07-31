import { useCallback, useEffect, useRef, useState } from "react";
import { Input, Textarea } from "@heroui/input";
import { Button } from "@heroui/button";
import {
	AutocompleteItem,
	CalendarDate,
	DatePicker,
	DateRangePicker,
	NumberInput,
	TimeInput,
} from "@heroui/react";
import clsx from "clsx";

import { PatchedAutocomplete } from "./PatchedAutocomplete";

import { InputRendererProps } from "@/interfaces/props";
import { EyeIcon, EyeCloseIcon, ClockIcon } from "@/utils/icons";
import { DropdownOption } from "@/interfaces/interfaces";
import { fontMono } from "@/config/fonts";

export default function InputRenderer({
	type,
	value,
	commonProps,
	onValueChange,
}: InputRendererProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const [width, setWidth] = useState(0);
	const [isMobile, setIsMobile] = useState(false);
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		const checkIsMobile = /iPhone|iPad|iPod|Android/i.test(
			navigator.userAgent
		);

		setIsMobile(checkIsMobile);

		const observer = new ResizeObserver((entries) => {
			if (entries && entries.length > 0) {
				setWidth(entries[0].contentRect.width);
			}
		});

		if (containerRef.current) {
			observer.observe(containerRef.current);
		}

		return () => {
			if (containerRef.current) {
				observer.unobserve(containerRef.current);
			}
		};
	}, []);

	const getVisibleMonths = () => {
		if (width < 400) {
			return 1;
		} else if (width < 650) {
			return 2;
		}

		return 3;
	};

	const formatTimeValue = (timeValue: any) => {
		if (!timeValue) return "";

		if (typeof timeValue === "string") {
			const match = timeValue.match(/T(\d{2}):(\d{2})/);
			const date = new Date(timeValue);

			if (match) {
				return `${match[1]}:${match[2]}`;
			}
			if (!isNaN(date.getTime())) {
				return date.toTimeString().slice(0, 5);
			}
		}

		if (timeValue instanceof Date) {
			return timeValue.toTimeString().slice(0, 5);
		}

		return timeValue;
	};

	const handleUnifiedValueChange = useCallback(
		(v: any) => {
			if (!onValueChange) return;

			switch (type) {
				case "date": {
					if (v as CalendarDate) {
						onValueChange(commonProps.name, v);
					} else {
						onValueChange(commonProps.name, v);
					}

					break;
				}

				case "time": {
					if (typeof v === "string") {
						const [hour, minute] = v.split(":").map(Number);

						if (!isNaN(hour) && !isNaN(minute)) {
							onValueChange(commonProps.name, { hour, minute });
						} else {
							onValueChange(commonProps.name, v);
						}
					} else {
						onValueChange(commonProps.name, v);
					}

					break;
				}

				case "date-range": {
					if (v && v.start && v.end) {
						onValueChange(commonProps.name, {
							start: v.start,
							end: v.end,
						});
					} else {
						onValueChange(commonProps.name, null);
					}

					break;
				}

				case "dropdown": {
					const optionType =
						commonProps.options && commonProps.options.length > 0
							? typeof commonProps.options[0].value
							: "string";

					let selectedValue = v;

					if (
						optionType === "number" &&
						selectedValue !== undefined &&
						selectedValue !== null &&
						selectedValue !== ""
					) {
						const num = Number(selectedValue);

						selectedValue = isNaN(num) ? selectedValue : num;
					}

					onValueChange(commonProps.name, selectedValue);
					break;
				}

				default: {
					onValueChange(commonProps.name, v);
				}
			}
		},
		[onValueChange, commonProps.name, type, commonProps.options]
	);

	commonProps.classNames = {
		...commonProps.classNames,
		label: "min-w-[100px] p-0 text-start",
		mainWrapper: "w-full min-w-0",
		base: "min-w-0",
	};

	switch (type) {
		case "text":
		case "email": {
			return (
				<Input
					{...commonProps}
					aria-label={commonProps.label}
					type={type}
					value={value || ""}
					onValueChange={
						onValueChange ? handleUnifiedValueChange : undefined
					}
				/>
			);
		}

		case "textarea": {
			return (
				<Textarea
					{...commonProps}
					aria-label={commonProps.label}
					classNames={{
						...commonProps.classNames,
						clearButton: "bg-default/40",
					}}
					minRows={commonProps.minRows || 3}
					value={value || ""}
					onValueChange={
						onValueChange ? handleUnifiedValueChange : undefined
					}
				/>
			);
		}

		case "number": {
			return (
				<NumberInput
					{...commonProps}
					aria-label={commonProps.label}
					endContent={
						<div className="flex items-center gap-2">
							<span className="pr-2 text-xs font-medium text-gray-500">
								{commonProps.unit}
							</span>
						</div>
					}
					value={value || ""}
					onValueChange={
						onValueChange ? handleUnifiedValueChange : undefined
					}
				/>
			);
		}

		case "password": {
			return (
				<Input
					{...commonProps}
					aria-label={commonProps.label}
					autoComplete="off"
					endContent={
						<Button
							isIconOnly
							className="p-0 -mx-2 text-2xl text-default-400"
							endContent={
								isVisible ? (
									<EyeCloseIcon size={20} />
								) : (
									<EyeIcon size={20} />
								)
							}
							radius="full"
							size="sm"
							variant="light"
							onPress={() => setIsVisible((state) => !state)}
						/>
					}
					type={isVisible ? "text" : "password"}
					value={value || ""}
					onValueChange={
						onValueChange ? handleUnifiedValueChange : undefined
					}
				/>
			);
		}

		case "dropdown": {
			const hasDefaultValue =
				commonProps.defaultValue !== undefined &&
				commonProps.defaultValue !== null &&
				commonProps.defaultValue !== "";

			const stringValue =
				value !== undefined && value !== null && value !== ""
					? String(value)
					: "";

			const stringDefaultValue = hasDefaultValue
				? String(commonProps.defaultValue)
				: "";

			const autocompleteProps = {
				selectedKey: stringValue || stringDefaultValue || "",
			};

			const inputProps = {
				disabled: isMobile,
			};

			return (
				<PatchedAutocomplete
					{...commonProps}
					{...autocompleteProps}
					aria-label={commonProps.label}
					classNames={{
						...commonProps.classNames,
						popoverContent: "rounded-lg p-0",
					}}
					inputProps={inputProps}
					placement="bottom"
					shouldCloseOnBlur={true}
					shouldCloseOnInteractOutside={true}
					onSelectionChange={
						onValueChange ? handleUnifiedValueChange : undefined
					}
				>
					{(commonProps.options || []).length === 0 ? (
						<AutocompleteItem key="no-option">
							No option.
						</AutocompleteItem>
					) : (
						(commonProps.options || []).map(
							(option: DropdownOption) => {
								const isSelected =
									value !== undefined &&
									value !== null &&
									value !== "" &&
									String(option.value) === String(value);

								return (
									<AutocompleteItem
										key={String(option.value)}
										className={clsx(
											/^[\u0E00-\u0E7F]/.test(
												option.label
											)
												? undefined
												: [
														"font-mono",
														fontMono.variable,
													]
										)}
										classNames={{
											base: `rounded-md data-[hover]:bg-default/40 ${isSelected ? "bg-primary/20" : ""}`,
										}}
									>
										{option.label}
									</AutocompleteItem>
								);
							}
						)
					)}
				</PatchedAutocomplete>
			);
		}

		case "date": {
			const dateValue = value || commonProps.defaultValue || null;

			return (
				<DatePicker
					{...commonProps}
					showMonthAndYearPickers
					aria-label={commonProps.label}
					value={dateValue}
					onChange={
						onValueChange ? handleUnifiedValueChange : undefined
					}
				/>
			);
		}

		case "date-range": {
			const rangeValue = value || commonProps.defaultValue || null;

			return (
				<div ref={containerRef}>
					<DateRangePicker
						{...commonProps}
						showMonthAndYearPickers
						aria-label={commonProps.label}
						value={rangeValue}
						visibleMonths={getVisibleMonths()}
						onChange={
							onValueChange ? handleUnifiedValueChange : undefined
						}
					/>
				</div>
			);
		}

		case "time": {
			const timeValue = value || commonProps.defaultValue || null;

			return (
				<TimeInput
					{...commonProps}
					aria-label={commonProps.label}
					className={clsx("font-mono", fontMono.variable)}
					endContent={
						<div className="relative">
							<Button
								isIconOnly
								aria-label="Time Picker"
								className="p-0 -mx-2 text-2xl text-default-400"
								endContent={<ClockIcon size={20} />}
								radius="full"
								size="sm"
								variant="light"
							/>

							<input
								aria-label={commonProps.label}
								className="absolute inset-0 w-8 h-8 -mx-2 rounded-full opacity-0 cursor-pointer"
								style={{ zIndex: 10 }}
								tabIndex={0}
								type="time"
								value={formatTimeValue(timeValue)}
								onChange={(e) => {
									const value = e.target.value;

									handleUnifiedValueChange(value);
								}}
							/>
						</div>
					}
					granularity={commonProps.granularity || "minute"}
					hourCycle={commonProps.hourCycle || 12}
					id="time"
					name="time"
					type="time"
					value={timeValue}
					onChange={
						onValueChange ? handleUnifiedValueChange : undefined
					}
				/>
			);
		}
	}
}
