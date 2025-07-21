"use client";

import React, { useEffect, useRef, useState } from "react";
import { use } from "react";
import moment from "moment-timezone";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { Tabs, Tab } from "@heroui/react";
import clsx from "clsx";
import { now, getLocalTimeZone } from "@internationalized/date";

import { TASKORDERSTATUS } from "@/utils/enum";
import { TaskOrder } from "@/interfaces/schema";
import { SetActualTaskOrder, SetStatusTaskOrder } from "@/libs/taskOrderAPI";
import { useAuth } from "@/providers/AuthContext";
import { useLoading } from "@/providers/LoadingContext";
import { convertToChristianCalendar, fetchTaskOrder } from "@/utils/functions";
import { useAlert } from "@/providers/AlertContext";
import { FormSection } from "@/interfaces/interfaces";
import FormComponent from "@/components/FormComponent";
import { fontMono } from "@/config/fonts";
import { TaskOrderTranslation } from "@/utils/constants";

moment.locale("th");

interface StartFormType {
	ap_date?: Date;
	oil_start_mile?: number;
	start_mile?: number;
	oil_start?: number;
	car_start_hour?: string;
	start_timer?: Date;
}
interface EndFormType {
	oil_slip?: string;
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
		oil_start_mile: undefined,
		start_mile: undefined,
		oil_start: undefined,
		car_start_hour: undefined,
		start_timer: undefined,
	};
	const defaultEndFormValues: EndFormType = {
		oil_slip: undefined,
		end_mile: undefined,
		oil_end: undefined,
		car_end_hour: undefined,
		end_timer: undefined,
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
		showLoading();
		setCommentValues({ comment: "" });
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
					paramData: paramData,
				});

				showAlert({
					title: "แจ้งปัญหาใบงานย่อยสำเร็จ",
					description: `แจ้งปัญหาใบงานย่อยเลขที่ ${taskOrder.id} แล้ว`,
					color: "success",
				});

				setTimeout(() => {
					router.back();
				}, 2000);
			} catch (err: any) {
				showAlert({
					title: "แจ้งปัญหาใบงานย่อยไม่สำเร็จ",
					description: err.message || "Unknown error occurred",
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

	const startTaskOrderFields: FormSection[] = [
		{
			fields: [
				{
					type: "date",
					name: "start_timer",
					isRequired: true,
					labelTranslator: TaskOrderTranslation,
					defaultValue: now(getLocalTimeZone()),
				},
				{
					type: "number",
					name: "start_mile",
					isRequired: true,
					labelTranslator: TaskOrderTranslation,
				},
			],
		},
	];

	const endTaskOrderFields: FormSection[] = [
		{
			fields: [
				{
					type: "date",
					name: "end_timer",
					isRequired: true,
					labelTranslator: TaskOrderTranslation,
					defaultValue: now(getLocalTimeZone()),
				},
				{
					type: "number",
					name: "end_mile",
					isRequired: true,
					labelTranslator: TaskOrderTranslation,
				},
				{
					type: "number",
					name: "actual_area",
					isRequired: true,
					labelTranslator: TaskOrderTranslation,
				},
			],
		},
	];

	const handleStartSubmitKeyIn = async (formData: any) => {
		setIsAdding(true);

		try {
			const convertedDate = convertToChristianCalendar(
				formData.start_timer
			);
			const paramData = {
				start_timer: convertedDate
					? new Date(convertedDate)
					: undefined,
				start_mile: formData.start_mile || undefined,
			};

			const promises = [
				SetStatusTaskOrder({
					token: userContext.token,
					tid: Number(tid),
					paramData: {
						status: TASKORDERSTATUS.InProgress,
					},
				}),
				SetActualTaskOrder({
					token: userContext.token,
					tid: Number(tid),
					paramData: paramData || {},
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

	const handleEndSubmitKeyIn = async (formData: any) => {
		setIsAdding(true);

		try {
			const convertedDate = convertToChristianCalendar(
				formData.end_timer
			);
			const paramData = {
				end_timer: convertedDate ? new Date(convertedDate) : undefined,
				end_mile: formData.end_mile || undefined,
				actual_area: formData.actual_area || undefined,
			};

			const promises = [
				SetActualTaskOrder({
					token: userContext.token,
					tid: Number(tid),
					paramData: paramData || {},
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

	const handleStartCancelKeyIn = () => {
		showAlert({
			title: "ยกเลิกบลาๆ",
			description: "ยกเลิกบลาๆ, ล้างข้อมูลในฟอร์ม",
			color: "warning",
		});

		setStartFormValues({
			...defaultStartFormValues,
		});

		setTimeout(() => {
			router.back();
		}, 2000);
	};

	const handleEndCancelKeyIn = () => {
		showAlert({
			title: "ยกเลิกบลาๆ",
			description: "ยกเลิกบลาๆ, ล้างข้อมูลในฟอร์ม",
			color: "warning",
		});

		setEndFormValues({
			...defaultEndFormValues,
		});

		setTimeout(() => {
			router.back();
		}, 2000);
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
				{/* Start tab ------------------------------------------------------------------------------------------- */}
				<Tab
					key="start"
					className="flex flex-col justify-center items-center w-full"
					title="กรอกรายละเอียด"
				>
					{taskOrder &&
						!taskOrder.start_mile &&
						!taskOrder.start_timer && (
							<FormComponent
								cancelLabel="ยกเลิก"
								isCompact={true}
								isSubmitting={isAdding}
								sections={startTaskOrderFields}
								submitLabel="ยืนยัน"
								subtitle={`${taskOrder.requestorders?.work_order_number}-${tid}`}
								subtitleClassName={clsx(
									"mt-1 font-mono text-gray-600 text-sm",
									fontMono.variable
								)}
								title="กรอกข้อมูลก่อนปฎิบัติงาน"
								values={startFormValues}
								onCancel={handleStartCancelKeyIn}
								onChange={handleStartTaskOrderChange}
								onSubmit={handleStartSubmitKeyIn}
							/>
						)}
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
								sections={endTaskOrderFields}
								submitLabel="ยืนยัน"
								subtitle={`${taskOrder.requestorders?.work_order_number}-${tid}`}
								subtitleClassName={clsx(
									"mt-1 font-mono text-gray-600 text-sm",
									fontMono.variable
								)}
								title="กรอกข้อมูลก่อนปฎิบัติงาน"
								values={endFormValues}
								onCancel={handleEndCancelKeyIn}
								onChange={handleEndTaskOrderChange}
								onSubmit={handleEndSubmitKeyIn}
							/>
						)}
					{taskOrder &&
						taskOrder.status === TASKORDERSTATUS.Completed && (
							<div className="my-8 font-medium text-gray-500 text-center">
								{`ใบงานย่อยหมายเลข ${tid} ได้ถูกปิดแล้ว`}
							</div>
						)}
				</Tab>

				{/* Edit tab ----------------------------------------------------------------------------------------- */}
				<Tab
					key="comment"
					className="flex flex-col justify-center items-center w-full"
					isDisabled={taskOrder.status === TASKORDERSTATUS.Completed}
					title="แจ้งปัญหา"
				>
					<FormComponent
						cancelLabel="ยกเลิก"
						isSubmitting={isSubmitting}
						sections={commentSections}
						size="expanded"
						submitLabel="ส่งความคิดเห็น"
						subtitle={`${taskOrder.requestorders?.work_order_number}-${tid}`}
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

				{/* Reject tab ----------------------------------------------------------------------------------------- */}
				<Tab
					key="reject"
					className="flex flex-col justify-center items-center w-full"
					isDisabled={taskOrder.status === TASKORDERSTATUS.Completed}
					title="ยกเลิก"
				>
					<FormComponent
						cancelLabel="ยกเลิก"
						isSubmitting={isSubmitting}
						sections={commentSections}
						size="expanded"
						submitLabel="ส่งความคิดเห็น"
						subtitle={`${taskOrder.requestorders?.work_order_number}-${tid}`}
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
