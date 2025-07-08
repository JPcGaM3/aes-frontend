"use client";

import React from "react";
import { use, useState, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

import clsx from "clsx";
import { fontMono } from "@/config/fonts";

import Header from "@/components/Header";
import FormComponent from "@/components/FormComponent";
import FieldValueDisplayer from "@/components/FieldValueDisplayer";
import { Button, Tab, Tabs, user } from "@heroui/react";

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

import { getRequestOrderWithTask } from "@/libs/requestOrderAPI";
import { getOperationAreasUser } from "@/libs/operationAreaAPI";
import { getCustomerTypes } from "@/libs/customerTypeAPI";
import { getAeArea } from "@/libs/aeAreaAPI";
import { getUsers } from "@/libs/userAPI";
import moment from "moment-timezone";
import FormButtons from "@/components/FormButtons";

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

	// Field config ----------------------------------------------------------------------------------------------
	const dataSection: FieldSection[] = [
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

	const formSection: FormSection[] = [
		{
			fields: [
				{
					type: "dropdown",
					name: "customer_type",
					path: "customer_type_id",
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
					name: "ae_name",
					path: "ae_id",
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
					name: "operation_area",
					path: "customer_operation_area_id",
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

	return (
		<div className="flex flex-col items-center justify-center w-full">
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

					<FormButtons
						size="expanded"
						buttonSize="md"
						submitLabel={`หมายเหตุ : ${requestData.comment || "-"}`}
						submitColor="warning"
						isDisabled={true}
					/>

					<FieldValueDisplayer size="expanded" sections={dataSection} />

					<FormButtons
						size="expanded"
						hasBorder={false}
						submitLabel="ยกเลิก"
						submitColor="danger"
						onSubmit={() => {
							setIsLoading(true);
							router.back();
						}}
					/>
				</Tab>

				{/* Edit tab ------------------------------------------------------------------------------------------- */}
				<Tab
					key="edit"
					title="แก้ไข"
					className="flex flex-col items-center justify-center w-full gap-20"
				>
					{/* <FormComponent
						title="แก้ไขใบสั่งงาน"
						subtitle={`@${requestData.work_order_number}`}
						subtitleClassName={clsx(
							"mt-1 text-sm text-gray-600 font-mono",
							fontMono.variable
						)}
						values={requestData}
						sections={formSection}
						onSubmit={() => {}}
					/> */}
				</Tab>

				{/* Reject tab ----------------------------------------------------------------------------------------- */}
				<Tab
					key="reject"
					title="ยกเลิก"
					className="flex flex-col items-center justify-center w-full"
				></Tab>
			</Tabs>
		</div>
	);
}
