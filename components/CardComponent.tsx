"use client";

import type { CardComponentProps } from "@/interfaces/props";

import React, { useCallback, useState } from "react";
import {
	Button,
	Chip,
	Divider,
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@heroui/react";
import { clsx } from "clsx";

import SpotlightCard from "./SplotlightCardComponent";

import { VerticalDotsIcon } from "@/utils/icons";
import { getNestedValue, translateEnumValue } from "@/utils/functions";
import { FieldConfig } from "@/interfaces/interfaces";

export default function CardComponent<T extends { id: number | string }>({
	items,
	statusConfig,
	headerFields,
	bodyFields,
	actions,
	cardClassName = "flex flex-col gap-3 bg-white shadow-md rounded-lg min-w-64 h-full",
}: CardComponentProps<T>) {
	const [openPopoverId, setOpenPopoverId] = useState<string | number | null>(
		null
	);

	const getFieldValue = useCallback((item: any, config: FieldConfig) => {
		if (config.path) {
			return getNestedValue(item, config.path);
		}
		if (config.key) {
			return item[config.key];
		}

		return undefined;
	}, []);

	const renderCell = useCallback(
		(item: T) => {
			const resolvedActions =
				typeof actions === "function" ? actions(item) : actions;

			const getSpotlightColor = (
				status: string
			): `rgba(${number}, ${number}, ${number}, ${number})` => {
				const colorMap: Record<
					string,
					`rgba(${number}, ${number}, ${number}, ${number})`
				> = {
					default: "rgba(156, 163, 175, 0.1)",
					primary: "rgba(59, 130, 246, 0.1)",
					secondary: "rgba(107, 114, 128, 0.1)",
					success: "rgba(34, 197, 94, 0.1)",
					warning: "rgba(245, 158, 11, 0.1)",
					danger: "rgba(239, 68, 68, 0.1)",
				};

				const statusColor =
					statusConfig?.colorMap?.[(item as any).status];

				return statusColor && colorMap[statusColor]
					? colorMap[statusColor]
					: colorMap.default;
			};

			return (
				<SpotlightCard
					key={item.id}
					className="flex flex-col h-full gap-3 bg-white rounded-lg shadow-md min-w-64"
					spotlightColor={getSpotlightColor((item as any).status)}
				>
					{/* header */}
					<div className="gap-1 px-4 text-left">
						{(item as any).status && (
							<Chip
								className="p-3 mt-4 mb-2 tracking-wide w-fit"
								color={
									statusConfig?.colorMap?.[
										(item as any).status
									] || "default"
								}
								radius="sm"
								size="sm"
								variant="flat"
							>
								<span className="font-semibold">
									{translateEnumValue(
										(item as any).status,
										statusConfig?.translation || {}
									)}
								</span>
							</Chip>
						)}

						{headerFields?.map((field) => {
							const label = field.label
								? field.label
								: translateEnumValue(
										field.key,
										field.labelTranslator || {}
									);

							const rawValue = getFieldValue(item, field);
							let value =
								rawValue == null
									? "N/A"
									: translateEnumValue(
											rawValue,
											field.valueTranslator || {}
										);

							if (
								typeof value === "string" &&
								(value.length > 20 || value.includes("\n"))
							) {
								value = value.slice(0, 20) + "...";
							}

							return (
								<div
									key={field.key}
									className={field.className || "w-fit"}
								>
									{label} : {value}
								</div>
							);
						})}
					</div>
					{/* body */}
					<div className="flex flex-col px-4 pb-1">
						{bodyFields.map((field) => {
							const label = field.label
								? field.label
								: translateEnumValue(
										field.key,
										field.labelTranslator || {}
									);

							let value;

							if (field.valueFunction) {
								value = field.valueFunction(item);
							} else {
								const rawValue = getFieldValue(item, field);

								value =
									rawValue == null
										? "N/A"
										: translateEnumValue(
												rawValue,
												field.valueTranslator || {}
											);
							}
							if (
								typeof value === "string" &&
								(value.length > 20 || value.includes("\n"))
							) {
								value = value.slice(0, 20) + "...";
							}

							return (
								<div
									key={field.key}
									className={`flex flex-row items-center gap-2 ${
										field.className || "text-gray-600"
									}`}
								>
									<div className="w-2/5">{label}</div>
									<div
										className={clsx(
											`${field.valueClassName} w-3/5`
										)}
									>
										{value}
									</div>
								</div>
							);
						})}
					</div>
					{/* footer */}
					{resolvedActions && resolvedActions.length > 0 && (
						<div>
							<Divider />
							<div className="flex items-center justify-between gap-2 py-1 pl-4 pr-1">
								<div className="text-sm text-gray-500">
									More actions.
								</div>

								<Popover
									isOpen={openPopoverId === item.id}
									placement="bottom-end"
									onOpenChange={(isOpen) =>
										setOpenPopoverId(
											isOpen ? item.id : null
										)
									}
								>
									<PopoverTrigger>
										<Button
											isIconOnly
											size="sm"
											variant="light"
										>
											<div className="text-default-300">
												<VerticalDotsIcon />
											</div>
										</Button>
									</PopoverTrigger>

									<PopoverContent className="p-1 mt-1 rounded-lg shadow-lg min-w-40">
										<div className="flex flex-col w-full text-sm">
											{resolvedActions.map((action) => (
												<Button
													key={action.key}
													className={`w-full justify-start text-left p-2 ${
														action.className || ""
													}`}
													radius="sm"
													size="md"
													startContent={action.icon}
													variant="light"
													onPress={() => {
														action.onClick?.(item);
														setOpenPopoverId(null);
													}}
												>
													{action.label}
												</Button>
											))}
										</div>
									</PopoverContent>
								</Popover>
							</div>
						</div>
					)}
				</SpotlightCard>
			);
		},
		[
			statusConfig,
			headerFields,
			bodyFields,
			actions,
			cardClassName,
			openPopoverId,
			getFieldValue,
		]
	);

	return (
		<div className="grid items-center w-full h-full grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
			{items.map((item) => renderCell(item))}
		</div>
	);
}
