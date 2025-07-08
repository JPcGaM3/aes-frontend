"use client";

import React, { useEffect } from "react";
import { use, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

import clsx from "clsx";
import { fontMono } from "@/config/fonts";

import { Button, Tab, Tabs } from "@heroui/react";

import Header from "@/components/Header";
import { useLoading } from "@/providers/LoadingContext";
import { FieldSection, FormSection } from "@/interfaces/interfaces";
import { RequestOrder } from "@/interfaces/schema";
import { useAuth } from "@/providers/AuthContext";
import {
	getRequestOrderWithTask,
	SetStatusRequestOrder,
} from "@/libs/requestOrderAPI";
import FormComponent from "@/components/FormComponent";
import { REQUESTORDERSTATUS } from "@/utils/enum";
import { AlertComponentProps } from "@/interfaces/props";
import AlertComponent from "@/components/AlertComponent";
import { RequestOrderTranslation, month, yearMap } from "@/utils/constants";
import FieldValueDisplayer from "@/components/FieldValueDisplayer";
import moment from "moment-timezone";

moment.locale("th");

export default function RequestManagementPage({
	params,
}: {
	params: Promise<{ rid: string }>;
}) {
	const { rid } = use(params);
	const { setIsLoading } = useLoading();
	const { userContext, isReady } = useAuth();

	const searchParams = useSearchParams();
	const router = useRouter();
	const pathname = usePathname();
	const action = searchParams.get("action") || "view";

	const [selectedTab, setSelectedTab] = useState(action);
	const [requestData, setRequestData] = useState<RequestOrder>(
		{} as RequestOrder
	);
	const [alert, setAlert] = useState<AlertComponentProps>({
		title: "",
		description: "",
		isVisible: false,
	});
	const [commentValues, setCommentValues] = useState<{
		comment: string;
	}>({
		comment: "",
	});

	const fetchRequestWithTask = async ({
		token,
		requestId,
	}: {
		token: string;
		requestId: number;
	}) => {
		try {
			const request: RequestOrder = await getRequestOrderWithTask({
				token: token,
				requestId: requestId,
			});
			setRequestData({
				...request,
				work_order_number: `${request.ae_area?.name}${request.operation_area?.operation_area}${request.ap_year ? Number(request.created_at?.toLocaleString().slice(0, 4)) + 543 : ""}/${request.run_number || ""}`,
			});
		} catch (error) {
			console.error("Failed to fetch request with task:", error);
		}
	};

	useEffect(() => {
		setIsLoading(true);
		if (
			isReady &&
			userContext.id &&
			userContext.token &&
			userContext.role &&
			userContext.operationAreaId &&
			rid
		) {
			const fetchData = async (): Promise<any> => {
				try {
					setRequestData({} as RequestOrder);
					await fetchRequestWithTask({
						token: userContext.token,
						requestId: Number(rid),
					});
				} catch (error) {
					console.error("Failed to fetch:", error);
				} finally {
					setIsLoading(false);
				}
			};

			fetchData();
		}
	}, [userContext, isReady, rid]);

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
					value: requestData?.created_at
						? moment(requestData.created_at).tz("Asia/Bangkok").format("LLL")
						: "-",
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

	const commentSections: FormSection[] = [
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

	const handleTabChange = (key: React.Key) => {
		if (typeof key === "string") {
			setSelectedTab(key);

			const newSearchParams = new URLSearchParams(searchParams.toString());
			newSearchParams.delete("action");

			const newQuery = newSearchParams.toString();
			router.push(`${pathname}${newQuery ? `?${newQuery}` : ""}`);
		}
	};

	const handleCommentValueChange = (newValues: typeof commentValues) => {
		setCommentValues(newValues);
	};

	const handleCancel = () => {
		setCommentValues({ comment: "" });
		router.back();
	};

	const handleComment = async (status: REQUESTORDERSTATUS): Promise<any> => {
		if (
			isReady &&
			userContext.id &&
			userContext.token &&
			userContext.role &&
			userContext.operationAreaId &&
			rid
		) {
			setIsLoading(true);
			if (!commentValues.comment.trim()) {
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
					comment: (commentValues.comment as string) || undefined,
				};
				await SetStatusRequestOrder({
					token: userContext.token,
					rid: Number(rid),
					paramData: paramData,
				});
				setAlert({
					title: "Success",
					description: `Detail: ${commentValues.comment}`,
					color: "success",
					isVisible: true,
				});
				setTimeout(() => {
					router.push(`/list`);
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
				className="flex flex-col justify-center items-center p-0 w-full font-semibold"
			>
				{/* View tab ------------------------------------------------------------------------------------------- */}
				<Tab
					key="view"
					title="รายละเอียด"
					className="flex flex-col justify-center items-center gap-8 w-full"
				>
					<Header
						title="ดูรายละเอียดใบสั่งงาน"
						subtitle={requestData.work_order_number}
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
						className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl font-semibold"
						onPress={() => {
							setIsLoading(true);
							router.push(`/list`);
						}}
					>
						ย้อนกลับ
					</Button>
				</Tab>

				{/* Edit tab ----------------------------------------------------------------------------------------- */}
				<Tab
					key="edit"
					title="แก้ไข"
					className="flex flex-col justify-center items-center w-full"
				>
					<Header
						title="แก้รายละเอียดใบสั่งงาน"
						subtitle={requestData.work_order_number}
						subtitleClassName={clsx(
							"mt-1 font-mono text-gray-600 text-sm",
							fontMono.variable
						)}
						hasBorder={false}
					/>
					<FormComponent
						isCompact={true}
						sections={commentSections}
						submitLabel="ส่งความคิดเห็น"
						cancelLabel="ยกเลิก"
						onSubmit={() => {
							handleComment(REQUESTORDERSTATUS.PendingEdit);
						}}
						onCancel={handleCancel}
						values={commentValues}
						onChange={handleCommentValueChange}
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
						sections={commentSections}
						submitLabel="ส่งความคิดเห็น"
						cancelLabel="ยกเลิก"
						onSubmit={() => {
							handleComment(REQUESTORDERSTATUS.Rejected);
						}}
						onCancel={handleCancel}
						values={commentValues}
						onChange={handleCommentValueChange}
					/>
				</Tab>
			</Tabs>
		</div>
	);
}
function setAlert(arg0: {
	title: string;
	description: any;
	color: string;
	isVisible: boolean;
}) {
	throw new Error("Function not implemented.");
}
