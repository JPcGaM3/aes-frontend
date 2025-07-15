import React from "react";
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { Plus, Trash2 } from "lucide-react";

import InputRenderer from "./InputRenderer";

import { TaskOrderFormData, TaskOrderUIItem } from "@/types/form-state";
import { InputConfig, DropdownOption } from "@/interfaces/interfaces";
import { TaskOrderTranslation } from "@/utils/constants";
import { Activity, Car, User } from "@/interfaces/schema";

interface DynamicTaskOrderProps {
	taskOrders: TaskOrderUIItem[];
	activityData: Activity[];
	carData: Car[];
	driverData: User[];
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
			labelTranslator: TaskOrderTranslation,
			options: activityData.map((activity) => ({
				label: activity.name,
				value: activity.id,
			})),
		},
		{
			type: "dropdown",
			name: "tool_types_id",
			labelTranslator: TaskOrderTranslation,
			options: getToolTypeOptions(taskOrder.activities_id),
			isReadOnly: !taskOrder.activities_id,
		},
		{
			type: "dropdown",
			name: "car_id",
			labelTranslator: TaskOrderTranslation,
			options: carData.map((car) => ({
				label: car.name || car.car_number || car.id.toString(),
				value: car.id,
			})),
		},
		{
			type: "dropdown",
			name: "assigned_user_id",
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
			labelTranslator: TaskOrderTranslation,
		},
		{
			type: "date",
			name: "ap_date",
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

	const commonProp = (config: InputConfig): any => {
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

		return {
			name,
			label: labelValue,
			placeholder,
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
					size="sm"
					startContent={<Plus size={16} />}
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
								size="sm"
								variant="light"
								onPress={() => onRemoveTask(taskOrder.uiId)}
							>
								<Trash2 size={16} />
							</Button>
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
														config
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

			{/* Add Task Button (when no tasks) */}
			{taskOrders.length === 0 && (
				<Card className="w-full border-2 border-dashed border-primary/30">
					<CardBody className="flex items-center justify-center py-8">
						<Button
							color="primary"
							size="lg"
							startContent={<Plus size={20} />}
							variant="flat"
							onPress={onAddTask}
						>
							เพิ่มกิจกรรม
						</Button>
					</CardBody>
				</Card>
			)}
		</div>
	);
}
