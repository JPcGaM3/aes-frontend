"use client";

import React, { useEffect } from "react";
import { use, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import clsx from "clsx";
import { Tab, Tabs } from "@heroui/react";
import moment from "moment-timezone";

import { fontMono } from "@/config/fonts";
import Header from "@/components/Header";
import { useLoading } from "@/providers/LoadingContext";
import { FieldSection, FormSection } from "@/interfaces/interfaces";
import { RequestOrder } from "@/interfaces/schema";
import { useAuth } from "@/providers/AuthContext";
import { SetStatusRequestOrder } from "@/libs/requestOrderAPI";
import FormComponent from "@/components/FormComponent";
import { REQUESTORDERSTATUS } from "@/utils/enum";
import { AlertComponentProps } from "@/interfaces/props";
import AlertComponent from "@/components/AlertComponent";
import { RequestOrderTranslation, month, yearMap } from "@/utils/constants";
import FieldValueDisplayer from "@/components/FieldValueDisplayer";
import FormButtons from "@/components/FormButtons";
import { fetchReqOrderWithTaskData } from "@/utils/functions";

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
	const [reqOrder, setReqOrder] = useState<RequestOrder>({} as RequestOrder);

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
		if (rid && isReady) {
			setIsLoading(true);
			const fetchData = async () => {
				try {
					await fetchReqOrderWithTaskData({
						token: userContext.token,
						requestId: rid,
						setReqOrder: setReqOrder,
						setAlert: setAlert,
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

			fetchData();
		}
	}, [isReady, rid]);

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
					description: `อัพเดตสถานะใบสั่งงานเลขที่ ${reqOrder.work_order_number} แล้ว`,
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
					value: reqOrder?.customer_type?.name || "-",
					labelTranslator: RequestOrderTranslation,
				},
				{
					name: "created_at",
					value: reqOrder?.created_at
						? moment(reqOrder.created_at).tz("Asia/Bangkok").format("LLL")
						: "-",
					labelTranslator: RequestOrderTranslation,
				},
				{
					name: "ae_id",
					value: reqOrder?.ae_area?.name || "-",
					labelTranslator: RequestOrderTranslation,
				},
				{
					name: "unit_head",
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
					translator: yearMap,
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
					value: reqOrder?.target_area || "-",
					labelTranslator: RequestOrderTranslation,
				},
			],
		},
		{
			title: "กิจกรรมและเครื่องมือ",
			fields: [
				{
					name: "count",
					value: `${reqOrder?.taskorders?.length || 0} กิจกรรม`,
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
		<div className="flex flex-col justify-center items-center w-full">
			{alert.isVisible && (
				<AlertComponent
					{...alert}
					handleClose={() => setAlert({ ...alert, isVisible: false })}
					size="expanded"
				/>
			)}

			<Tabs
				aria-label="TabOptions"
				className="flex flex-col justify-center items-center p-0 pb-4 w-full font-semibold"
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
						subtitle={reqOrder.work_order_number}
						subtitleClassName={clsx(
							"mt-1 font-mono text-gray-600 text-sm",
							fontMono.variable
						)}
						title="ดูรายละเอียดใบสั่งงาน"
					/>

					<FieldValueDisplayer sections={dataSections} size="expanded" />

					<FormButtons
						hasBorder={false}
						size="expanded"
						submitColor="default"
						submitLabel="ยกเลิก"
						onSubmit={handleCancel}
					/>
				</Tab>

				{/* Edit tab ----------------------------------------------------------------------------------------- */}
				<Tab
					key="edit"
					className="flex flex-col justify-center items-center w-full"
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
						title="สาเหตุการปฏิเสธงาน"
						values={commentValues}
						onCancel={handleCancel}
						onChange={handleCommentChange}
						onSubmit={() => handleStatus(REQUESTORDERSTATUS.PendingEdit)}
					/>
				</Tab>

				{/* Reject tab ----------------------------------------------------------------------------------------- */}
				<Tab
					key="reject"
					className="flex flex-col justify-center items-center w-full"
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
