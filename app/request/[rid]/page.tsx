"use client";

import React, { useRef } from "react";
import { use, useState, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import clsx from "clsx";
import { Alert, Button, Tab, Tabs } from "@heroui/react";
import moment from "moment-timezone";
import "moment/locale/th";

import { fontMono } from "@/config/fonts";
import Header from "@/components/Header";
import FormButtons from "@/components/FormButtons";
import FormComponent from "@/components/FormComponent";
import FieldValueDisplayer from "@/components/FieldValueDisplayer";
import DynamicTaskOrder from "@/components/DynamicTaskOrder";
import { useLoading } from "@/providers/LoadingContext";
import { useAuth } from "@/providers/AuthContext";
import { useTaskOrderForm } from "@/hooks/useTaskOrderForm";
import { FieldSection, FormSection } from "@/interfaces/interfaces";
import {
	Activity,
	AeArea,
	Car,
	CustomerType,
	OperationArea,
	RequestOrder,
	User,
} from "@/interfaces/schema";
import {
	month,
	getMonthList,
	getYearList,
	TaskOrderTranslation,
	RequestOrderTranslation,
	RequestOrderStatusTranslation,
} from "@/utils/constants";
import { SetStatusRequestOrder } from "@/libs/requestOrderAPI";
import { REQUESTORDERSTATUS, USERROLE } from "@/utils/enum";
import {
	fetchActivitiesWithToolTypes,
	fetchAE,
	fetchCars,
	fetchCustomerTypes,
	fetchOperationAreas,
	fetchReqOrderWithTaskData,
	fetchUsers,
} from "@/utils/functions";
import { translateEnumValue } from "@/utils/functions";
import { useAlert } from "@/providers/AlertContext";
import { CheckIcon } from "@/utils/icons";
import { taskOrderAPIService } from "@/libs/taskOrderAPI";

moment.locale("th");

export default function RequestManagementPage({
	params,
}: {
	params: Promise<{ rid: number }>;
}) {
	// const and hooks -------------------------------------------------------------------------------------------
	const { rid } = use(params);
	const { userContext, isReady } = useAuth();
	const { showLoading, hideLoading } = useLoading();
	const { showAlert } = useAlert();

	const searchParams = useSearchParams();
	const router = useRouter();
	const pathname = usePathname();
	const action = searchParams.get("action") || "view";

	const hasFetched = useRef(false);
	const [selectedTab, setSelectedTab] = useState(action);
	const [carData, setCarData] = useState<Car[]>([]);
	const [aeData, setAeData] = useState<AeArea[]>([]);
	const [driverData, setDriverData] = useState<User[]>([]);
	const [opData, setOpData] = useState<OperationArea[]>([]);
	const [unitHeadData, setUnitHeadData] = useState<User[]>([]);
	const [customerData, setCustomerData] = useState<CustomerType[]>([]);
	const [activityWithToolTypes, setActivityWithToolTypes] = useState<
		Activity[]
	>([]);
	const [requestData, setRequestData] = useState<RequestOrder>(
		{} as RequestOrder
	);

	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isHoveringComment, setIsHoveringComment] = useState(false);
	const [commentValues, setCommentValues] = useState<{
		comment: string;
	}>({
		comment: "",
	});

	const {
		taskOrderUIItems,
		requestOrderChanges,
		taskOrderErrors,
		addTaskOrder,
		removeTaskOrder,
		updateTaskOrder,
		updateRequestOrder,
		validateTaskOrders,
		resetChanges,
		getTaskOrderOperations,
		initializeFromData,
		hasChanges,
	} = useTaskOrderForm();

	// Fetch data ------------------------------------------------------------------------------------------------
	useEffect(() => {
		if (rid && isReady && userContext && !hasFetched.current) {
			showLoading();
			hasFetched.current = true;
			const fetchData = async () => {
				try {
					const promises = [
						fetchUsers({
							token: userContext.token,
							role: [USERROLE.UnitHead],
							setUsers: setUnitHeadData,
							showAlert: showAlert,
						}),
						fetchUsers({
							token: userContext.token,
							role: [USERROLE.Driver],
							setUsers: setDriverData,
							showAlert: showAlert,
						}),
						fetchAE({
							token: userContext.token,
							setAE: setAeData,
							showAlert: showAlert,
						}),
						fetchCustomerTypes({
							token: userContext.token,
							setCustomerTypes: setCustomerData,
							showAlert: showAlert,
						}),
						fetchOperationAreas({
							token: userContext.token,
							setOpArea: setOpData,
							showAlert: showAlert,
						}),
						fetchCars({
							token: userContext.token,
							ae_id: userContext.ae_id,
							setCars: setCarData,
							showAlert: showAlert,
						}),
						fetchActivitiesWithToolTypes({
							token: userContext.token,
							setActivitiesWithToolTypes:
								setActivityWithToolTypes,
							showAlert: showAlert,
						}),
						fetchReqOrderWithTaskData({
							token: userContext.token,
							requestId: rid,
							setReqOrder: setRequestData,
							showAlert: showAlert,
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
	}, [isReady, rid, userContext]);

	useEffect(() => {
		if (requestData && requestData.id) {
			initializeFromData(requestData);
		}
	}, [requestData]);

	// Handler ---------------------------------------------------------------------------------------------------
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

	const handleCancel = () => {
		if (commentValues.comment || hasChanges()) {
			showAlert({
				title: "ยกเลิกการแก้ไขใบสั่งงาน",
				description: "ยกเลิกการแก้ไขหรือปฏิเสธ, ล้างข้อมูลในฟอร์ม",
				color: "warning",
			});
		}

		setCommentValues({ comment: "" });
		resetChanges();

		setTimeout(() => {
			router.back();
		}, 1000);
	};

	const handleStatus = async (status: REQUESTORDERSTATUS): Promise<any> => {
		setIsSubmitting(true);

		if (
			!commentValues.comment.trim() &&
			status !== REQUESTORDERSTATUS.PendingApproval
		) {
			showAlert({
				title: "คำเตือน!!",
				description: "กรุณาระบุเหตุผล",
				color: "warning",
			});

			setIsSubmitting(false);

			return;
		}

		try {
			const paramData = {
				status: (status as REQUESTORDERSTATUS) || undefined,
				comment: (commentValues.comment as string) || undefined,
			};

			await SetStatusRequestOrder({
				token: userContext.token,
				rid: Number(rid),
				paramData: paramData,
			});

			showAlert({
				title: "อัพเดตใบสั่งงานสำเร็จ",
				description: `อัพเดตสถานะใบสั่งงานเลขที่ ${requestData.work_order_number} เป็น ${translateEnumValue(status, RequestOrderStatusTranslation)} สำเร็จแล้ว`,
				color: "success",
			});

			setTimeout(() => {
				router.back();
			}, 2000);
		} catch (error: any) {
			showAlert({
				title: "ยกเลิกใบสั่งงานไม่สำเร็จ",
				description: error.message || "Unknown error occurred",
				color: "danger",
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleCommentChange = (newValues: typeof commentValues) => {
		setCommentValues(newValues);
	};

	const handleValueChange = (newValues: any) => {
		const requestOrderFields = [
			"customer_type_id",
			"phone",
			"operation_area_id",
			"ae_id",
			"zone",
			"quota_number",
			"farmer_name",
			"target_area",
			"land_number",
			"location_xy",
			"ap_month",
			"ap_year",
			"supervisor_name",
			"unit_head_id",
		];

		const requestOrderChanges: any = {};

		Object.keys(newValues).forEach((key) => {
			if (requestOrderFields.includes(key)) {
				requestOrderChanges[key] = newValues[key];
			}
		});

		if (Object.keys(requestOrderChanges).length > 0) {
			updateRequestOrder(requestOrderChanges);
		}
	};

	const handleSubmit = async () => {
		try {
			setIsSubmitting(true);

			// Validate task orders first
			if (!validateTaskOrders()) {
				showAlert({
					title: "ข้อมูลไม่ถูกต้อง",
					description: "กรุณาตรวจสอบข้อมูลในกิจกรรมที่มีข้อผิดพลาด",
					color: "warning",
				});
				setIsSubmitting(false);

				return;
			}

			if (Object.keys(requestOrderChanges).length > 0) {
				await taskOrderAPIService.updateRequestOrder(
					userContext.token,
					Number(rid),
					requestOrderChanges
				);
			}

			const operations = getTaskOrderOperations();

			if (operations.length > 0) {
				const result =
					await taskOrderAPIService.processTaskOrderOperations(
						userContext.token,
						Number(rid),
						operations,
						userContext.id
					);

				if (!result.success) {
					throw new Error(
						result.errors.map((e) => e.error).join(", ")
					);
				}
			}

			showAlert({
				title: "บันทึกสำเร็จ",
				description: "อัพเดตข้อมูลใบสั่งงานสำเร็จแล้ว",
				color: "success",
			});

			handleTabChange("view");
			setTimeout(() => {
				window.location.reload();
			}, 1000);
		} catch (error: any) {
			showAlert({
				title: "เกิดข้อผิดพลาด",
				description: error.message || "ไม่สามารถบันทึกข้อมูลได้",
				color: "danger",
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleClearComment = async () => {
		setIsSubmitting(true);

		try {
			await SetStatusRequestOrder({
				token: userContext.token,
				rid: Number(rid),
			});

			showAlert({
				title: "แก้ไขหมายเหตุสำเร็จ",
				description: `แก้ไขหมายเหตุ ใบสั่งงานเลขที่ ${requestData.work_order_number} สำเร็จแล้ว`,
				color: "success",
			});

			setTimeout(() => {
				window.location.reload();
			}, 1000);
		} catch (error: any) {
			showAlert({
				title: "แก้ไขหมายเหตุไม่สำเร็จ",
				description: error.message || "Unknown error occurred",
				color: "danger",
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	const getToolTypeData = (activity_id?: number) => {
		if (!activity_id) return [];

		const activity = activityWithToolTypes.find(
			(a) => a.id === activity_id
		);

		if (!activity || !activity.tool_types) {
			return [];
		}

		return activity.tool_types.map((tool) => ({
			label: tool.tool_type_name,
			value: tool.id,
		}));
	};

	// Field config ----------------------------------------------------------------------------------------------
	const dataSections: FieldSection[] = [
		{
			fields: [
				{
					name: "customer_type_id",
					value: requestData?.customer_type?.name || "-",
					labelTranslator: RequestOrderTranslation,
				},
				{
					name: "created_at",
					value: requestData?.created_at
						? moment(requestData.created_at)
								.tz("Asia/Bangkok")
								.format("LLL")
						: "-",
					labelTranslator: RequestOrderTranslation,
				},
				{
					name: "ae_id",
					value: requestData?.ae_area?.name || "-",
					labelTranslator: RequestOrderTranslation,
				},
				{
					name: "unit_head_id",
					value: requestData?.users?.fullname || "-",
					labelTranslator: RequestOrderTranslation,
				},
				{
					name: "supervisor_name",
					value: requestData?.supervisor_name || "-",
					labelTranslator: RequestOrderTranslation,
				},
				{
					name: "phone",
					value: requestData?.phone || "-",
					labelTranslator: RequestOrderTranslation,
				},
				{
					name: "ap_month",
					value: requestData?.ap_month || "-",
					labelTranslator: RequestOrderTranslation,
					translator: month,
				},
				{
					name: "ap_year",
					value: String(requestData?.ap_year) || "-",
					labelTranslator: RequestOrderTranslation,
				},
				{
					name: "count",
					value: `${requestData?.taskorders?.length || 0} กิจกรรม`,
					labelTranslator: RequestOrderTranslation,
				},
			],
		},
		{
			title: "สถานที่ปฏิบัติงาน",
			fields: [
				{
					name: "quota_number",
					value: requestData?.quota_number || "-",
					labelTranslator: RequestOrderTranslation,
				},
				{
					name: "farmer_name",
					value: requestData?.farmer_name || "-",
					labelTranslator: RequestOrderTranslation,
				},
				{
					name: "land_number",
					value: requestData?.land_number || "-",
					labelTranslator: RequestOrderTranslation,
				},
				{
					name: "operation_area_id",
					value: requestData?.operation_area?.operation_area || "-",
					labelTranslator: RequestOrderTranslation,
				},
				{
					name: "location_xy",
					value: requestData?.location_xy || "-",
					labelTranslator: RequestOrderTranslation,
				},
				{
					name: "target_area",
					unit: "ไร่",
					value: requestData?.target_area || 0,
					labelTranslator: RequestOrderTranslation,
				},
			],
		},
		...(requestData?.taskorders || []).map((task, idx) => ({
			title: `กิจกรรมที่ ${idx + 1}`,
			fields: [
				{
					name: "activities_id",
					value: task.activities?.name || "-",
					labelTranslator: TaskOrderTranslation,
				},
				{
					name: "car_id",
					value: task.cars?.car_number || "-",
					labelTranslator: TaskOrderTranslation,
				},
				{
					name: "tool_types_id",
					value: task.tool_type?.tool_type_name || "-",
					labelTranslator: TaskOrderTranslation,
				},
				{
					name: "user_id",
					value:
						task.users && task.users.username
							? task.users.username.charAt(0).toUpperCase() +
								task.users.username.slice(1).toLowerCase()
							: "-",
					labelTranslator: TaskOrderTranslation,
				},
				{
					name: "target_area",
					unit: "ไร่",
					value: task.target_area ?? 0,
					labelTranslator: TaskOrderTranslation,
				},
				{
					name: "ap_date",
					value: task.ap_date
						? moment(task.ap_date).tz("Asia/Bangkok").format("LL")
						: "-",
					labelTranslator: TaskOrderTranslation,
				},
			],
		})),
	];

	const requestFormSections: FormSection[] = [
		{
			fields: [
				{
					type: "dropdown",
					name: "customer_type_id",
					isReadOnly: true,
					labelTranslator: RequestOrderTranslation,
					options: customerData.map((type) => ({
						label: type.name || "-",
						value: type.id,
					})),
				},
				{
					type: "text",
					name: "created_at",
					isReadOnly: true,
					labelTranslator: RequestOrderTranslation,
				},
				{
					type: "dropdown",
					name: "ae_id",
					isRequired: true,
					labelTranslator: RequestOrderTranslation,
					options: aeData.map((ae) => ({
						label: ae.name || "-",
						value: ae.id,
					})),
				},
				{
					type: "dropdown",
					name: "unit_head_id",
					isRequired: true,
					labelTranslator: RequestOrderTranslation,
					options: unitHeadData.map((user) => ({
						label:
							`${user.username?.charAt(0).toUpperCase()}${user.username?.slice(1).toLowerCase()}` ||
							"-",
						value: user.id,
					})),
				},
				{
					type: "text",
					name: "supervisor_name",
					isRequired: true,
					labelTranslator: RequestOrderTranslation,
				},
				{
					type: "text",
					name: "phone",
					labelTranslator: RequestOrderTranslation,
				},
				{
					type: "dropdown",
					name: "ap_month",
					isRequired: true,
					labelTranslator: RequestOrderTranslation,
					options: getMonthList({}),
				},
				{
					type: "dropdown",
					name: "ap_year",
					isRequired: true,
					labelTranslator: RequestOrderTranslation,
					options: getYearList({}),
				},
				{
					type: "number",
					name: "count",
					path: "_count.taskorders",
					unit: "กิจกรรม",
					isReadOnly: true,
					labelTranslator: RequestOrderTranslation,
				},
			],
		},
		{
			title: "สถานที่ปฏิบัติงาน",
			fields: [
				{
					type: "text",
					name: "quota_number",
					isRequired: true,
					labelTranslator: RequestOrderTranslation,
				},
				{
					type: "text",
					name: "farmer_name",
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
					type: "dropdown",
					name: "operation_area_id",
					path: "operation_area_id",
					isRequired: true,
					labelTranslator: RequestOrderTranslation,
					options: opData.map((area) => ({
						label: area.operation_area || "-",
						value: area.id,
					})),
				},
				{
					type: "text",
					name: "location_xy",
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
			],
		},
	];

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

	return (
		<>
			<div className="flex flex-col justify-center items-center w-full">
				<Tabs
					aria-label="TabOptions"
					className="flex flex-col justify-center items-center pb-4 w-full font-semibold"
					radius="sm"
					selectedKey={selectedTab}
					onSelectionChange={handleTabChange}
				>
					{/* View tab ------------------------------------------------------------------------------------------- */}
					<Tab
						key="view"
						className="flex flex-col justify-center items-center gap-8 w-full"
						title="รายละเอียด"
					>
						<Header
							hasBorder={false}
							subtitle={`@${requestData.work_order_number}`}
							subtitleClassName={clsx(
								"mt-1 font-mono text-gray-600 text-sm",
								fontMono.variable
							)}
							title="รายละเอียดใบสั่งงาน"
						/>

						{requestData.comment && (
							<Alert
								className="items-center w-full max-w-sm sm:max-w-lg md:max-w-2xl lg:max-w-4xl"
								color={
									requestData.status ===
									REQUESTORDERSTATUS.Rejected
										? "danger"
										: "warning"
								}
								description={requestData.comment || "-"}
								endContent={
									requestData.status !==
										REQUESTORDERSTATUS.Rejected && (
										<Button
											className={`flex items-center self-stretch justify-center min-w-0 min-h-full p-0 text-sm font-semibold w-fit transition-all hover:-translate-x-1 ease-out ${isHoveringComment ? "px-4 rounded-xl" : "aspect-square rounded-full"}`}
											color="warning"
											title="mark as done"
											type="button"
											variant="flat"
											onMouseEnter={() =>
												setIsHoveringComment(true)
											}
											onMouseLeave={() =>
												setIsHoveringComment(false)
											}
											onPress={handleClearComment}
										>
											{isHoveringComment ? (
												<span className="whitespace-nowrap">
													แก้ไขแล้ว
												</span>
											) : (
												<CheckIcon />
											)}
										</Button>
									)
								}
								isVisible={true}
								title="หมายเหตุ"
								variant="faded"
							/>
						)}

						<FieldValueDisplayer
							sections={dataSections}
							size="expanded"
						/>

						<FormButtons
							cancelLabel="ยกเลิก"
							hasBorder={false}
							isSubmitDisabled={
								requestData.status !==
									REQUESTORDERSTATUS.Created &&
								requestData.status !==
									REQUESTORDERSTATUS.PendingEdit
							}
							size="expanded"
							submitLabel="ส่งคำขออนุมัติ"
							onCancel={handleCancel}
							onSubmit={() =>
								handleStatus(REQUESTORDERSTATUS.PendingApproval)
							}
						/>
					</Tab>

					{/* Edit tab ------------------------------------------------------------------------------------------- */}
					<Tab
						key="edit"
						className="flex flex-col justify-center items-center gap-8 w-full"
						isDisabled={
							requestData.status ===
								REQUESTORDERSTATUS.Rejected ||
							requestData.status ===
								REQUESTORDERSTATUS.PendingApproval
						}
						title="แก้ไข"
					>
						<FormComponent
							cancelLabel="ยกเลิก"
							isSubmitting={isSubmitting}
							sections={requestFormSections}
							size="expanded"
							submitLabel="บันทึก"
							subtitle={`@${requestData.work_order_number}`}
							subtitleClassName={clsx(
								"mt-1 font-mono text-gray-600 text-sm",
								fontMono.variable
							)}
							title="แก้ไขใบสั่งงาน"
							values={{
								...requestData,
								...requestOrderChanges,
							}}
							onCancel={() => {
								resetChanges();
								handleCancel();
							}}
							onChange={handleValueChange}
							onSubmit={handleSubmit}
						>
							{/* Dynamic Task Orders */}
							<DynamicTaskOrder
								activityData={activityWithToolTypes}
								carData={carData}
								driverData={driverData}
								errors={taskOrderErrors}
								getToolTypeOptions={getToolTypeData}
								taskOrders={taskOrderUIItems}
								onAddTask={addTaskOrder}
								onRemoveTask={removeTaskOrder}
								onUpdateTask={updateTaskOrder}
							/>
						</FormComponent>
					</Tab>

					{/* Reject tab ----------------------------------------------------------------------------------------- */}
					<Tab
						key="reject"
						className="flex flex-col justify-center items-center w-full"
						isDisabled={
							requestData.status ===
								REQUESTORDERSTATUS.Rejected ||
							requestData.status ===
								REQUESTORDERSTATUS.PendingApproval
						}
						title="ยกเลิก"
					>
						<FormComponent
							cancelLabel="ยกเลิก"
							isSubmitting={isSubmitting}
							sections={commentSections}
							size="expanded"
							submitLabel="ส่งความคิดเห็น"
							subtitle={requestData.work_order_number}
							subtitleClassName={clsx(
								"mt-1 font-mono text-gray-600 text-sm",
								fontMono.variable
							)}
							title="ปฏิเสธใบสั่งงาน"
							values={commentValues}
							onCancel={handleCancel}
							onChange={handleCommentChange}
							onSubmit={() =>
								handleStatus(REQUESTORDERSTATUS.Rejected)
							}
						/>
					</Tab>
				</Tabs>
			</div>
		</>
	);
}
