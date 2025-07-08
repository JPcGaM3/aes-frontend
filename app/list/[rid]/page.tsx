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
import FormButtons from "@/components/FormButtons";

moment.locale("th");

export default function RequestManagementPage({
	params,
}: {
	params: Promise<{ rid: number }>;
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
					const request: RequestOrder = await getRequestOrderWithTask({
						token: token,
						requestId: requestId,
					});

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

	const handleCommentChange = (newValues: typeof commentValues) => {
		setCommentValues(newValues);
	};

	const handleCancel = () => {
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
					title: "อัพเดตสถานะใบสั่งงานสำเร็จ",
					description: `อัพเดตสถานะใบสั่งงานเลขที่ ${requestData.work_order_number} แล้ว`,
					color: "success",
					isVisible: true,
				});

				setTimeout(() => {
					router.back();
				}, 2000);
			} catch (err: any) {
				setAlert({
					title: "อัพเดตสถานะใบสั่งงานไม่สำเร็จ",
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
				className="flex flex-col items-center justify-center w-full p-0 pb-4 font-semibold"
			>
				{/* View tab ------------------------------------------------------------------------------------------- */}
				<Tab
					key="view"
					title="รายละเอียด"
					className="flex flex-col items-center justify-center w-full gap-8"
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

					<FieldValueDisplayer size="expanded" sections={dataSections} />

					<FormButtons
						size="expanded"
						hasBorder={false}
						submitLabel="ยกเลิก"
						submitColor="default"
						onSubmit={handleCancel}
					/>
				</Tab>

				{/* Edit tab ----------------------------------------------------------------------------------------- */}
				<Tab
					key="edit"
					title="แก้ไข"
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
						onSubmit={() => handleStatus(REQUESTORDERSTATUS.PendingEdit)}
						onCancel={handleCancel}
						values={commentValues}
						onChange={handleCommentChange}
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
