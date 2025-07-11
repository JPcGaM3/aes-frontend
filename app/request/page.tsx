"use client";

import React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Divider, useDisclosure } from "@heroui/react";
import clsx from "clsx";

import { useAuth } from "@/providers/AuthContext";
import {
	EditIcon,
	FilterIcon,
	InfoIcon,
	PlusIcon,
	RejectIcon,
} from "@/utils/icons";
import {
	RequestOrderStatusColorMap,
	RequestOrderStatusTranslation,
	RequestOrderTranslation,
	month,
	monthList,
	yearList,
	yearMap,
} from "@/utils/constants";
import { FieldConfig, FormSection } from "@/interfaces/interfaces";
import { CustomerType, RequestOrder } from "@/interfaces/schema";
import Header from "@/components/Header";
import FilterModal from "@/components/FilterModal";
import CardComponent from "@/components/CardComponent";
import AlertComponent from "@/components/AlertComponent";
import { getRequestOrders } from "@/libs/requestOrderAPI";
import { useLoading } from "@/providers/LoadingContext";
import { fontMono } from "@/config/fonts";
import { AlertComponentProps } from "@/interfaces/props";
import { getCustomerTypes } from "@/libs/customerTypeAPI";
import { REQUESTORDERSTATUS } from "@/utils/enum";

interface filterInterface {
	status?: string;
	ae_id?: number;
	customer_type_id?: number;
	start_month?: string;
	start_year?: string;
	end_month?: string;
	end_year?: string;
}

export default function RequestPage() {
	// Fetch data ------------------------------------------------------------------
	const { userContext, isReady } = useAuth();
	const { setIsLoading } = useLoading();

	const router = useRouter();
	const now = new Date();
	const currentYear = String(now.getFullYear());
	const currentMonth = monthList[now.getMonth()].value;

	const [reqOrders, setReqOrders] = useState<RequestOrder[]>([]);
	const [customerOptions, setCustomerOptions] = useState<CustomerType[]>([]);
	const [alert, setAlert] = useState<AlertComponentProps | null>(null);
	const [filter, setFilter] = useState<filterInterface | null>(null);

	useEffect(() => {
		if (
			isReady &&
			userContext &&
			userContext.id &&
			userContext.token &&
			userContext.ae_id
		) {
			const fetchDropdownData = async ({ token }: { token: string }) => {
				if (token) {
					try {
						setFilter(null);
						setCustomerOptions([]);

						const customer_type = await getCustomerTypes({
							token: token,
						});

						setCustomerOptions(customer_type);
						setFilter({
							customer_type_id: undefined,
							start_month: currentMonth,
							start_year: currentYear,
						});
					} catch (err: any) {
						setAlert({
							title: "Failed to fetch dropdown",
							description: err.message,
							color: "danger",
						});
					}
				}
			};

			fetchDropdownData({ token: userContext.token });
		}
	}, [userContext, isReady]);

	useEffect(() => {
		setIsLoading(true);

		if (
			isReady &&
			userContext &&
			userContext.id &&
			userContext.token &&
			userContext.ae_id
		) {
			const fetchReqOrderData = async ({
				token,
				params,
			}: {
				token: string;
				params: any;
			}) => {
				if (token && params) {
					try {
						setAlert(null);
						setReqOrders([]);

						const data = await getRequestOrders({
							token,
							paramData: params,
						});

						setReqOrders(data);
					} catch (err: any) {
						if (err.status === 404) {
							setAlert({
								title: "ไม่พบรายการใบสั่งงานในขณะนี้",
								description: err.message,
								color: "default",
							});
						} else {
							setAlert({
								title: "Failed to fetch",
								description: err.message,
								color: "danger",
							});
						}

						setReqOrders([]);
					} finally {
						setIsLoading(false);
					}
				}
			};

			const params = {
				...filter,
				ae_id: userContext.ae_id,
			};

			fetchReqOrderData({ token: userContext.token, params: params });
		}
	}, [userContext, filter, isReady]);

	// useState for modal and drawer visibility ------------------------------
	const {
		isOpen: isOpenFilter,
		onOpen: onOpenFilter,
		onClose: onCloseFilter,
	} = useDisclosure();

	// Handlers for modal and drawer actions ---------------------------------
	const handleApplyFilters = (values: any) => {
		setFilter(values);
		onCloseFilter();
	};

	const handleNewPage = ({
		params,
	}: {
		params: {
			action: string;
			id?: number;
		};
	}) => {
		setIsLoading(true);

		switch (params.action) {
			case "view":
			case "edit":
			case "reject":
				router.push(`/request/${params.id}?action=${params.action}`);
				break;

			case "add":
				router.push("/request/add");
				break;

			default:
				setIsLoading(false);
				break;
		}
	};

	// Field configurations --------------------------------------------------
	const filterSections: FormSection[] = [
		{
			fields: [
				{
					type: "dropdown",
					name: "customer_type_id",
					labelTranslator: RequestOrderTranslation,
					options: [
						...customerOptions.map((option) => ({
							label: option.name || "-",
							value: option.id,
						})),
					],
				},
				{
					type: "dropdown",
					name: "status",
					label: "สถานะ",
					options: [
						{ label: "ทั้งหมด", value: "all" },
						...Object.entries(RequestOrderStatusTranslation).map(
							([value, label]) => ({
								label: label as string,
								value: value as string,
							})
						),
					],
				},
				[
					{
						type: "dropdown",
						name: "start_month",
						label: "เดือนเริ่มต้น",
						options: monthList,
						className: "w-2/3",
					},
					{
						type: "dropdown",
						name: "start_year",
						label: "ปีเริ่มต้น",
						options: yearList,
						className: "w-1/3",
					},
				],
				[
					{
						type: "dropdown",
						name: "end_month",
						label: "เดือนสิ้นสุด",
						options: monthList,
						className: "w-2/3",
					},
					{
						type: "dropdown",
						name: "end_year",
						label: "ปีสิ้นสุด",
						options: yearList,
						className: "w-1/3",
					},
				],
			],
		},
	];

	const headerFields: FieldConfig[] = [
		{
			key: "quota_number",
			className: "text-black text-lg font-bold",
			labelTranslator: RequestOrderTranslation,
			valueClassName: clsx(
				"mt-1 text-sm text-gray-600 font-mono",
				fontMono.variable
			),
		},
		{
			key: "farmer_name",
			className: "text-black text-lg font-bold",
			labelTranslator: RequestOrderTranslation,
		},
	];

	const bodyFields: FieldConfig[] = [
		{
			key: "customer_type_id",
			path: "customer_type.name",
			className: "text-gray-600 text-md font-semibold",
			labelTranslator: RequestOrderTranslation,
		},
		{
			key: "work_order_number",
			className: "text-gray-600 text-md font-semibold pb-4",
			labelTranslator: RequestOrderTranslation,
			valueFunction: (item: any) => {
				const aeArea = item.ae_area?.name || "";
				const opArea = item.operation_area?.operation_area || "";
				const year = item.ap_year ? Number(item.ap_year) + 543 : "";
				const run = item.run_number || "";

				return `${aeArea}${opArea}${year + "/"}${run}`;
			},
			valueClassName: clsx(
				"mt-1 text-sm text-gray-600 font-mono",
				fontMono.variable
			),
		},
		{
			key: "land_number",
			className: "text-gray-500 text-sm",
			labelTranslator: RequestOrderTranslation,
		},
		{
			key: "count",
			path: "_count.taskorders",
			className: "text-gray-500 text-sm",
			labelTranslator: RequestOrderTranslation,
		},
		{
			key: "ap_month",
			className: "text-gray-500 text-sm",
			labelTranslator: RequestOrderTranslation,
			valueTranslator: month,
		},
		{
			key: "ap_year",
			className: "text-gray-500 text-sm",
			labelTranslator: RequestOrderTranslation,
			valueTranslator: yearMap,
		},
	];

	const statusConfig = {
		colorMap: RequestOrderStatusColorMap,
		translation: RequestOrderStatusTranslation,
	};

	const getActions = (item: RequestOrder) => {
		const actionList = [
			{
				key: "view",
				label: "ดูรายละเอียด",
				icon: <InfoIcon />,
				onClick: () =>
					handleNewPage({ params: { id: item.id, action: "view" } }),
			},
		];

		if (
			item.status !== REQUESTORDERSTATUS.Rejected &&
			item.status !== REQUESTORDERSTATUS.PendingApproval
		) {
			actionList.push({
				key: "edit",
				label: "แก้ไข",
				icon: <EditIcon />,
				onClick: () =>
					handleNewPage({ params: { id: item.id, action: "edit" } }),
			});

			actionList.push({
				key: "reject",
				label: "ปฏิเสธ",
				icon: <RejectIcon />,
				onClick: () =>
					handleNewPage({ params: { id: item.id, action: "reject" } }),
			});
		}

		return actionList;
	};

	return (
		<div>
			{/* Modal ------------------------------------------------------------- */}
			<FilterModal
				cancelLabel="Cancel"
				isOpen={isOpenFilter}
				sections={filterSections}
				submitLabel="Apply Filters"
				title="ฟิลเตอร์รายการใบสั่งงาน"
				values={filter}
				onClose={() => onCloseFilter()}
				onSubmit={handleApplyFilters}
			/>

			{/* Header ----------------------------------------------------------- */}
			<Header
				className="w-full mb-6 text-left"
				orientation="horizontal"
				subtitle="ใบสั่งงานทั้งหมด"
				title="รายการใบสั่งงาน"
			>
				<Button
					className="hidden font-semibold sm:inline-flex"
					color="primary"
					endContent={<FilterIcon />}
					radius="sm"
					variant="flat"
					onPress={onOpenFilter}
				>
					Filter
				</Button>

				<Button
					isIconOnly
					className="sm:hidden"
					color="primary"
					endContent={<FilterIcon />}
					radius="sm"
					variant="flat"
					onPress={onOpenFilter}
				/>

				<Divider className="w-[1px] h-10" orientation="vertical" />

				<Button
					className="hidden font-semibold sm:inline-flex"
					color="primary"
					endContent={<PlusIcon />}
					radius="sm"
					variant="solid"
					onPress={() => handleNewPage({ params: { action: "add" } })}
				>
					Add
				</Button>

				<Button
					isIconOnly
					className="sm:hidden"
					color="primary"
					endContent={<PlusIcon />}
					radius="sm"
					variant="solid"
					onPress={() => handleNewPage({ params: { action: "add" } })}
				/>
			</Header>

			{/* Body ------------------------------------------------------------- */}
			{alert ? (
				<AlertComponent
					{...alert}
					handleClose={() => setAlert(null)}
					isVisible={alert != null}
					placement="bottom"
					size="full"
				/>
			) : (
				<div>
					<div className="mb-4 font-medium text-right text-gray-700">
						{`จำนวนทั้งหมด: ${reqOrders.length ?? 0} รายการ`}
					</div>

					<CardComponent
						actions={(item: RequestOrder) => getActions(item)}
						bodyFields={bodyFields}
						headerFields={headerFields}
						items={reqOrders}
						statusConfig={statusConfig}
					/>
				</div>
			)}
		</div>
	);
}
