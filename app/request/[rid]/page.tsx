"use client";

import React from "react";
import { use, useState, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import clsx from "clsx";
import { Alert, Tab, Tabs } from "@heroui/react";
import moment from "moment-timezone";

import { fontMono } from "@/config/fonts";
import Header from "@/components/Header";
import FormButtons from "@/components/FormButtons";
import FormComponent from "@/components/FormComponent";
import FieldValueDisplayer from "@/components/FieldValueDisplayer";
import { useLoading } from "@/providers/LoadingContext";
import { useAuth } from "@/providers/AuthContext";
import { FieldSection, FormSection } from "@/interfaces/interfaces";
import {
	Activity,
	AeArea,
	Car,
	CustomerType,
	OperationArea,
	RequestOrder,
	TaskOrder,
	User,
} from "@/interfaces/schema";
import {
	month,
	monthList,
	yearMap,
	yearList,
	RequestOrderTranslation,
	TaskOrderTranslation,
} from "@/utils/constants";
import {
	getRequestOrderWithTask,
	SetStatusRequestOrder,
} from "@/libs/requestOrderAPI";
import { getOperationAreas } from "@/libs/operationAreaAPI";
import { getCustomerTypes } from "@/libs/customerTypeAPI";
import { getAeAreaAll } from "@/libs/aeAreaAPI";
import { getUsers } from "@/libs/userAPI";
import { REQUESTORDERSTATUS, USERROLE } from "@/utils/enum";
import { AlertComponentProps } from "@/interfaces/props";
import AlertComponent from "@/components/AlertComponent";
import { getActivities } from "@/libs/activityAPI";
import { getCars } from "@/libs/carAPI";

moment.locale("th");

export default function RequestManagementPage({
	params,
}: {
	params: Promise<{ rid: number }>;
}) {
	// const and hooks -------------------------------------------------------------------------------------------
	const { rid } = use(params);
	const { userContext, isReady } = useAuth();
	const { setIsLoading } = useLoading();

	const searchParams = useSearchParams();
	const router = useRouter();
	const pathname = usePathname();
	const action = searchParams.get("action") || "view";

	const [tasks, setTasks] = useState<TaskOrder[]>([]);
	const [selectedTab, setSelectedTab] = useState(action);
	const [carData, setCarData] = useState<Car[]>([]);
	const [aeData, setAeData] = useState<AeArea[]>([]);
	const [actData, setActData] = useState<Activity[]>([]);
	const [driverData, setDriverData] = useState<User[]>([]);
	const [opData, setOpData] = useState<OperationArea[]>([]);
	const [unitHeadData, setUnitHeadData] = useState<User[]>([]);
	const [customerData, setCustomerData] = useState<CustomerType[]>([]);
	const [activityWithTools, setActivityWithTools] = useState<Activity[]>([]);
	const [requestData, setRequestData] = useState<RequestOrder>(
		{} as RequestOrder
	);

	const [isSubmitting, setIsSubmitting] = useState(false);
	const [commentValues, setCommentValues] = useState<{
		comment: string;
	}>({
		comment: "",
	});
	const [alert, setAlert] = useState<AlertComponentProps>({
		title: "",
		description: "",
		isVisible: false,
	});

	// Fetch data ------------------------------------------------------------------------------------------------
	useEffect(() => {
		if (
			rid &&
			isReady &&
			userContext &&
			userContext.id &&
			userContext.token &&
			userContext.ae_id
		) {
			const fetchData = async ({
				token,
				requestId,
			}: {
				token: string;
				requestId: number;
			}) => {
				setIsLoading(true);

				try {
					const car = await getCars({ token });
					const ae_area = await getAeAreaAll({ token });
					const activity = await getActivities({ token });
					const customer_type = await getCustomerTypes({ token });
					const operation_area = await getOperationAreas({ token });
					const driver = await getUsers({
						token: token,
						params: { role: USERROLE.Driver },
					});
					const unit_head = await getUsers({
						token: token,
						params: { role: USERROLE.UnitHead },
					});
					const request: RequestOrder = await getRequestOrderWithTask({
						token: token,
						requestId: requestId,
					});

					setCarData(car);
					setAeData(ae_area);
					setActData(activity);
					setDriverData(driver);
					setOpData(operation_area);
					setUnitHeadData(unit_head);
					setActivityWithTools(activity);
					setCustomerData(customer_type);
					setTasks(request.taskorders || []);

					setRequestData({
						...request,
						work_order_number: `${request.ae_area?.name}${request.operation_area?.operation_area}${request.ap_year ? Number(request.created_at?.toLocaleString().slice(0, 4)) + 543 : ""}/${request.run_number || ""}`,
					});
				} catch (error: any) {
					setAlert({
						title: "Failed to fetch",
						description: error.message || "Unknown error occurred",
						color: "danger",
						isVisible: true,
					});
				} finally {
					setIsLoading(false);
				}
			};

			fetchData({
				token: userContext.token,
				requestId: rid,
			});
		}
	}, [userContext, isReady, rid]);

	// Handler ---------------------------------------------------------------------------------------------------
	const handleTabChange = (key: React.Key) => {
		if (typeof key === "string") {
			setSelectedTab(key);

			const newSearchParams = new URLSearchParams(searchParams.toString());

			newSearchParams.set("action", key);

			const newQuery = newSearchParams.toString();

			router.replace(`${pathname}${newQuery ? `?${newQuery}` : ""}`);
		}
	};

	const handleCancel = () => {
		setIsLoading(true);
		setCommentValues({ comment: "" });
		router.back();
	};

	const handleStatus = async (status: REQUESTORDERSTATUS): Promise<any> => {
		if (
			rid ||
			isReady ||
			userContext.id ||
			userContext.role ||
			userContext.token ||
			userContext.ae_id
		) {
			setIsSubmitting(true);

			if (
				!commentValues.comment.trim() &&
				status !== REQUESTORDERSTATUS.PendingApproval
			) {
				setAlert({
					title: "Warning!!",
					description: "คำอธิบาย: กรุณาระบุเหตุผล",
					color: "warning",
					isVisible: true,
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

				setAlert({
					title: "ยกเลิกใบสั่งงานสำเร็จ",
					description: `ยกเลิกใบสั่งงานเลขที่ ${requestData.work_order_number} แล้ว`,
					color: "success",
					isVisible: true,
				});

				setTimeout(() => {
					router.back();
				}, 2000);
			} catch (err: any) {
				setAlert({
					title: "ยกเลิกใบสั่งงานไม่สำเร็จ",
					description: err.message || "Unknown error occurred",
					color: "danger",
					isVisible: true,
				});
			} finally {
				setIsSubmitting(false);
			}
		} else {
			setAlert({
				title: "ไม่สามารถโหลดข้อมูลผู้ใช้งานได้",
				description: "กรุณาเข้าสู่ระบบและลองอีกครั้ง",
				color: "danger",
				isVisible: true,
			});

			setTimeout(() => {
				setIsLoading(false);
				router.push("/login");
			}, 2000);
		}
	};

	const handleCommentChange = (newValues: typeof commentValues) => {
		setCommentValues(newValues);
	};

	const getToolTypeData = (activity_id: number) => {
		const activity = activityWithTools.find((a) => a.id === activity_id);

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
						? moment(requestData.created_at).tz("Asia/Bangkok").format("LLL")
						: "-",
					labelTranslator: RequestOrderTranslation,
				},
				{
					name: "ae_id",
					value: requestData?.ae_area?.name || "-",
					labelTranslator: RequestOrderTranslation,
				},
				{
					name: "unit_head",
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
					translator: yearMap,
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
					value: requestData?.target_area || "-",
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
					value: task.cars?.name || "-",
					labelTranslator: TaskOrderTranslation,
				},
				{
					name: "tool_type_id",
					value: task.tool_type?.tool_type_name || "-",
					labelTranslator: TaskOrderTranslation,
				},
				{
					name: "tool_id",
					value: task.tools?.name || "-",
					labelTranslator: TaskOrderTranslation,
				},
				{
					name: "user_id",
					value: task.users?.username || "-",
					labelTranslator: TaskOrderTranslation,
				},
				{
					name: "target_area",
					value: task.target_area ?? "-",
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
					labelTranslator: RequestOrderTranslation,
					options: aeData.map((ae) => ({
						label: ae.name || "-",
						value: ae.id,
					})),
				},
				{
					type: "dropdown",
					name: "unit_head",
					path: "unit_head_id",
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
					labelTranslator: RequestOrderTranslation,
					options: monthList,
				},
				{
					type: "dropdown",
					name: "ap_year",
					labelTranslator: RequestOrderTranslation,
					options: yearList,
				},
				{
					type: "text",
					name: "count",
					path: "_count.taskorders",
					isReadOnly: true,
					labelTranslator: RequestOrderTranslation,
				},
			],
		},
		{
			title: "สถานที่ปฏิบัติงาน",
			fields: [
				{
					type: "number",
					name: "quota_number",
					labelTranslator: RequestOrderTranslation,
				},
				{
					type: "text",
					name: "farmer_name",
					labelTranslator: RequestOrderTranslation,
				},
				{
					type: "number",
					name: "land_number",
					labelTranslator: RequestOrderTranslation,
				},
				{
					type: "dropdown",
					name: "operation_area_id",
					path: "operation_area_id",
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
					labelTranslator: RequestOrderTranslation,
				},
			],
		},
		...tasks.map(
			(task, idx): FormSection => ({
				title: `กิจกรรมที่ ${idx + 1}`,
				fields: [
					{
						type: "dropdown",
						name: `activities_id_${idx}`,
						path: `taskorders.${idx}.activities_id`,
						label: "activities_id",
						labelTranslator: TaskOrderTranslation,
						options: actData.map((activity) => ({
							label: activity.name,
							value: activity.id,
						})),
					},
					{
						type: "dropdown",
						name: `car_id_${idx}`,
						path: `taskorders.${idx}.car_id`,
						label: "car_id",
						labelTranslator: TaskOrderTranslation,
						options: carData.map((car) => ({
							label: car.name || car.car_number || car.id.toString(),
							value: car.id,
						})),
					},
					{
						type: "dropdown",
						name: `tool_type_id_${idx}`,
						path: `taskorders.${idx}.tool_types_id`,
						label: "tool_type_id",
						labelTranslator: TaskOrderTranslation,
						options: getToolTypeData(task.activities_id || 0),
						isReadOnly: !task.activities_id,
					},
					{
						type: "dropdown",
						name: "user_id",
						path: `taskorders.${idx}.user_id`,
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
						path: `taskorders.${idx}.target_area`,
						labelTranslator: TaskOrderTranslation,
					},
				],
			})
		),
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
		<div className="flex flex-col items-center justify-center w-full">
			{alert.isVisible && (
				<AlertComponent
					{...alert}
					handleClose={() => setAlert({ ...alert, isVisible: false })}
					size="expanded"
				/>
			)}

			<Tabs
				aria-label="TabData"
				className="flex flex-col items-center justify-center w-full pb-4 font-semibold"
				radius="sm"
				selectedKey={selectedTab}
				onSelectionChange={handleTabChange}
			>
				{/* View tab ------------------------------------------------------------------------------------------- */}
				<Tab
					key="view"
					className="flex flex-col items-center justify-center w-full gap-8"
					title="รายละเอียด"
				>
					<Header
						hasBorder={false}
						subtitle={`@${requestData.work_order_number}`}
						subtitleClassName={clsx(
							"mt-1 text-sm text-gray-600 font-mono",
							fontMono.variable
						)}
						title="ดูรายละเอียดใบสั่งงาน"
					/>

					{requestData.comment && (
						<Alert
							className="w-full max-w-sm sm:max-w-lg md:max-w-2xl lg:max-w-4xl"
							color={
								requestData.status === REQUESTORDERSTATUS.Rejected
									? "danger"
									: "warning"
							}
							description={requestData.comment || "-"}
							isVisible={true}
							title="หมายเหตุ"
							variant="faded"
						/>
					)}

					<FieldValueDisplayer sections={dataSections} size="expanded" />

					<FormButtons
						cancelLabel="ยกเลิก"
						hasBorder={false}
						isSubmitDisabled={
							requestData.status === REQUESTORDERSTATUS.PendingApproval
						}
						isSubmitting={isSubmitting}
						size="expanded"
						submitLabel="ส่งคำขออนุมัติ"
						onCancel={handleCancel}
						onSubmit={() => handleStatus(REQUESTORDERSTATUS.PendingApproval)}
					/>
				</Tab>

				{/* Edit tab ------------------------------------------------------------------------------------------- */}
				<Tab
					key="edit"
					className="flex flex-col items-center justify-center w-full gap-20"
					title="แก้ไข"
				>
					<FormComponent
						cancelLabel="ยกเลิก"
						hasBorder={false}
						isSubmitting={isSubmitting}
						sections={requestFormSections}
						size="expanded"
						submitLabel="บันทึก"
						subtitle={`@${requestData.work_order_number}`}
						subtitleClassName={clsx(
							"mt-1 text-sm text-gray-600 font-mono",
							fontMono.variable
						)}
						title="แก้ไขใบสั่งงาน"
						values={requestData}
						onCancel={handleCancel}
						onSubmit={() => {}}
					/>
				</Tab>

				{/* Reject tab ----------------------------------------------------------------------------------------- */}
				<Tab
					key="reject"
					className="flex flex-col items-center justify-center w-full"
					title="ยกเลิก"
				>
					<FormComponent
						cancelLabel="ยกเลิก"
						sections={commentSections}
						size="expanded"
						submitLabel="ส่งความคิดเห็น"
						subtitle={requestData.work_order_number}
						subtitleClassName={clsx(
							"mt-1 font-mono text-gray-600 text-sm",
							fontMono.variable
						)}
						title="สาเหตุการปฏิเสธงาน"
						values={commentValues}
						onCancel={handleCancel}
						onChange={handleCommentChange}
						onSubmit={() => handleStatus(REQUESTORDERSTATUS.Rejected)}
					/>
				</Tab>
			</Tabs>
		</div>
	);
}
