"use client";

import React, { useRef } from "react";
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
import {
	ActionConfig,
	FieldConfig,
	FormSection,
} from "@/interfaces/interfaces";
import Header from "@/components/Header";
import FilterModal from "@/components/FilterModal";
import CardComponent from "@/components/CardComponent";
import { useLoading } from "@/providers/LoadingContext";
import { fontMono } from "@/config/fonts";
import { REQUESTORDERSTATUS, USERROLE } from "@/utils/enum";
import { CustomerType, RequestOrder } from "@/interfaces/schema";
import { fetchCustomerTypes, fetchReqOrderData } from "@/utils/functions";
import ProtectedRoute from "@/components/HigherOrderComponent";
import { useAlert } from "@/providers/AlertContext";

interface filterInterface {
	customer_type_id?: number;
	start_month?: string;
	start_year?: string;
	end_month?: string;
	end_year?: string;
}

export default function ListPage() {
	const router = useRouter();
	const { userContext, isReady } = useAuth();
	const { setIsLoading } = useLoading();
	const { showAlert } = useAlert();
	const {
		isOpen: isOpenFilter,
		onOpen: onOpenFilter,
		onClose: onCloseFilter,
	} = useDisclosure();

	const now = new Date();
	const currentYear = String(now.getFullYear());
	const currentMonth = monthList[now.getMonth()].value;

	const prevAeId = useRef<number | undefined>(undefined);
	const hasFetched = useRef(false);
	const [reqOrders, setReqOrders] = useState<RequestOrder[]>([]);
	const [customerTypes, setCustomerTypes] = useState<CustomerType[]>([]);
	const [filter, setFilter] = useState<filterInterface | null>({
		start_month: currentMonth,
		start_year: currentYear,
	});

	useEffect(() => {
		if (
			isReady &&
			userContext?.ae_id &&
			filter !== null &&
			prevAeId.current !== userContext.ae_id
		) {
			prevAeId.current = userContext.ae_id;
			hasFetched.current = false;
			setFilter({
				start_month: currentMonth,
				start_year: currentYear,
			});
		}
	}, [userContext?.ae_id, isReady, filter, currentMonth, currentYear]);

	useEffect(() => {
		if (isReady && userContext?.ae_id && !hasFetched.current) {
			setIsLoading(true);
			hasFetched.current = true;
			const fetchData = async () => {
				try {
					const promises = [];

					if (customerTypes.length < 1) {
						promises.push(
							fetchCustomerTypes({
								token: userContext.token,
								setCustomerTypes,
								showAlert,
							})
						);
					}

					const params = {
						...filter,
						ae_id: userContext?.ae_id,
						status: REQUESTORDERSTATUS.PendingApproval,
					};

					promises.push(
						fetchReqOrderData({
							token: userContext.token,
							params: params,
							setReqOrders,
							showAlert,
						})
					);
					await Promise.all(promises);
				} catch (error: any) {
					showAlert({
						title: "Failed to fetch",
						description: error.message || "Unknown error occurred",
						color: "danger",
					});
				} finally {
					setIsLoading(false);
				}
			};

			fetchData();
		}
	}, [filter, isReady, userContext?.ae_id]);

	const getActions = (item: RequestOrder) => {
		const actionList: ActionConfig[] = [
			{
				key: "view",
				label: "ดูรายละเอียด",
				icon: <InfoIcon />,
				onClick: () =>
					handleNewPage({ params: { id: item.id, action: "view" } }),
			},
			{
				key: "edit",
				label: "แจ้งแก้ไข",
				icon: <EditIcon />,
				onClick: () =>
					handleNewPage({ params: { id: item.id, action: "edit" } }),
			},
			{
				key: "reject",
				label: "ปฏิเสธ",
				icon: <RejectIcon />,
				className: "text-danger-500",
				onClick: () =>
					handleNewPage({
						params: { id: item.id, action: "reject" },
					}),
			},
		];

		return actionList;
	};

	const headerFields: FieldConfig[] = [
		{
			key: "quota_number",
			className: "text-black text-lg font-bold",
			labelTranslator: RequestOrderTranslation,
			valueClassName: clsx(
				"mt-1 font-mono text-gray-600 text-sm",
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
				"mt-1 font-mono text-gray-600 text-sm",
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

	const filterSections: FormSection[] = [
		{
			fields: [
				{
					type: "dropdown",
					name: "customer_type_id",
					labelTranslator: RequestOrderTranslation,
					options: [
						...customerTypes.map((option) => ({
							label: option.name || "-",
							value: option.id,
						})),
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

	const statusConfig = {
		colorMap: RequestOrderStatusColorMap,
		translation: RequestOrderStatusTranslation,
	};

	const handleApplyFilters = (values: any) => {
		hasFetched.current = false;
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
				router.push(`/list/${params.id}?action=${params.action}`);
				break;

			case "add":

			default:
				setIsLoading(false);
				break;
		}
	};

	return (
		<>
			<ProtectedRoute
				allowedRoles={[USERROLE.Admin, USERROLE.DepartmentHead]}
			>
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
					className="mb-6 w-full text-left"
					orientation="horizontal"
					subtitle="ใบสั่งงานทั้งหมด"
					title="รายการใบสั่งงาน"
				>
					<Button
						className="hidden sm:inline-flex font-semibold"
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
				</Header>

				{/* Body ------------------------------------------------------------- */}
				<div>
					<div className="mb-4 font-medium text-gray-700 text-right">
						{`จำนวนทั้งหมด: ${reqOrders.length ?? 0} รายการ`}
					</div>

					<CardComponent
						actions={getActions}
						bodyFields={bodyFields}
						headerFields={headerFields}
						items={reqOrders}
						statusConfig={statusConfig}
					/>
				</div>
			</ProtectedRoute>
		</>
	);
}
