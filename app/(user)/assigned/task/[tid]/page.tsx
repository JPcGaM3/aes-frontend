"use client";

import React, { useEffect, useRef, useState } from "react";
import { use } from "react";
import moment from "moment-timezone";
import "moment/locale/th";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { Tabs, Tab } from "@heroui/react";
import clsx from "clsx";
import { now, getLocalTimeZone, today } from "@internationalized/date";

import { TASKORDERSTATUS } from "@/utils/enum";
import { TaskOrder } from "@/interfaces/schema";
import { useAuth } from "@/providers/AuthContext";
import { useLoading } from "@/providers/LoadingContext";
import { convertToChristianCalendar, fetchTaskOrder } from "@/utils/functions";
import { useAlert } from "@/providers/AlertContext";
import { FieldSection, FormSection } from "@/interfaces/interfaces";
import FormComponent from "@/components/FormComponent";
import { fontMono } from "@/config/fonts";
import {
	RequestOrderTranslation,
	TaskOrderTranslation,
} from "@/utils/constants";
import Header from "@/components/Header";
import FieldValueDisplayer from "@/components/FieldValueDisplayer";
import FormButtons from "@/components/FormButtons";
import {
	SetStatusTaskOrder,
	SetActualTaskOrder,
} from "@/services/taskOrderAPI";

moment.locale("th");

interface StartFormType {
	ap_date?: Date;
	start_date?: any;
	start_time?: any;
	oil_start_mile?: number;
	start_mile?: number;
	oil_start?: number;
	car_start_hour?: string;
	start_timer?: Date;
}
interface EndFormType {
	oil_slip?: string;
	end_date?: any;
	end_time?: any;
	end_mile?: number;
	oil_end?: number;
	car_end_hour?: string;
	end_timer?: Date;
	actual_area?: number;
}

export default function TaskManagementPage({
	params,
}: {
	params: Promise<{ tid: string }>;
}) {
	const { tid } = use(params);
	const { showLoading, hideLoading } = useLoading();
	const { userContext, isReady } = useAuth();
	const { showAlert } = useAlert();

	const searchParams = useSearchParams();
	const router = useRouter();
	const pathname = usePathname();
	const action = searchParams.get("action") || "view";

	const hasFetched = useRef(false);
	const [taskOrder, setTaskOrder] = useState<TaskOrder>({} as TaskOrder);
	const [isAdding, setIsAdding] = useState<boolean>(false);

	const defaultStartFormValues: StartFormType = {
		ap_date: undefined,
		start_date: today(getLocalTimeZone()),
		start_time: now(getLocalTimeZone()),
		oil_start_mile: undefined,
		start_mile: undefined,
		oil_start: undefined,
		car_start_hour: undefined,
		start_timer: undefined,
	};
	const defaultEndFormValues: EndFormType = {
		oil_slip: undefined,
		end_date: today(getLocalTimeZone()),
		end_time: now(getLocalTimeZone()),
		end_mile: undefined,
		oil_end: undefined,
		car_end_hour: undefined,
		end_timer: undefined,
		actual_area: undefined,
	};
	const [startFormValues, setStartFormValues] = useState<StartFormType>({
		...defaultStartFormValues,
	});
	const [endFormValues, setEndFormValues] = useState<EndFormType>({
		...defaultEndFormValues,
	});

	const [selectedTab, setSelectedTab] = useState(action);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [commentValues, setCommentValues] = useState<{
		comment: string;
	}>({
		comment: "",
	});

	useEffect(() => {
		if (tid && isReady && !hasFetched.current) {
			showLoading();
			hasFetched.current = true;
			const fetchData = async () => {
				try {
					const promises = [
						fetchTaskOrder({
							token: userContext.token,
							taskId: Number(tid),
							setTaskOrder,
							showAlert,
						}),
					];

					await Promise.all(promises);
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
	}, [isReady, tid]);

	const commentSections: FormSection[] = [
		{
			fields: [
				[
					{
						type: "textarea",
						name: "comment",
						label: "กรุณาระบุเหตุผล",
						labelPlacement: "outside",
						isRequired: true,
						minRows: 5,
						maxRows: 8,
					},
				],
			],
		},
	];

	const startFormSections: FormSection[] = [
		{
			fields: [
				{
					type: "number",
					name: "start_mile",
					minValue: 0,
					isRequired: true,
					labelTranslator: TaskOrderTranslation,
				},
				[
					{
						type: "date",
						name: "start_date",
						isRequired: true,
						labelTranslator: TaskOrderTranslation,
					},
					{
						type: "time",
						name: "start_time",
						isRequired: true,
						labelTranslator: TaskOrderTranslation,
						granularity: "minute",
					},
				],
			],
		},
	];

	const endFormSections: FormSection[] = [
		{
			fields: [
				{
					type: "number",
					name: "end_mile",
					minValue: 0,
					isRequired: true,
					labelTranslator: TaskOrderTranslation,
				},
				{
					type: "number",
					name: "actual_area",
					minValue: 0,
					maxValue: taskOrder.target_area,
					isRequired: true,
					labelTranslator: TaskOrderTranslation,
				},
				[
					{
						type: "date",
						name: "end_date",
						isRequired: true,
						labelTranslator: TaskOrderTranslation,
					},
					{
						type: "time",
						name: "end_time",
						isRequired: true,
						labelTranslator: TaskOrderTranslation,
						granularity: "minute",
					},
				],
			],
		},
	];

	const dataSections: FieldSection[] = [
		{
			fields: [
				{
					name: "customer_type_id",
					value: taskOrder?.requestorders?.customer_type?.name || "-",
					labelTranslator: RequestOrderTranslation,
				},
				{
					name: "ae_id",
					value: taskOrder?.requestorders?.ae_area?.name || "-",
					labelTranslator: RequestOrderTranslation,
				},
				{
					name: "unit_head_id",
					value: taskOrder?.requestorders?.users?.fullname || "-",
					labelTranslator: RequestOrderTranslation,
				},
				{
					name: "supervisor_name",
					value: taskOrder?.requestorders?.supervisor_name || "-",
					labelTranslator: RequestOrderTranslation,
				},
				{
					name: "phone",
					value: taskOrder?.requestorders?.phone || "-",
					labelTranslator: RequestOrderTranslation,
				},
			],
		},
		{
			title: "สถานที่ปฏิบัติงาน",
			fields: [
				{
					name: "quota_number",
					value: taskOrder?.requestorders?.quota_number || "-",
					labelTranslator: RequestOrderTranslation,
				},
				{
					name: "farmer_name",
					value: taskOrder?.requestorders?.farmer_name || "-",
					labelTranslator: RequestOrderTranslation,
				},
				{
					name: "land_number",
					value: taskOrder?.requestorders?.land_number || "-",
					labelTranslator: RequestOrderTranslation,
				},
				{
					name: "operation_area_id",
					value:
						taskOrder?.requestorders?.operation_area
							?.operation_area || "-",
					labelTranslator: RequestOrderTranslation,
				},
				{
					name: "location_xy",
					value: taskOrder?.requestorders?.location_xy || "-",
					labelTranslator: RequestOrderTranslation,
				},
			],
		},
		{
			title: "รายละเอียดงาน",
			fields: [
				{
					name: "id",
					value: taskOrder?.id || "-",
					labelTranslator: TaskOrderTranslation,
				},
				{
					name: "target_area",
					value: taskOrder?.target_area || 0,
					labelTranslator: TaskOrderTranslation,
				},
				{
					name: "actual_area",
					value: taskOrder?.actual_area || 0,
					labelTranslator: TaskOrderTranslation,
				},
				{
					name: "ap_date",
					value: taskOrder?.ap_date
						? moment(taskOrder.ap_date)
								.tz("Asia/Bangkok")
								.format("LLL")
						: "-",
					labelTranslator: TaskOrderTranslation,
				},
			],
		},
		{
			title: "กิจกรรมและเครื่องมือ",
			fields: [
				{
					name: "activities_id",
					value: taskOrder?.activities?.name || "-",
					labelTranslator: TaskOrderTranslation,
				},
				{
					name: "tool_types_id",
					value: taskOrder?.tool_type?.tool_type_name || "-",
					labelTranslator: TaskOrderTranslation,
				},
				{
					name: "car_id",
					value: taskOrder?.cars?.car_number || "-",
					labelTranslator: TaskOrderTranslation,
				},
			],
		},
	];

	const handleTabChange = (key: React.Key) => {
		if (typeof key === "string") {
			setSelectedTab(key);

			const newSearchParams = new URLSearchParams(
				searchParams.toString()
			);

			newSearchParams.set("action", key);

			const newQuery = newSearchParams.toString();

			router.replace(`${pathname}${newQuery ? `?${newQuery}` : ""}`);
		}
	};

	const handleCommentChange = (newValues: typeof commentValues) => {
		setCommentValues(newValues);
	};

	const handleCancel = () => {
		if (
			commentValues.comment ||
			startFormValues.start_mile ||
			endFormValues.end_mile
		) {
			showAlert({
				title: "ยกเลิก",
				description:
					"การกรอกข้อมูล/แจ้งปัญหา/ปฏิเสธ, ล้างข้อมูลในฟอร์ม",
				color: "warning",
			});
		}

		setStartFormValues({
			...defaultStartFormValues,
		});

		setEndFormValues({
			...defaultEndFormValues,
		});

		setCommentValues({
			comment: "",
		});

		router.back();
	};

	const handleStatus = async (status?: TASKORDERSTATUS): Promise<any> => {
		if (
			tid ||
			isReady ||
			userContext.id ||
			userContext.role ||
			userContext.token ||
			userContext.ae_id
		) {
			setIsSubmitting(true);

			if (!commentValues.comment.trim()) {
				showAlert({
					title: "คำเตือน!!",
					description: "คำอธิบาย: กรุณาระบุเหตุผล",
					color: "warning",
				});

				setIsSubmitting(false);

				return;
			}

			try {
				const paramData = {
					comment: (commentValues.comment as string) || undefined,
					status: (status as TASKORDERSTATUS) || undefined,
				};

				await SetStatusTaskOrder({
					token: userContext.token,
					tid: Number(tid),
					body: paramData,
				});

				showAlert({
					title: "แจ้งปัญหาใบงานย่อยสำเร็จ",
					description: `แจ้งปัญหาใบงานย่อยเลขที่ ${taskOrder.id} แล้ว`,
					color: "success",
				});

				setTimeout(() => {
					router.back();
				}, 2000);
			} catch (error: any) {
				showAlert({
					title: "แจ้งปัญหาใบงานย่อยไม่สำเร็จ",
					description: error.message || "Unknown error occurred",
					color: "danger",
				});
			} finally {
				setIsSubmitting(false);
			}
		} else {
			showAlert({
				title: "ไม่สามารถโหลดข้อมูลผู้ใช้งานได้",
				description: "กรุณาเข้าสู่ระบบและลองอีกครั้ง",
				color: "danger",
			});

			setTimeout(() => {
				hideLoading();
				router.push("/login");
			}, 2000);
		}
	};

	const handleStartSubmitKeyIn = async (formData: StartFormType) => {
		setIsAdding(true);

		try {
			let combinedDateTime: Date | undefined = undefined;

			if (formData.start_date && formData.start_time) {
				const dateValue = formData.start_date;
				const timeValue = formData.start_time;

				if (dateValue && timeValue) {
					const date = new Date(dateValue);

					const hours = timeValue.hour || 0;
					const minutes = timeValue.minute || 0;
					const seconds = timeValue.second || 0;

					date.setHours(hours, minutes, seconds, 0);
					combinedDateTime = date;
				}

				combinedDateTime =
					new Date(
						convertToChristianCalendar(combinedDateTime) || ""
					) || undefined;
			}

			const paramData = {
				start_timer: combinedDateTime?.toISOString(),
				start_mile: formData.start_mile || undefined,
			};

			const promises = [
				SetStatusTaskOrder({
					token: userContext.token,
					tid: Number(tid),
					body: {
						status: TASKORDERSTATUS.InProgress,
					},
				}),
				SetActualTaskOrder({
					token: userContext.token,
					tid: Number(tid),
					body: paramData || {},
				}),
			];

			await Promise.all(promises);

			showAlert({
				title: "สำเร็จ!!",
				description: "เพิ่มรายการคำขอสำเร็จ",
				color: "success",
			});
		} catch (error: any) {
			showAlert({
				title: "กรอกรายละเอียดก่อนทำงานล้มเหลว",
				description: error.message || "เกิดข้อผิดพลาด",
				color: "danger",
			});
		} finally {
			setTimeout(() => {
				setIsAdding(false);
				window.location.reload();
			}, 500);
		}
	};

	const handleEndSubmitKeyIn = async (formData: EndFormType) => {
		setIsAdding(true);

		try {
			let combinedDateTime: Date | undefined = undefined;

			if (formData.end_date && formData.end_time) {
				const dateValue = formData.end_date;
				const timeValue = formData.end_time;

				if (dateValue && timeValue) {
					const date = new Date(dateValue);

					const hours = timeValue.hour || 0;
					const minutes = timeValue.minute || 0;
					const seconds = timeValue.second || 0;

					date.setHours(hours, minutes, seconds, 0);
					combinedDateTime = date;
				}

				combinedDateTime =
					new Date(
						convertToChristianCalendar(combinedDateTime) || ""
					) || undefined;
			}

			const paramData = {
				end_timer: combinedDateTime,
				end_mile: formData.end_mile || undefined,
				actual_area: formData.actual_area || undefined,
			};

			const promises = [
				SetActualTaskOrder({
					token: userContext.token,
					tid: Number(tid),
					body: paramData || {},
				}),
			];

			await Promise.all(promises);

			showAlert({
				title: "สำเร็จ!!",
				description: "เพิ่มรายการคำขอสำเร็จ",
				color: "success",
			});
		} catch (error: any) {
			showAlert({
				title: "กรอกรายละเอียดก่อนทำงานล้มเหลว",
				description: error.message || "เกิดข้อผิดพลาด",
				color: "danger",
			});
		} finally {
			setTimeout(() => {
				setIsAdding(false);
				router.back();
			}, 500);
		}
	};

	const handleStartTaskOrderChange = (values: any) => {
		const updateValues = {
			...startFormValues,
			...values,
		};

		setStartFormValues(updateValues);
	};

	const handleEndTaskOrderChange = (values: any) => {
		const updateValues = {
			...endFormValues,
			...values,
		};

		setEndFormValues(updateValues);
	};

	return (
		<div className="flex flex-col justify-center items-center w-full">
			<Tabs
				aria-label="TabOptions"
				className="flex flex-col justify-center items-center p-0 pb-4 w-full font-semibold"
				radius="sm"
				selectedKey={selectedTab}
				onSelectionChange={handleTabChange}
			>
				{/* Detail tab ------------------------------------------------------------------------------------------ */}
				<Tab
					key="detail"
					className="flex flex-col justify-center items-center gap-8 w-full"
					title="รายละเอียด"
				>
					<Header
						hasBorder={false}
						subtitle={`@${taskOrder.requestorders?.work_order_number}-${tid}`}
						subtitleClassName={clsx(
							"mt-1 font-mono text-gray-600 text-sm",
							fontMono.variable
						)}
						title="รายละเอียดใบงานย่อย"
					/>

					<FieldValueDisplayer sections={dataSections} />

					<FormButtons
						hasBorder={false}
						size="compact"
						submitColor="default"
						submitLabel="ยกเลิก"
						onSubmit={handleCancel}
					/>
				</Tab>

				{/* Start tab ------------------------------------------------------------------------------------------- */}
				<Tab
					key="start"
					className="flex flex-col justify-center items-center w-full"
					isDisabled={
						taskOrder.status === TASKORDERSTATUS.Completed ||
						taskOrder.status === TASKORDERSTATUS.Rejected
					}
					title="กรอกข้อมูล"
				>
					{/* Start form */}
					{taskOrder &&
						!taskOrder.start_mile &&
						!taskOrder.start_timer && (
							<FormComponent
								cancelLabel="ยกเลิก"
								isCompact={true}
								isSubmitting={isAdding}
								sections={startFormSections}
								submitLabel="ยืนยัน"
								subtitle={`@${taskOrder.requestorders?.work_order_number}-${tid}`}
								subtitleClassName={clsx(
									"mt-1 font-mono text-gray-600 text-sm",
									fontMono.variable
								)}
								title="กรอกข้อมูลก่อนปฎิบัติงาน"
								values={startFormValues}
								onCancel={handleCancel}
								onChange={handleStartTaskOrderChange}
								onSubmit={handleStartSubmitKeyIn}
							/>
						)}

					{/* End form */}
					{taskOrder &&
						taskOrder.start_mile &&
						taskOrder.start_timer &&
						!(
							(taskOrder.actual_area || 0) >=
							(taskOrder.target_area || 1)
						) && (
							<FormComponent
								cancelLabel="ยกเลิก"
								isCompact={true}
								isSubmitting={isAdding}
								sections={endFormSections}
								submitLabel="ยืนยัน"
								subtitle={`@${taskOrder.requestorders?.work_order_number}-${tid}`}
								subtitleClassName={clsx(
									"mt-1 font-mono text-gray-600 text-sm",
									fontMono.variable
								)}
								title="กรอกข้อมูลหลังปฎิบัติงาน"
								values={endFormValues}
								onCancel={handleCancel}
								onChange={handleEndTaskOrderChange}
								onSubmit={handleEndSubmitKeyIn}
							/>
						)}
				</Tab>

				{/* Edit tab -------------------------------------------------------------------------------------------- */}
				<Tab
					key="comment"
					className="flex flex-col justify-center items-center w-full"
					isDisabled={
						taskOrder.status === TASKORDERSTATUS.Completed ||
						taskOrder.status === TASKORDERSTATUS.Rejected
					}
					title="แจ้งปัญหา"
				>
					<FormComponent
						cancelLabel="ยกเลิก"
						isSubmitting={isSubmitting}
						sections={commentSections}
						submitLabel="ส่งความคิดเห็น"
						subtitle={`@${taskOrder.requestorders?.work_order_number}-${tid}`}
						subtitleClassName={clsx(
							"mt-1 font-mono text-gray-600 text-sm",
							fontMono.variable
						)}
						title="แจ้งปัญหาใบงานย่อย"
						values={commentValues}
						onCancel={handleCancel}
						onChange={handleCommentChange}
						onSubmit={() => handleStatus()}
					/>
				</Tab>

				{/* Reject tab ------------------------------------------------------------------------------------------ */}
				<Tab
					key="reject"
					className="flex flex-col justify-center items-center w-full"
					isDisabled={
						taskOrder.status === TASKORDERSTATUS.Completed ||
						taskOrder.status === TASKORDERSTATUS.Rejected
					}
					title="ยกเลิก"
				>
					<FormComponent
						cancelLabel="ยกเลิก"
						isSubmitting={isSubmitting}
						sections={commentSections}
						submitLabel="ส่งความคิดเห็น"
						subtitle={`@${taskOrder.requestorders?.work_order_number}-${tid}`}
						subtitleClassName={clsx(
							"mt-1 font-mono text-gray-600 text-sm",
							fontMono.variable
						)}
						title="ปฏิเสธใบงานย่อย"
						values={commentValues}
						onCancel={handleCancel}
						onChange={handleCommentChange}
						onSubmit={() => handleStatus(TASKORDERSTATUS.Rejected)}
					/>
				</Tab>
			</Tabs>
		</div>
	);
}
