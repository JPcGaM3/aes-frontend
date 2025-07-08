"use client";

import React from "react";
import { use, useState, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

import clsx from "clsx";
import { fontMono } from "@/config/fonts";

import Header from "@/components/Header";
import FormButtons from "@/components/FormButtons";
import FormComponent from "@/components/FormComponent";
import FieldValueDisplayer from "@/components/FieldValueDisplayer";
import { Alert, Tab, Tabs } from "@heroui/react";

import { useLoading } from "@/providers/LoadingContext";
import { useAuth } from "@/providers/AuthContext";

import { FieldSection, FormSection } from "@/interfaces/interfaces";
import {
	AeArea,
	CustomerType,
	OperationArea,
	RequestOrder,
	User,
} from "@/interfaces/schema";
import {
	month,
	monthList,
	yearMap,
	yearList,
	RequestOrderTranslation,
} from "@/utils/constants";

import {
	getRequestOrderWithTask,
	SetStatusRequestOrder,
} from "@/libs/requestOrderAPI";
import { getOperationAreas } from "@/libs/operationAreaAPI";
import { getCustomerTypes } from "@/libs/customerTypeAPI";
import { getAeAreaAll } from "@/libs/aeAreaAPI";
import { getUsers } from "@/libs/userAPI";
import moment from "moment-timezone";
import { REQUESTORDERSTATUS } from "@/utils/enum";
import { AlertComponentProps } from "@/interfaces/props";
import AlertComponent from "@/components/AlertComponent";

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

	const [selectedTab, setSelectedTab] = useState(action);
	const [usersOptions, setUsersOptions] = useState<User[]>([]);
	const [aeOptions, setAeOptions] = useState<AeArea[]>([]);
	const [customerOptions, setCustomerOptions] = useState<CustomerType[]>([]);
	const [opOption, setOpOption] = useState<OperationArea[]>([]);
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
					const user = await getUsers({
						token: token,
					});
					const ae_area = await getAeAreaAll({
						token: token,
					});
					const customer_type = await getCustomerTypes({
						token: token,
					});
					const operation_area = await getOperationAreas({
						token: token,
					});
					const request: RequestOrder = await getRequestOrderWithTask({
						token: token,
						requestId: requestId,
					});

					console.log("User Options:", user);
					console.log("AE Area Options:", ae_area);
					console.log("Customer Type Options:", customer_type);
					console.log("Operation Area Options:", operation_area);

					console.log("Request Data:", request);

					setUsersOptions(user);
					setAeOptions(ae_area);
					setCustomerOptions(customer_type);
					setOpOption(operation_area);
					setRequestData({
						...request,
						work_order_number: `${request.ae_area?.name}${request.operation_area?.operation_area}${request.ap_year ? Number(request.created_at?.toLocaleString().slice(0, 4)) + 543 : ""}/${request.run_number || ""}`,
					});
				} catch (error) {
					console.error("Error fetching data:", error);
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
			newSearchParams.set("action", key); // set action to the selected tab

			const newQuery = newSearchParams.toString();
			router.replace(`${pathname}${newQuery ? `?${newQuery}` : ""}`); // use replace instead of push
		}
	};

	const handleCancel = () => {
		setIsLoading(true);
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
				title: "Failed to load user profile",
				description: "Please login and try again.",
				color: "danger",
				isVisible: true,
			});

			setTimeout(() => {
				setIsLoading(false);
				router.push("/login");
			}, 1000);
		}
	};

	const handleCommentChange = (newValues: typeof commentValues) => {
		setCommentValues(newValues);
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
		{
			title: "กิจกรรมและเครื่องมือ",
			fields: [
				{
					name: "count",
					value: `${requestData?.taskorders?.length || 0} กิจกรรม`,
					labelTranslator: RequestOrderTranslation,
				},
			],
		},
	];

	const formSections: FormSection[] = [
		{
			fields: [
				{
					type: "dropdown",
					name: "customer_type_id",
					isReadOnly: true,
					labelTranslator: RequestOrderTranslation,
					options: customerOptions.map((type) => ({
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
					options: aeOptions.map((ae) => ({
						label: ae.name || "-",
						value: ae.id,
					})),
				},
				{
					type: "dropdown",
					name: "unit_head",
					path: "unit_head_id",
					labelTranslator: RequestOrderTranslation,
					options: usersOptions.map((user) => ({
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
				[
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
				],
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
					options: opOption.map((area) => ({
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
		{
			title: "กิจกรรมและเครื่องมือ",
			fields: [
				[
					{
						type: "text",
						name: "count",
						path: "_count.taskorders",
						isReadOnly: true,
						labelTranslator: RequestOrderTranslation,
					},
				],
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
		<div className="flex flex-col items-center justify-center w-full">
			{alert.isVisible && (
				<AlertComponent
					{...alert}
					size="expanded"
					handleClose={() => setAlert({ ...alert, isVisible: false })}
				/>
			)}

			<Tabs
				aria-label="TabOptions"
				radius="sm"
				selectedKey={selectedTab}
				onSelectionChange={handleTabChange}
				className="flex flex-col items-center justify-center w-full pb-4 font-semibold"
			>
				{/* View tab ------------------------------------------------------------------------------------------- */}
				<Tab
					key="view"
					title="รายละเอียด"
					className="flex flex-col items-center justify-center w-full gap-8"
				>
					<Header
						title="ดูรายละเอียดใบสั่งงาน"
						subtitle={`@${requestData.work_order_number}`}
						subtitleClassName={clsx(
							"mt-1 text-sm text-gray-600 font-mono",
							fontMono.variable
						)}
						hasBorder={false}
					/>

					{requestData.comment && (
						<Alert
							title="หมายเหตุ"
							description={requestData.comment || "-"}
							isVisible={true}
							variant="faded"
							className="w-full max-w-sm sm:max-w-lg md:max-w-2xl lg:max-w-4xl"
							color={
								requestData.status === REQUESTORDERSTATUS.Rejected
									? "danger"
									: "warning"
							}
						/>
					)}

					<FieldValueDisplayer size="expanded" sections={dataSections} />

					<FormButtons
						size="expanded"
						hasBorder={false}
						cancelLabel="ยกเลิก"
						submitLabel="ส่งคำขออนุมัติ"
						isSubmitting={isSubmitting}
						onCancel={handleCancel}
						onSubmit={() => handleStatus(REQUESTORDERSTATUS.PendingApproval)}
						isSubmitDisabled={
							requestData.status === REQUESTORDERSTATUS.PendingApproval
						}
					/>
				</Tab>

				{/* Edit tab ------------------------------------------------------------------------------------------- */}
				<Tab
					key="edit"
					title="แก้ไข"
					className="flex flex-col items-center justify-center w-full gap-20"
				>
					<FormComponent
						title="แก้ไขใบสั่งงาน"
						subtitle={`@${requestData.work_order_number}`}
						subtitleClassName={clsx(
							"mt-1 text-sm text-gray-600 font-mono",
							fontMono.variable
						)}
						size="expanded"
						hasBorder={false}
						values={requestData}
						sections={formSections}
						cancelLabel="ยกเลิก"
						submitLabel="บันทึก"
						isSubmitting={isSubmitting}
						onCancel={handleCancel}
						onSubmit={() => {}}
					/>
				</Tab>

				{/* Reject tab ----------------------------------------------------------------------------------------- */}
				<Tab
					key="reject"
					title="ยกเลิก"
					className="flex flex-col items-center justify-center w-full"
				>
					<FormComponent
						title="สาเหตุการปฏิเสธงาน"
						subtitle={requestData.work_order_number}
						subtitleClassName={clsx(
							"mt-1 font-mono text-gray-600 text-sm",
							fontMono.variable
						)}
						size="expanded"
						sections={commentSections}
						submitLabel="ส่งความคิดเห็น"
						cancelLabel="ยกเลิก"
						onSubmit={() => handleStatus(REQUESTORDERSTATUS.Rejected)}
						onCancel={handleCancel}
						values={commentValues}
						onChange={handleCommentChange}
					/>
				</Tab>
			</Tabs>
		</div>
	);
}
