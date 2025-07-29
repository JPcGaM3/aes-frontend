"use client";

import React, { useEffect, useRef } from "react";
import { use, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import clsx from "clsx";
import { Tab, Tabs } from "@heroui/react";
import moment from "moment-timezone";
import "moment/locale/th";

import { fontMono } from "@/config/fonts";
import Header from "@/components/Header";
import { useLoading } from "@/providers/LoadingContext";
import { FieldSection, FormSection } from "@/interfaces/interfaces";
import { RequestOrder } from "@/interfaces/schema";
import { useAuth } from "@/providers/AuthContext";
import { SetStatusRequestOrder } from "@/libs/requestOrderAPI";
import FormComponent from "@/components/FormComponent";
import { REQUESTORDERSTATUS } from "@/utils/enum";
import {
	RequestOrderTranslation,
	TaskOrderTranslation,
	month,
} from "@/utils/constants";
import FieldValueDisplayer from "@/components/FieldValueDisplayer";
import FormButtons from "@/components/FormButtons";
import { fetchReqOrderWithTaskData } from "@/utils/functions";
import { useAlert } from "@/providers/AlertContext";

moment.locale("th");

export default function RequestManagementPage({
	params,
}: {
	params: Promise<{ rid: number }>;
}) {
	const { rid } = use(params);
	const { showLoading, hideLoading } = useLoading();
	const { userContext, isReady } = useAuth();
	const { showAlert } = useAlert();

	const searchParams = useSearchParams();
	const router = useRouter();
	const pathname = usePathname();
	const action = searchParams.get("action") || "view";

	const hasFetched = useRef(false);
	const [selectedTab, setSelectedTab] = useState(action);
	const [reqOrder, setReqOrder] = useState<RequestOrder>({} as RequestOrder);

	const [isSubmitting, setIsSubmitting] = useState(false);
	const [commentValues, setCommentValues] = useState<{
		comment: string;
	}>({
		comment: "",
	});

	// Fetch data ------------------------------------------------------------------------------------------------
	useEffect(() => {
		if (rid && isReady && !hasFetched.current) {
			showLoading();
			hasFetched.current = true;
			const fetchData = async () => {
				try {
					const promises = [
						fetchReqOrderWithTaskData({
							token: userContext.token,
							requestId: rid,
							setReqOrder,
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
	}, [isReady, rid]);

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

	const handleCommentChange = (newValues: typeof commentValues) => {
		setCommentValues(newValues);
	};

	const handleCancel = () => {
		showLoading();
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
				status !== REQUESTORDERSTATUS.Pending
			) {
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
					status: (status as REQUESTORDERSTATUS) || undefined,
					comment: (commentValues.comment as string) || undefined,
				};

				await SetStatusRequestOrder({
					token: userContext.token,
					rid: Number(rid),
					paramData: paramData,
				});

				showAlert({
					title: "อัพเดตสถานะใบสั่งงานสำเร็จ",
					description: `อัพเดตสถานะใบสั่งงานเลขที่ ${reqOrder.work_order_number} แล้ว`,
					color: "success",
				});

				setTimeout(() => {
					router.back();
				}, 2000);
			} catch (error: any) {
				showAlert({
					title: "อัพเดตสถานะใบสั่งงานไม่สำเร็จ",
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

	// Field config ----------------------------------------------------------------------------------------------
	const dataSections: FieldSection[] = [
		{
			fields: [
				{
					name: "customer_type_id",
					value: reqOrder?.customer_type?.name || "-",
					labelTranslator: RequestOrderTranslation,
				},
				{
					name: "created_at",
					value: reqOrder?.created_at
						? moment(reqOrder.created_at)
								.tz("Asia/Bangkok")
								.format("LLL")
						: "-",
					labelTranslator: RequestOrderTranslation,
				},
				{
					name: "ae_id",
					value: reqOrder?.ae_area?.name || "-",
					labelTranslator: RequestOrderTranslation,
				},
				{
					name: "unit_head_id",
					value: reqOrder?.users?.fullname || "-",
					labelTranslator: RequestOrderTranslation,
				},
				{
					name: "supervisor_name",
					value: reqOrder?.supervisor_name || "-",
					labelTranslator: RequestOrderTranslation,
				},
				{
					name: "phone",
					value: reqOrder?.phone || "-",
					labelTranslator: RequestOrderTranslation,
				},
				{
					name: "ap_month",
					value: reqOrder?.ap_month || "-",
					labelTranslator: RequestOrderTranslation,
					translator: month,
				},
				{
					name: "ap_year",
					value: String(reqOrder?.ap_year) || "-",
					labelTranslator: RequestOrderTranslation,
				},
				{
					name: "count",
					value: `${reqOrder?.taskorders?.length || 0} กิจกรรม`,
					labelTranslator: RequestOrderTranslation,
				},
			],
		},
		{
			title: "สถานที่ปฏิบัติงาน",
			fields: [
				{
					name: "quota_number",
					value: reqOrder?.quota_number || "-",
					labelTranslator: RequestOrderTranslation,
				},
				{
					name: "farmer_name",
					value: reqOrder?.farmer_name || "-",
					labelTranslator: RequestOrderTranslation,
				},
				{
					name: "land_number",
					value: reqOrder?.land_number || "-",
					labelTranslator: RequestOrderTranslation,
				},
				{
					name: "operation_area_id",
					value: reqOrder?.operation_area?.operation_area || "-",
					labelTranslator: RequestOrderTranslation,
				},
				{
					name: "location_xy",
					value: reqOrder?.location_xy || "-",
					labelTranslator: RequestOrderTranslation,
				},
				{
					name: "target_area",
					unit: "ไร่",
					value: reqOrder?.target_area || 0,
					labelTranslator: RequestOrderTranslation,
				},
			],
		},
		...(reqOrder?.taskorders || []).map((task, idx) => ({
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
					unit: "ไร่",
					value: task.target_area || 0,
					labelTranslator: TaskOrderTranslation,
				},
			],
		})),
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
			<div className="flex flex-col items-center justify-center w-full">
				<Tabs
					aria-label="TabOptions"
					className="flex flex-col items-center justify-center w-full p-0 pb-4 font-semibold"
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
							subtitle={reqOrder.work_order_number}
							subtitleClassName={clsx(
								"mt-1 font-mono text-gray-600 text-sm",
								fontMono.variable
							)}
							title="รายละเอียดใบสั่งงาน"
						/>

						<FieldValueDisplayer
							sections={dataSections}
							size="expanded"
						/>

						<FormButtons
							cancelLabel="ยกเลิก"
							hasBorder={false}
							isSubmitting={isSubmitting}
							size="expanded"
							submitLabel="อนุมัติใบสั่งงาน"
							onCancel={handleCancel}
							onSubmit={() =>
								handleStatus(REQUESTORDERSTATUS.Pending)
							}
						/>
					</Tab>

					{/* Edit tab ----------------------------------------------------------------------------------------- */}
					<Tab
						key="edit"
						className="flex flex-col items-center justify-center w-full"
						title="แก้ไข"
					>
						<FormComponent
							cancelLabel="ยกเลิก"
							isSubmitting={isSubmitting}
							sections={commentSections}
							size="expanded"
							submitLabel="ส่งความคิดเห็น"
							subtitle={reqOrder.work_order_number}
							subtitleClassName={clsx(
								"mt-1 font-mono text-gray-600 text-sm",
								fontMono.variable
							)}
							title="แก้ไขใบสั่งงาน"
							values={commentValues}
							onCancel={handleCancel}
							onChange={handleCommentChange}
							onSubmit={() =>
								handleStatus(REQUESTORDERSTATUS.PendingEdit)
							}
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
							isSubmitting={isSubmitting}
							sections={commentSections}
							size="expanded"
							submitLabel="ส่งความคิดเห็น"
							subtitle={reqOrder.work_order_number}
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
