"use client";

import React, { useCallback, useState } from "react";
import {
	Button,
	Chip,
	Divider,
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@heroui/react";

import type { CardComponentProps } from "@/interfaces/props";
import { VerticalDotsIcon } from "@/utils/icons";
import { getNestedValue, translateEnumValue } from "@/utils/functions";
import { clsx } from "clsx";
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
		(item: T) => (
			<div key={item.id} className={cardClassName}>
				{/* header */}
				<div className="gap-1 px-4 text-left">
					{(item as any).status && (
						<Chip
							size="sm"
							radius="sm"
							variant="flat"
							className="p-3 mt-4 mb-2 tracking-wide w-fit"
							color={
								statusConfig?.colorMap?.[(item as any).status] || "default"
							}
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
							: translateEnumValue(field.key, field.labelTranslator || {});

						const rawValue = getFieldValue(item, field);
						let value =
							rawValue == null
								? "N/A"
								: translateEnumValue(rawValue, field.valueTranslator || {});
						if (
							typeof value === "string" &&
							(value.length > 20 || value.includes("\n"))
						) {
							value = value.slice(0, 20) + "...";
						}

						return (
							<div key={field.key} className={field.className || "w-fit"}>
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
							: translateEnumValue(field.key, field.labelTranslator || {});

						let value;
						if (field.valueFunction) {
							value = field.valueFunction(item);
						} else {
							const rawValue = getFieldValue(item, field);
							value =
								rawValue == null
									? "N/A"
									: translateEnumValue(rawValue, field.valueTranslator || {});
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
								<div className={clsx(`${field.valueClassName} w-3/5`)}>
									{value}
								</div>
							</div>
						);
					})}
				</div>

				{/* footer */}
				{actions && actions.length > 0 && (
					<div>
						<Divider />
						<div className="flex items-center justify-between gap-2 py-1 pl-4 pr-1">
							<div className="text-sm text-gray-500">More actions.</div>

							<Popover
								placement="bottom-end"
								isOpen={openPopoverId === item.id}
								onOpenChange={(isOpen) =>
									setOpenPopoverId(isOpen ? item.id : null)
								}
							>
								<PopoverTrigger>
									<Button isIconOnly size="sm" variant="light">
										<div className="text-default-300">
											<VerticalDotsIcon />
										</div>
									</Button>
								</PopoverTrigger>

								<PopoverContent className="p-1 mt-1 rounded-lg shadow-lg min-w-40">
									<div className="flex flex-col w-full text-sm">
										{actions.map((action) => (
											<Button
												key={action.key}
												variant="light"
												size="md"
												radius="sm"
												startContent={action.icon}
												className={`w-full justify-start text-left p-2 ${
													action.className || ""
												}`}
												onPress={() => {
													action.onClick &&
														action.onClick({
															item,
														});
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
			</div>
		),
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
