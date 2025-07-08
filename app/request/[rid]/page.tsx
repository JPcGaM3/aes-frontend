"use client";

import React from "react";
import { use, useState, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

import clsx from "clsx";
import { fontMono } from "@/config/fonts";

import { Button, Tab, Tabs, user } from "@heroui/react";

import Header from "@/components/Header";
import FieldValueDisplayer from "@/components/FieldValueDisplayer";

import { useLoading } from "@/providers/LoadingContext";
import { useAuth } from "@/providers/AuthContext";

import {
	getRequestOrderWithTask,
	SetStatusRequestOrder,
} from "@/libs/requestOrderAPI";
import {
	FieldSection,
	FormSection,
	OperationAreaResponse,
} from "@/interfaces/interfaces";
import { AeArea, CustomerType, RequestOrder, User } from "@/interfaces/schema";
import {
	month,
	monthList,
	yearMap,
	yearList,
	RequestOrderTranslation,
} from "@/utils/constants";
import FormComponent from "@/components/FormComponent";
import { getOperationAreasUser } from "@/libs/operationAreaAPI";
import { getCustomerTypes } from "@/libs/customerTypeAPI";
import { getAeArea } from "@/libs/aeAreaAPI";
import { getUsers } from "@/libs/userAPI";
import { REQUESTORDERSTATUS } from "@/utils/enum";
import { AlertComponentProps } from "@/interfaces/props";
import AlertComponent from "@/components/AlertComponent";

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
	const [usersData, setUsersData] = useState<User[]>([]);
	const [aeAreasData, setAeAreasData] = useState<AeArea[]>([]);
	const [customerTypesData, setCustomerTypesData] = useState<CustomerType[]>(
		[]
	);
	const [operationAreasData, setOperationAreasData] = useState<
		OperationAreaResponse[]
	>([]);
	const [requestData, setRequestData] = useState<RequestOrder>(
		{} as RequestOrder
	);
	const [formValues, setFormValues] = useState<{
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
		if (rid && userContext.token) {
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
					const ae_area = await getAeArea({ token: token });
					const customer_type = await getCustomerTypes({
						token: token,
					});
					const operation_area = await getOperationAreasUser({
						token: token,
					});
					const request: RequestOrder = await getRequestOrderWithTask({
						token: token,
						requestId: requestId,
					});

					setUsersData(user);
					setAeAreasData(ae_area);
					setCustomerTypesData(customer_type);
					setOperationAreasData(operation_area);
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
	}, [rid, userContext.token]);

	// Handler ---------------------------------------------------------------------------------------------------
	const handleTabChange = (key: React.Key) => {
		if (typeof key === "string") {
			setSelectedTab(key);

			const newSearchParams = new URLSearchParams(searchParams.toString());
			newSearchParams.delete("action");

			const newQuery = newSearchParams.toString();
			router.push(`${pathname}${newQuery ? `?${newQuery}` : ""}`);
		}
	};

	// Field config ----------------------------------------------------------------------------------------------
	const dataSection: FieldSection[] = [
		{
			fields: [
				{
					name: "customer_type",
					value: requestData?.customer_type?.name || "-",
					labelTranslator: RequestOrderTranslation,
				},
				{
					name: "created_at",
					value: requestData?.created_at?.toLocaleString() || "-",
					labelTranslator: RequestOrderTranslation,
				},
				{
					name: "ae_name",
					value: requestData?.ae_area?.name || "-",
					labelTranslator: RequestOrderTranslation,
				},
				{
					name: "users",
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
					name: "operation_area",
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

	const formSection: FormSection[] = [
		{
			fields: [
				{
					type: "dropdown",
					name: "customer_type",
					path: "customer_type_id",
					isReadOnly: true,
					labelTranslator: RequestOrderTranslation,
					options: customerTypesData.map((type) => ({
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
					name: "ae_name",
					path: "ae_id",
					labelTranslator: RequestOrderTranslation,
					options: aeAreasData.map((ae) => ({
						label: ae.name || "-",
						value: ae.id,
					})),
				},
				{
					type: "dropdown",
					name: "unit_head",
					path: "unit_head_id",
					labelTranslator: RequestOrderTranslation,
					options: usersData.map((user) => ({
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
					name: "operation_area",
					path: "customer_operation_area_id",
					labelTranslator: RequestOrderTranslation,
					options: operationAreasData.map((area) => ({
						label: area.operation_area.operation_area || "-",
						value: area.operation_area.id,
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

	const inputFields: FormSection[] = [
		{
			fields: [
				[
					{
						type: "textarea",
						name: "comment",
						label: "กรุณาระบุเหตุผล",
						isRequired: true,
						minRows: 5,
						maxRows: 8,
					},
				],
			],
		},
	];

	const handleSubmit = async (status: REQUESTORDERSTATUS): Promise<any> => {
		if (
			isReady &&
			userContext.id &&
			userContext.token &&
			userContext.role &&
			userContext.operationAreaId &&
			rid
		) {
			setIsLoading(true);
			if (!formValues.comment.trim()) {
				setAlert({
					title: "Alert",
					description: `Detail: กรุณาระบุเหตุผล`,
					color: "warning",
					isVisible: true,
				});
				setIsLoading(false);
				return;
			}
			try {
				const paramData = {
					status: (status as REQUESTORDERSTATUS) || undefined,
					comment: (formValues.comment as string) || undefined,
				};
				await SetStatusRequestOrder({
					token: userContext.token,
					rid: Number(rid),
					paramData: paramData,
				});
				setAlert({
					title: "Success",
					description: `Detail: ${formValues.comment}`,
					color: "success",
					isVisible: true,
				});
				setTimeout(() => {
					router.push(`/request`);
				}, 1000);
			} catch (err: any) {
				setAlert({
					title: "Fail",
					description: err.message || "Unknown error occurred",
					color: "danger",
					isVisible: true,
				});
			} finally {
				setIsLoading(false);
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
				router.push(`/login`);
			}, 1000);
		}
	};

	const handleCancel = () => setFormValues({ comment: "" });

	const handleFormValueChange = (newValues: typeof formValues) => {
		setFormValues(newValues);
	};

	return (
		<div className="flex flex-col justify-center items-center w-full">
			{alert.isVisible && (
				<AlertComponent
					size="compact"
					title={alert.title}
					description={alert.description}
					color={alert.color}
					isVisible={alert.isVisible}
					handleClose={() => setAlert({ ...alert, isVisible: false })}
				/>
			)}
			<Tabs
				aria-label="TabOptions"
				radius="sm"
				selectedKey={selectedTab}
				onSelectionChange={handleTabChange}
				className="flex flex-col justify-center items-center pb-4 w-full font-semibold"
			>
				{/* View tab ------------------------------------------------------------------------------------------- */}
				<Tab
					key="view"
					title="รายละเอียด"
					className="flex flex-col justify-center items-center gap-8 w-full max-w-sm sm:max-w-lg md:max-w-2xl lg:max-w-4xl"
				>
					<Header
						title="ดูรายละเอียดใบสั่งงาน"
						subtitle={`@${requestData.work_order_number}`}
						subtitleClassName={clsx(
							"mt-1 font-mono text-gray-600 text-sm",
							fontMono.variable
						)}
						hasBorder={false}
					/>

					<FieldValueDisplayer sections={dataSection} />

					<Button
						size="lg"
						radius="sm"
						color="danger"
						variant="flat"
						className="w-full font-semibold"
						onPress={() => {
							setIsLoading(true);
							router.push(`/request`);
						}}
					>
						ย้อนกลับ
					</Button>
				</Tab>

				{/* Edit tab ------------------------------------------------------------------------------------------- */}
				<Tab
					key="edit"
					title="แก้ไข"
					className="flex flex-col justify-center items-center gap-20 w-full"
				>
					<FormComponent
						title="แก้ไขใบสั่งงาน"
						subtitle={`@${requestData.work_order_number}`}
						subtitleClassName={clsx(
							"mt-1 font-mono text-gray-600 text-sm",
							fontMono.variable
						)}
						values={requestData}
						sections={formSection}
						onSubmit={() => {}}
					/>
				</Tab>

				{/* Reject tab ----------------------------------------------------------------------------------------- */}
				<Tab
					key="reject"
					title="ยกเลิก"
					className="flex flex-col justify-center items-center w-full"
				>
					<Header
						title="สาเหตุการปฏิเสธงาน"
						subtitle={requestData.work_order_number}
						subtitleClassName={clsx(
							"mt-1 font-mono text-gray-600 text-sm",
							fontMono.variable
						)}
						hasBorder={false}
					/>
					<FormComponent
						isCompact={true}
						sections={inputFields}
						submitLabel="ส่งความคิดเห็น"
						cancelLabel="ยกเลิก"
						onSubmit={() => {
							handleSubmit(REQUESTORDERSTATUS.Rejected);
						}}
						onCancel={handleCancel}
						values={formValues}
						onChange={handleFormValueChange}
					/>
				</Tab>
			</Tabs>
		</div>
	);
}
