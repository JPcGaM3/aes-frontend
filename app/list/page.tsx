"use client";

import React, { useRef } from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, useDisclosure } from "@heroui/react";
import clsx from "clsx";

import { useAuth } from "@/providers/AuthContext";
import { EditIcon, FilterIcon, InfoIcon, RejectIcon } from "@/utils/icons";
import {
	RequestOrderStatusColorMap,
	RequestOrderStatusTranslation,
	RequestOrderTranslation,
	month,
	getMonthList,
	getYearList,
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
import { REQUESTORDERSTATUS } from "@/utils/enum";
import { CustomerType, RequestOrder } from "@/interfaces/schema";
import { fetchCustomerTypes, fetchReqOrderData } from "@/utils/functions";
import { useAlert } from "@/providers/AlertContext";

interface filterInterface {
	ae_id?: number;
	customer_type_id?: number;
	start_month?: string;
	start_year?: number;
	end_month?: string;
	end_year?: number;
}

export default function ListPage() {
	const router = useRouter();
	const { userContext, isReady } = useAuth();
	const { showLoading, hideLoading } = useLoading();
	const { showAlert } = useAlert();
	const {
		isOpen: isOpenFilter,
		onOpen: onOpenFilter,
		onClose: onCloseFilter,
	} = useDisclosure();

	const now = new Date();
	const currentYear = now.getFullYear();
	const currentMonth = getMonthList({})[now.getMonth()].value;

	const prevAeId = useRef<number | undefined>(undefined);
	const hasFetched = useRef(false);
	const [reqOrders, setReqOrders] = useState<RequestOrder[] | null>(null);
	const [customerTypes, setCustomerTypes] = useState<CustomerType[]>([]);
	const [filterTemp, setFilterTemp] = useState<filterInterface | null>({
		start_month: currentMonth,
		start_year: currentYear,
	});
	const [filterValues, setFilterValues] = useState<filterInterface | null>({
		start_month: currentMonth,
		start_year: currentYear,
	});

	useEffect(() => {
		if (
			isReady &&
			userContext?.ae_id &&
			prevAeId.current !== userContext.ae_id
		) {
			prevAeId.current = userContext.ae_id;
			hasFetched.current = false;
			setFilterValues({
				start_month: currentMonth,
				start_year: currentYear,
			});
		}
	}, [userContext?.ae_id, isReady, currentMonth, currentYear]);

	useEffect(() => {
		if (
			isReady &&
			userContext?.ae_id &&
			userContext?.token &&
			!hasFetched.current
		) {
			showLoading();
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
						...filterValues,
						ae_id: userContext?.ae_id,
						status: [
							REQUESTORDERSTATUS.PendingApproval,
							REQUESTORDERSTATUS.PendingEdit,
							REQUESTORDERSTATUS.Rejected,
						],
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
	}, [filterValues, isReady, userContext?.ae_id, userContext?.token]);

	const getActions = (item: RequestOrder) => {
		const actionList: ActionConfig[] = [
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
			item.status !== REQUESTORDERSTATUS.PendingEdit
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
				className: "text-danger-500",
				onClick: () =>
					handleNewPage({
						params: { id: item.id, action: "reject" },
					}),
			});
		}

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
		},
	];

	const statusConfig = {
		colorMap: RequestOrderStatusColorMap,
		translation: RequestOrderStatusTranslation,
	};

	const getEndMonthList = () => {
		if (filterTemp?.start_year === filterTemp?.end_year) {
			return getMonthList({ start_month: filterTemp?.start_month });
		}

		return getMonthList({});
	};

	const getEndYearList = () => {
		return getYearList({ start_year: filterTemp?.start_year });
	};

	const getFilterSections = (): FormSection[] => [
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
				{
					type: "text",
					name: "quota_number",
					labelTranslator: RequestOrderTranslation,
				},
				[
					{
						type: "dropdown",
						name: "start_year",
						label: "ปีเริ่มต้น",
						className: "w-1/2",
						options: getYearList({}),
					},
					{
						type: "dropdown",
						name: "start_month",
						label: "เดือนเริ่มต้น",
						className: "w-1/2",
						options: getMonthList({}),
						isReadOnly: !filterTemp?.start_year,
					},
				],
				[
					{
						type: "dropdown",
						name: "end_year",
						label: "ปีสิ้นสุด",
						className: "w-1/2",
						options: getEndYearList(),
						isReadOnly: !filterTemp?.start_year,
					},
					{
						type: "dropdown",
						name: "end_month",
						label: "เดือนสิ้นสุด",
						className: "w-1/2",
						options: getEndMonthList(),
						isReadOnly:
							!filterTemp?.start_month ||
							!filterTemp?.start_year ||
							!filterTemp?.end_year,
						isClearable: filterTemp?.start_month !== undefined,
					},
				],
			],
		},
	];

	const handleFiltersApply = (values: any) => {
		hasFetched.current = false;
		setFilterValues(values);
		onCloseFilter();
	};

	const handleFilterChange = (values: any) => {
		const newValues: filterInterface = { ...filterTemp, ...values };

		if (!newValues.start_year) {
			newValues.end_year = undefined;
			newValues.end_month = undefined;
			newValues.start_month = undefined;
		} else {
			if (newValues.end_year) {
				if (newValues.start_year > newValues.end_year) {
					newValues.end_year = newValues.start_year;
				}

				if (!newValues.start_month) {
					newValues.end_month = undefined;
				} else {
					if (newValues.end_month) {
						const monthList = getMonthList({});
						const startMonthIndex = monthList.findIndex(
							(m) => m.value === newValues.start_month
						);
						const endMonthIndex = monthList.findIndex(
							(m) => m.value === newValues.end_month
						);

						if (newValues.start_year === newValues.end_year) {
							if (startMonthIndex > endMonthIndex) {
								newValues.end_month = newValues.start_month;
							}
						}
					} else {
						newValues.end_month = newValues.start_month;
					}
				}
			} else {
				newValues.end_month = undefined;
			}
		}

		setFilterTemp(newValues);
	};

	const handleFilterClose = () => {
		setFilterTemp(filterValues);
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
		showLoading();

		switch (params.action) {
			case "view":
			case "edit":
			case "reject":
				router.push(`/list/${params.id}?action=${params.action}`);
				break;

			default:
				hideLoading();
				break;
		}
	};

	return (
		<>
			{/* Modal ------------------------------------------------------------- */}
			<FilterModal
				isOpen={isOpenFilter}
				sections={getFilterSections()}
				title="ฟิลเตอร์รายการใบสั่งงาน"
				values={filterTemp}
				onChange={handleFilterChange}
				onClose={handleFilterClose}
				onSubmit={handleFiltersApply}
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
					endContent={<FilterIcon variant="border" />}
					radius="sm"
					variant="flat"
					onPress={onOpenFilter}
				>
					ตัวกรอง
				</Button>

				<Button
					isIconOnly
					className="sm:hidden"
					color="primary"
					endContent={<FilterIcon variant="border" />}
					radius="sm"
					variant="flat"
					onPress={onOpenFilter}
				/>
			</Header>

			{/* Body ------------------------------------------------------------- */}
			<div>
				<div className="mb-4 font-medium text-right text-gray-700">
					{`จำนวนทั้งหมด: ${reqOrders?.length ?? 0} รายการ`}
				</div>

				<CardComponent
					actions={(item: RequestOrder) => getActions(item)}
					bodyFields={bodyFields}
					headerFields={headerFields}
					items={reqOrders || []}
					statusConfig={statusConfig}
				/>
			</div>
		</>
	);
}
