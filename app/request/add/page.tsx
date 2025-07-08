"use client";

import React from "react";
import { useEffect, useState } from "react";
import { useAuth } from "@/providers/AuthContext";

import {
	yearList,
	monthList,
	RequestOrderTranslation,
} from "@/utils/constants";
import { AddIcon, MinusIcon } from "@/utils/icons";

import {
	Activity,
	OperationArea,
	RequestOrder,
	ToolType,
} from "@/interfaces/schema";
import {
	DropdownOption,
	FormSection,
	UploadedFile,
} from "@/interfaces/interfaces";
import { AlertComponentProps } from "@/interfaces/props";

import { Tab, Tabs, Divider, Button } from "@heroui/react";

import FormComponent from "@/components/FormComponent";
import UploadComponent from "@/components/UploadComponent";
import AlertComponent from "@/components/AlertComponent";

import { getActivities } from "@/libs/activityAPI";
import { getOperationAreas } from "@/libs/operationAreaAPI";
import { KeyInRequestOrder, uploadRequestOrder } from "@/libs/requestOrderAPI";

interface FormType extends RequestOrder {
	activities: string;
	tool_types: string;
}

interface TaskFormType {
	activity_name: string;
	tool_type_name: string;
}

export default function AddRequestPage() {
	// const value & react hook -------------------------------------------------------------------------------------
	// * For key-in form
	const { userContext, isReady } = useAuth();
	const now = new Date();
	const currentYear = now.getFullYear();
	const currentMonth = monthList[now.getMonth()].value;

	const defaultTask: TaskFormType = { activity_name: "", tool_type_name: "" };
	const defaultFormValues: FormType = {
		activities: "",
		tool_types: "",
		ap_year: currentYear,
		ap_month: currentMonth,
	} as FormType;

	const [activityWithTools, setActivityWithTools] = useState<Activity[]>([]);
	const [actOptions, setActOptions] = useState<DropdownOption[]>([]);
	const [tasks, setTasks] = useState<TaskFormType[]>([defaultTask]);
	const [formValues, setFormValues] = useState<FormType>(defaultFormValues);
	const [opOptions, setOpOptions] = useState<OperationArea[]>([]);

	// * For file upload
	const [isAdding, setIsAdding] = useState<boolean>(false);
	const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

	// * Other
	const [alert, setAlert] = useState<AlertComponentProps>({
		title: "",
		description: "",
		isVisible: false,
	});

	// Fetch data ---------------------------------------------------------------------------------------------------
	useEffect(() => {
		if (
			isReady &&
			userContext &&
			userContext.id &&
			userContext.token &&
			userContext.ae_id
		) {
			const fetchDropDownOptions = async ({ token }: { token: string }) => {
				const activity = await getActivities({ token });
				const operation_area = await getOperationAreas({ token });

				setOpOptions(operation_area);
				setActivityWithTools(activity);
				setActOptions(
					activity.map((activity: Activity) => ({
						label: activity.name,
						value: activity.name,
					}))
				);

				setFormValues({
					...formValues,
					ae_id: userContext.ae_id,
				} as FormType);

				setTasks([
					{
						activity_name: "",
						tool_type_name: "",
					},
				]);
			};

			fetchDropDownOptions({
				token: userContext.token,
			});
		}
	}, [userContext, isReady]);

	// Handler ------------------------------------------------------------------------------------------------------
	const handleDownloadTemplate = (): void => {
		const link = document.createElement("a");

		link.href = "/excel/request_orders_template.xlsx";
		link.download = "request_orders_template.xlsx";
		document.body.appendChild(link);

		link.click();
		document.body.removeChild(link);
	};

	const handleSubmitUpload = async (_e?: any): Promise<void> => {
		if (uploadedFiles.length === 0) {
			setAlert({
				isVisible: true,
				color: "danger",
				title: "Upload Error",
				description: "Please upload files before confirming.",
			});
			return;
		}

		setIsAdding(true);

		try {
			const response = await uploadRequestOrder({
				token: userContext.token,
				uploadedFiles: uploadedFiles,
			});

			let totalRows = 0;
			let validRows = 0;
			let errorRows = 0;
			if (response && response.data && Array.isArray(response.data)) {
				response.data.forEach((file: any) => {
					totalRows += file.totalRows || 0;
					validRows += file.validRows || 0;
					errorRows += file.errorRows || 0;
				});
			}

			let alertTitle = "";
			let alertColor: "success" | "danger" | "warning" = "success";
			if (validRows === totalRows && totalRows > 0) {
				alertTitle = "Upload Successful";
				alertColor = "success";
			} else if (validRows === 0) {
				alertTitle = "Upload Fail";
				alertColor = "danger";
			} else {
				alertTitle = "Upload success with partial error";
				alertColor = "warning";
			}

			setAlert({
				isVisible: true,
				color: alertColor,
				title: alertTitle,
				description: `total row: ${totalRows} , valid row: ${validRows} , error row: ${errorRows}`,
			});
		} catch (error) {
			setAlert({
				isVisible: true,
				color: "danger",
				title: "Upload Failed",
				description: "Upload failed!, error: " + error,
			});
		} finally {
			setTimeout(() => {
				setIsAdding(false);
				setUploadedFiles([]);
			}, 500);
		}
	};

	const handleCancelUpload = (_e?: any): void => {
		setAlert({
			isVisible: true,
			title: "Upload Cancelled",
			description: "Cancelling upload, Clear form",
			color: "warning",
		});

		setUploadedFiles([]);
	};

	const handleRequestOrderChange = (values: any) => {
		const updateValues = {
			...formValues,
			...values,
		};

		setFormValues(updateValues);
	};

	const handleSubmitKeyIn = async () => {
		setIsAdding(true);

		const activities = tasks.map((t) => t.activity_name).join("+");
		const tool_types = tasks.map((t) => t.tool_type_name).join("+");
		const submitValue = {
			...formValues,
			activities,
			tool_types,
		};

		setFormValues(submitValue);
		console.log("Submitting:", submitValue);

		try {
			await KeyInRequestOrder({
				token: userContext.token,
				data: submitValue,
			});

			setAlert({
				isVisible: true,
				title: "Add Request Order Successful",
				description: "Add request order successful!",
				color: "success",
			});

			setTasks([defaultTask]);
			setFormValues({
				...defaultFormValues,
				ae_id: userContext.ae_id,
			});
		} catch (error) {
			setAlert({
				isVisible: true,
				title: "Add Request Order Failed",
				description: "Add order failed!",
				color: "danger",
			});
		} finally {
			setTimeout(() => {
				setIsAdding(false);
			}, 500);
		}
	};

	const handleCancelKeyIn = () => {
		setFormValues({
			...defaultFormValues,
			ae_id: userContext.ae_id,
		});

		setTasks([defaultTask]);
	};

	const handleAddTask = () => {
		if (tasks.length < 5) {
			setTasks([...tasks, { activity_name: "", tool_type_name: "" }]);
		}
	};

	const handleRemoveTask = () => {
		if (tasks.length > 1) {
			setTasks(tasks.slice(0, -1));
		}
	};

	const handleTaskFormChange = (values: Record<string, string>) => {
		const newTasks: TaskFormType[] = [];
		for (let i = 0; i < tasks.length; i++) {
			const activity = values[`activity_name_${i}`] || "";
			const prevActivity = tasks[i]?.activity_name || "";

			let toolType = values[`tool_type_name_${i}`] || "";
			if (activity !== prevActivity) {
				toolType = "";
			}

			newTasks.push({
				activity_name: activity,
				tool_type_name: toolType,
			});
		}

		setTasks(newTasks);
	};

	// Field configurations ----------------------------------------------------------------------------------------
	const requestOrderFields: FormSection[] = [
		{
			fields: [
				{
					type: "text",
					name: "phone",
					labelTranslator: RequestOrderTranslation,
				},
				[
					{
						type: "dropdown",
						name: "operation_area_id",
						isRequired: true,
						labelTranslator: RequestOrderTranslation,
						className: "w-1/3",
						options: [
							...opOptions.map((option) => ({
								label: option.operation_area ?? "",
								value: option.id,
							})),
						],
					},
					{
						type: "text",
						name: "zone",
						isRequired: true,
						labelTranslator: RequestOrderTranslation,
						className: "w-2/3",
					},
				],
				[
					{
						type: "text",
						name: "quota_number",
						isRequired: true,
						labelTranslator: RequestOrderTranslation,
						className: "w-1/3",
					},
					{
						type: "text",
						name: "farmer_name",
						isRequired: true,
						labelTranslator: RequestOrderTranslation,
						className: "w-2/3",
					},
				],
				[
					{
						type: "dropdown",
						name: "ap_year",
						isRequired: true,
						labelTranslator: RequestOrderTranslation,
						className: "w-1/3",
						options: yearList,
					},
					{
						type: "dropdown",
						name: "ap_month",
						isRequired: true,
						labelTranslator: RequestOrderTranslation,
						className: "w-2/3",
						options: monthList,
					},
				],
				{
					type: "text",
					name: "supervisor_name",
					isRequired: true,
					labelTranslator: RequestOrderTranslation,
				},
				{
					type: "number",
					name: "target_area",
					isRequired: true,
					labelTranslator: RequestOrderTranslation,
				},
				{
					type: "number",
					name: "land_number",
					isRequired: true,
					labelTranslator: RequestOrderTranslation,
				},
				{
					type: "textarea",
					name: "location_xy",
					isRequired: false,
					labelTranslator: RequestOrderTranslation,
				},
			],
		},
	];

	const getTaskFormValues = () => {
		const obj: Record<string, string> = {};

		tasks.forEach((task, idx) => {
			obj[`activity_name_${idx}`] = task.activity_name;
			obj[`tool_type_name_${idx}`] = task.tool_type_name;
		});

		return obj;
	};

	const getToolTypeOptions = (activityName: string) => {
		const activity = activityWithTools.find((a) => a.name === activityName);
		if (!activity || !activity.tool_types) {
			return [];
		}

		return activity.tool_types.map((tool: ToolType) => ({
			label: tool.tool_type_name,
			value: tool.tool_type_name,
		}));
	};

	const getTaskFormSection = (): FormSection[] => [
		{
			fields: tasks.map((task, idx) => [
				{
					type: "dropdown",
					name: `activity_name_${idx}`,
					label: "กิจกรรม",
					options: actOptions,
					isRequired: true,
					className: "w-1/2",
				},
				{
					type: "dropdown",
					name: `tool_type_name_${idx}`,
					label: "ประเภทเครื่องมือ",
					options: getToolTypeOptions(task.activity_name),
					isRequired: true,
					className: "w-1/2",
					isDisabled: !task.activity_name,
				},
			]),
		},
	];

	return (
		<div className="flex flex-col items-center justify-center w-full">
			<Tabs
				radius="sm"
				aria-label="TabOptions"
				className="flex flex-col items-center justify-center w-full pb-4 font-semibold"
			>
				{/* Key-in tab ------------------------------------------------------------------------------------------- */}
				<Tab
					key="key-in"
					title="Key-in"
					className="flex flex-col items-center justify-center w-full"
				>
					<FormComponent
						isCompact={true}
						sections={requestOrderFields}
						title="สร้างใบสั่งงาน"
						subtitle="กรุณากรอกข้อมูลใบสั่งงานลงในฟอร์มด้านล่าง"
						values={formValues}
						isSubmitting={isAdding}
						cancelLabel="ยกเลิก"
						submitLabel="ยืนยัน"
						onCancel={handleCancelKeyIn}
						onSubmit={handleSubmitKeyIn}
						onChange={handleRequestOrderChange}
					>
						<div className="flex flex-col items-center justify-center w-full gap-4">
							<div className="flex items-center w-full gap-5">
								<span className="text-xl font-semibold text-gray-700">
									กิจกรรม
								</span>

								<Divider className="flex-1" />

								<div className="flex flex-row gap-2">
									<Button
										isIconOnly
										size="sm"
										radius="sm"
										color="default"
										variant="flat"
										startContent={<AddIcon />}
										onPress={handleAddTask}
										isDisabled={tasks.length >= 5}
									/>
									<Button
										isIconOnly
										size="sm"
										radius="sm"
										color="default"
										variant="flat"
										startContent={<MinusIcon />}
										onPress={handleRemoveTask}
										isDisabled={tasks.length <= 1}
									/>
								</div>
							</div>

							<FormComponent
								isCompact={true}
								hasBorder={false}
								hasHeader={false}
								sections={getTaskFormSection()}
								values={getTaskFormValues()}
								onChange={handleTaskFormChange}
							/>
						</div>
					</FormComponent>
				</Tab>

				{/* Upload tab ------------------------------------------------------------------------------------------- */}
				<Tab
					key="upload"
					title="Upload"
					className="flex flex-col items-center justify-center w-full"
				>
					<UploadComponent
						maxFiles={5}
						isUploading={isAdding}
						uploadedFiles={uploadedFiles}
						setUploadedFiles={setUploadedFiles}
						onSubmit={handleSubmitUpload}
						onCancel={handleCancelUpload}
						onDownloadTemplate={handleDownloadTemplate}
					/>
				</Tab>
			</Tabs>

			{/* Alert */}
			{alert.isVisible && (
				<AlertComponent
					title={alert.title}
					description={alert.description}
					size="compact"
					placement="top"
					color={alert.color}
					isVisible={alert.isVisible}
					handleClose={() => setAlert({ ...alert, isVisible: false })}
				/>
			)}
		</div>
	);
}
