"use client";

import React, { useRef } from "react";
import { useEffect, useState } from "react";
import { Tab, Tabs, Divider, Button } from "@heroui/react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/providers/AuthContext";
import {
	yearList,
	monthList,
	RequestOrderTranslation,
} from "@/utils/constants";
import { PlusIcon, MinusIcon } from "@/utils/icons";
import {
	Activity,
	OperationArea,
	RequestOrder,
	ToolType,
} from "@/interfaces/schema";
import { FormSection, UploadedFile } from "@/interfaces/interfaces";
import FormComponent from "@/components/FormComponent";
import UploadComponent from "@/components/UploadComponent";
import { KeyInRequestOrder, uploadRequestOrder } from "@/libs/requestOrderAPI";
import { useLoading } from "@/providers/LoadingContext";
import {
	fetchActivitiesWithToolTypes,
	fetchOperationAreas,
} from "@/utils/functions";
import { useAlert } from "@/providers/AlertContext";

interface FormType extends RequestOrder {
	activities: string;
	tool_types: string;
}

interface TaskFormType {
	activity_name: string;
	tool_type_name: string;
}

export default function AddRequestPage() {
	// const value & react hook ----------------------------------------------------------------------------------------
	const router = useRouter();
	const { userContext, isReady } = useAuth();
	const { showLoading, hideLoading } = useLoading();
	const { showAlert } = useAlert();
	const hasFetched = useRef(false);
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
	const [tasks, setTasks] = useState<TaskFormType[]>([defaultTask]);
	const [formValues, setFormValues] = useState<FormType>(defaultFormValues);
	const [opOptions, setOpOptions] = useState<OperationArea[]>([]);
	const [isAdding, setIsAdding] = useState<boolean>(false);
	const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
	const [taskErrors, setTaskErrors] = useState<Record<string, string | null>>(
		{}
	);

	// Fetch data ---------------------------------------------------------------------------------------------------
	useEffect(() => {
		if (isReady) {
			showLoading();
			hasFetched.current = true;
			const fetchData = async () => {
				try {
					const promises = [
						fetchOperationAreas({
							token: userContext.token,
							setOpArea: setOpOptions,
							showAlert: showAlert,
						}),
						fetchActivitiesWithToolTypes({
							token: userContext.token,
							setActivitiesWithToolTypes: setActivityWithTools,
							showAlert: showAlert,
						}),
					];

					await Promise.all(promises);

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
				} catch (error: any) {
					showAlert({
						title: "ไม่สามารถโหลดข้อมูลได้",
						description:
							error.message || "เกิดข้อผิดพลาดในการโหลดข้อมูล",
						color: "danger",
					});
				} finally {
					hideLoading();
				}
			};

			fetchData();
		}
	}, [isReady]);

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
			showAlert({
				color: "danger",
				title: "ไม่สามารถอัปโหลดไฟล์ได้",
				description: "กรุณาอัปโหลดไฟล์อย่างน้อย 1 ไฟล์ก่อนยืนยัน.",
			});

			return;
		}

		setIsAdding(true);

		try {
			const response = await uploadRequestOrder({
				token: userContext.token,
				ae_id: userContext.ae_id,
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
				alertTitle = "การอัปโหลดสำเร็จ";
				alertColor = "success";
			} else if (validRows === 0) {
				alertTitle = "การอัปโหลดล้มเหลว";
				alertColor = "danger";
			} else {
				alertTitle = "การอัปโหลดสำเร็จ แต่มีข้อผิดพลาดบางประการ";
				alertColor = "warning";
			}

			showAlert({
				color: alertColor,
				title: alertTitle,
				description: `จำนวนแถวทั้งหมด: ${totalRows} , จำนวนแถวที่ถูกต้อง: ${validRows} , จำนวนแถวที่ผิดพลาด: ${errorRows}`,
			});
		} catch (error) {
			showAlert({
				color: "danger",
				title: "การอัปโหลดล้มเหลว",
				description: "การอัปโหลดล้มเหลว!, ข้อผิดพลาด: " + error,
			});
		} finally {
			setTimeout(() => {
				setIsAdding(false);
				setUploadedFiles([]);
			}, 500);
		}
	};

	const handleCancelUpload = (_e?: any): void => {
		showAlert({
			title: "ยกเลิกการอัปโหลดใบสั่งงาน",
			description: "ยกเลิกการอัปโหลดใบสั่งงาน, ล้างข้อมูลในฟอร์ม",
			color: "warning",
		});

		setUploadedFiles([]);

		setTimeout(() => {
			router.back();
		}, 1000);
	};

	const handleRequestOrderChange = (values: any) => {
		const updateValues = {
			...formValues,
			...values,
		};

		setFormValues(updateValues);
	};

	const handleSubmitKeyIn = async (formData: any) => {
		setIsAdding(true);

		// Validate tasks first
		if (!validateTasks()) {
			showAlert({
				title: "ข้อมูลไม่ครบถ้วน",
				description:
					"กรุณาเลือกกิจกรรมและประเภทเครื่องมือให้ครบทุกรายการ",
				color: "warning",
			});
			setIsAdding(false);

			return;
		}

		const activities = tasks.map((t) => t.activity_name).join("+");
		const tool_types = tasks.map((t) => t.tool_type_name).join("+");
		const submitValue = {
			...formData,
			activities,
			tool_types,
		};

		try {
			await KeyInRequestOrder({
				token: userContext.token,
				data: submitValue,
			});

			showAlert({
				title: "สำเร็จ!!",
				description: "เพิ่มรายการคำขอสำเร็จ",
				color: "success",
			});

			setTasks([defaultTask]);
			setFormValues({
				...defaultFormValues,
				ae_id: userContext.ae_id,
			});
		} catch (error: any) {
			showAlert({
				title: "เพิ่มรายการคำขอล้มเหลว",
				description: error.message || "เกิดข้อผิดพลาด",
				color: "danger",
			});
		} finally {
			setTimeout(() => {
				setIsAdding(false);
			}, 500);
		}
	};

	const handleCancelKeyIn = () => {
		showAlert({
			title: "ยกเลิกการเพิ่มใบสั่งงาน",
			description: "ยกเลิกการเพิ่มใบสั่งงาน, ล้างข้อมูลในฟอร์ม",
			color: "warning",
		});

		setFormValues({
			...defaultFormValues,
			ae_id: userContext.ae_id,
		});

		setTasks([defaultTask]);

		setTimeout(() => {
			router.back();
		}, 1000);
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

		// Clear task errors when values change
		const newErrors = { ...taskErrors };

		for (let i = 0; i < tasks.length; i++) {
			const activity = values[`activity_name_${i}`] || "";
			const prevActivity = tasks[i]?.activity_name || "";

			let toolType = values[`tool_type_name_${i}`] || "";

			if (activity !== prevActivity) {
				toolType = "";
			}

			// Clear errors for this task when values change
			delete newErrors[`activity_name_${i}`];
			delete newErrors[`tool_type_name_${i}`];

			newTasks.push({
				activity_name: activity,
				tool_type_name: toolType,
			});
		}

		setTaskErrors(newErrors);
		setTasks(newTasks);
	};

	const validateTasks = (): boolean => {
		const newErrors: Record<string, string | null> = {};

		tasks.forEach((task, index) => {
			if (!task.activity_name) {
				newErrors[`activity_name_${index}`] = null; // Use default error message
			}
			if (!task.tool_type_name) {
				newErrors[`tool_type_name_${index}`] = null; // Use default error message
			}
		});

		setTaskErrors(newErrors);

		return Object.keys(newErrors).length === 0;
	};

	// Field configurations ----------------------------------------------------------------------------------------
	// TODO: change label for zone and farmer_name following operation_area_id
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
					unit: "ไร่",
					minValue: 0,
					isRequired: true,
					labelTranslator: RequestOrderTranslation,
				},
				{
					type: "text",
					name: "land_number",
					isRequired: true,
					labelTranslator: RequestOrderTranslation,
				},
				{
					type: "textarea",
					name: "location_xy",
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
					isRequired: true,
					options: activityWithTools.map((activity: Activity) => ({
						label: activity.name,
						value: activity.name,
					})),
					className: "w-1/2",
				},
				{
					type: "dropdown",
					name: `tool_type_name_${idx}`,
					label: "ประเภทเครื่องมือ",
					isRequired: true,
					options: getToolTypeOptions(task.activity_name),
					className: "w-1/2",
					isReadOnly: !task.activity_name,
				},
			]),
		},
	];

	return (
		<>
			<div className="flex flex-col items-center justify-center w-full">
				<Tabs
					aria-label="TabOptions"
					className="flex flex-col items-center justify-center w-full pb-4 font-semibold"
					radius="sm"
				>
					{/* Key-in tab ------------------------------------------------------------------------------------------- */}
					<Tab
						key="key-in"
						className="flex flex-col items-center justify-center w-full"
						title="Key-in"
					>
						<FormComponent
							cancelLabel="ยกเลิก"
							isCompact={true}
							isSubmitting={isAdding}
							sections={requestOrderFields}
							submitLabel="ยืนยัน"
							subtitle="กรุณากรอกข้อมูลใบสั่งงานลงในฟอร์มด้านล่าง"
							title="สร้างใบสั่งงาน"
							values={formValues}
							onCancel={handleCancelKeyIn}
							onChange={handleRequestOrderChange}
							onSubmit={handleSubmitKeyIn}
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
											color="default"
											isDisabled={tasks.length >= 5}
											radius="sm"
											size="sm"
											startContent={<PlusIcon />}
											variant="flat"
											onPress={handleAddTask}
										/>
										<Button
											isIconOnly
											color="default"
											isDisabled={tasks.length <= 1}
											radius="sm"
											size="sm"
											startContent={<MinusIcon />}
											variant="flat"
											onPress={handleRemoveTask}
										/>
									</div>
								</div>

								<FormComponent
									errors={taskErrors}
									hasBorder={false}
									hasHeader={false}
									isCompact={true}
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
						className="flex flex-col items-center justify-center w-full"
						title="Upload"
					>
						<UploadComponent
							isUploading={isAdding}
							maxFiles={5}
							setUploadedFiles={setUploadedFiles}
							uploadedFiles={uploadedFiles}
							onCancel={handleCancelUpload}
							onDownloadTemplate={handleDownloadTemplate}
							onSubmit={handleSubmitUpload}
						/>
					</Tab>
				</Tabs>
			</div>
		</>
	);
}
