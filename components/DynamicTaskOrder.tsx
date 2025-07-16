import React from "react";
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Divider } from "@heroui/divider";

import InputRenderer from "./InputRenderer";

import { TaskOrderFormData, TaskOrderUIItem } from "@/types/form-state";
import { InputConfig, DropdownOption } from "@/interfaces/interfaces";
import { TaskOrderTranslation } from "@/utils/constants";
import { Activity, Car, User } from "@/interfaces/schema";
import { PlusIcon, RemoveIcon } from "@/utils/icons";

interface DynamicTaskOrderProps {
	taskOrders: TaskOrderUIItem[];
	activityData: Activity[];
	carData: Car[];
	driverData: User[];
	errors?: Record<string, string | null>;
	onAddTask: () => void;
	onRemoveTask: (uiId: string) => void;
	onUpdateTask: (uiId: string, changes: Partial<TaskOrderFormData>) => void;
	getToolTypeOptions: (activityId?: number) => DropdownOption[];
}

export default function DynamicTaskOrder({
	taskOrders,
	activityData,
	carData,
	driverData,
	errors = {},
	onAddTask,
	onRemoveTask,
	onUpdateTask,
	getToolTypeOptions,
}: DynamicTaskOrderProps) {
	const createTaskOrderConfig = (
		taskOrder: TaskOrderUIItem
	): InputConfig[] => [
		{
			type: "dropdown",
			name: "activities_id",
			isRequired: true,
			labelTranslator: TaskOrderTranslation,
			options: activityData.map((activity) => ({
				label: activity.name,
				value: activity.id,
			})),
		},
		{
			type: "dropdown",
			name: "tool_types_id",
			isRequired: true,
			labelTranslator: TaskOrderTranslation,
			options: getToolTypeOptions(taskOrder.activities_id),
			isReadOnly: !taskOrder.activities_id,
		},
		{
			type: "dropdown",
			name: "car_id",
			isRequired: true,
			labelTranslator: TaskOrderTranslation,
			options: carData.map((car) => ({
				label: car.name || car.car_number || car.id.toString(),
				value: car.id,
			})),
		},
		{
			type: "dropdown",
			name: "assigned_user_id",
			isRequired: true,
			labelTranslator: TaskOrderTranslation,
			options: driverData.map((user) => ({
				label:
					`${user.username?.charAt(0).toUpperCase()}${user.username?.slice(1).toLowerCase()}` ||
					"-",
				value: user.id,
			})),
		},
		{
			type: "number",
			name: "target_area",
			isRequired: true,
			labelTranslator: TaskOrderTranslation,
		},
		{
			type: "date",
			name: "ap_date",
			isRequired: true,
			labelTranslator: TaskOrderTranslation,
		},
	];

	const handleFieldChange = (
		taskOrder: TaskOrderUIItem,
		name: string,
		value: any
	) => {
		// For ap_date, we need to handle CalendarDate objects and strings differently
		if (name === "ap_date") {
			if (value && typeof value === "object" && value.toString) {
				// This is a CalendarDate object from the DatePicker
				// Store the CalendarDate object for UI, but we'll convert to string when sending to API
				onUpdateTask(taskOrder.uiId, { [name]: value });
			} else {
				// This might be a string or null/undefined
				onUpdateTask(taskOrder.uiId, { [name]: value });
			}
		} else {
			onUpdateTask(taskOrder.uiId, { [name]: value });
		}

		if (name === "activities_id") {
			onUpdateTask(taskOrder.uiId, { tool_types_id: undefined });
		}
	};

	const commonProp = (
		config: InputConfig,
		taskOrder: TaskOrderUIItem
	): any => {
		const {
			type,
			name,
			hasLabel = true,
			label,
			labelTranslator,
			hasPlaceholder = true,
			labelPlacement = "outside",
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
					? labelTranslator?.[label] || label
					: labelTranslator?.[name] || name;

		const placeholder = hasPlaceholder
			? type === "dropdown"
				? `โปรดเลือก ${labelValue || name}`
				: `โปรดกรอก ${labelValue || name}`
			: undefined;

		// Create field key with task order ID for unique error identification
		const fieldKey = `${taskOrder.uiId}_${name}`;
		const defaultErrorMessage =
			type === "dropdown"
				? `กรุณาเลือก ${labelValue || name}`
				: `กรุณากรอก ${labelValue || name}`;

		const errorMessage =
			errors[fieldKey] !== undefined && errors[fieldKey] !== null
				? errors[fieldKey]
				: defaultErrorMessage;
		const isInvalid = errors[fieldKey] !== undefined;

		return {
			name,
			label: labelValue,
			placeholder,
			errorMessage,
			isInvalid,
			radius: "sm",
			size: size || "md",
			isDisabled: isReadOnly || false,
			isRequired: isRequired || false,
			labelPlacement,
			className: `min-w-[100px] p-0 ${className || ""}`,
			...restProps,
		};
	};

	return (
		<div className="flex flex-col w-full gap-4">
			{/* Header with Add Button */}
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-3">
					<span className="text-lg font-semibold text-primary">
						กิจกรรม ({taskOrders.length})
					</span>

					<Divider className="flex-1 bg-primary" />
				</div>

				<Button
					color="primary"
					isDisabled={taskOrders.length >= 5}
					size="sm"
					startContent={<PlusIcon size={16} />}
					variant="flat"
					onPress={onAddTask}
				>
					เพิ่มกิจกรรม
				</Button>
			</div>

			{/* Task Order Cards */}
			<div className="flex flex-col gap-4">
				{taskOrders.map((taskOrder, index) => (
					<Card
						key={taskOrder.uiId}
						className="w-full"
						radius="sm"
						shadow="sm"
					>
						<CardHeader className="flex items-center justify-between py-2">
							<span className="font-medium text-md">
								กิจกรรมที่ {index + 1}
							</span>

							<Button
								isIconOnly
								color="danger"
								endContent={<RemoveIcon size={20} />}
								size="sm"
								variant="light"
								onPress={() => onRemoveTask(taskOrder.uiId)}
							/>
						</CardHeader>

						<Divider />

						<CardBody className="pt-4">
							<div className="grid grid-cols-1 gap-x-2 gap-y-4 md:grid-cols-2 lg:grid-cols-3">
								{createTaskOrderConfig(taskOrder).map(
									(config) => {
										const value =
											taskOrder[
												config.name as keyof TaskOrderUIItem
											];

										return (
											<div
												key={config.name}
												className="w-full"
											>
												<InputRenderer
													commonProps={commonProp(
														config,
														taskOrder
													)}
													type={config.type}
													value={value}
													onValueChange={(
														name,
														val
													) =>
														handleFieldChange(
															taskOrder,
															name,
															val
														)
													}
												/>
											</div>
										);
									}
								)}
							</div>
						</CardBody>
					</Card>
				))}
			</div>
		</div>
	);
}
