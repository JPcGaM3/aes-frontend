"use client";

import React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthContext";

import {
	EditIcon,
	FilterIcon,
	InfoIcon,
	PlusIcon,
	RejectIcon,
} from "@/utils/icons";
import {
	RequestOrderTranslation,
	TaskOrderStatusColorMap,
	TaskOrderStatusTranslation,
	TaskOrderTranslation,
} from "@/utils/constants";
import { FieldConfig, FormSection } from "@/interfaces/interfaces";

import { Button, Divider, useDisclosure } from "@heroui/react";

import Header from "@/components/Header";
import FilterModal from "@/components/FilterModal";
import CardComponent from "@/components/CardComponent";

import { useLoading } from "@/providers/LoadingContext";
import clsx from "clsx";
import { fontMono } from "@/config/fonts";
import { getAssignedTask } from "@/libs/taskOrderAPI";
import moment from "moment-timezone";
import {
	parseDate,
	CalendarDate,
	BuddhistCalendar,
	toCalendar,
} from "@internationalized/date";
import { RequestOrder, TaskOrder } from "@/interfaces/schema";

interface filterInterface {
	start_date?: CalendarDate;
	end_date?: CalendarDate;
	status?: string;
}

export default function TaskPage() {
	const router = useRouter();
	const { userContext, isReady } = useAuth();
	const { setIsLoading } = useLoading();
	const [taskOrders, setTaskOrders] = useState<TaskOrder[]>([]);
	const [error, setError] = useState<string | null>(null);
	const {
		isOpen: isOpenFilter,
		onOpen: onOpenFilter,
		onClose: onCloseFilter,
	} = useDisclosure();
	const now = moment.tz("Asia/Bangkok");
	const startDateStr = now.clone().startOf("month").format("YYYY-MM-DD");
	const endDateStr = now.clone().endOf("month").format("YYYY-MM-DD");
	const startDateValue = toCalendar(
		parseDate(startDateStr),
		new BuddhistCalendar()
	);
	const endDateValue = toCalendar(
		parseDate(endDateStr),
		new BuddhistCalendar()
	);
	const [filterValues, setFilterValues] = useState<filterInterface>({
		start_date: startDateValue,
		end_date: endDateValue,
		status: undefined,
	});

	const fetchTaskOrderData = async ({
		token,
		user_id,
	}: {
		token: string;
		user_id: number;
	}) => {
		try {
			const params = filterValues
				? {
						start_date: filterValues.start_date
							? filterValues.start_date.toString()
							: undefined,
						end_date: filterValues.end_date
							? filterValues.end_date.toString()
							: undefined,
						status: filterValues.status
							? filterValues.status?.toUpperCase()
							: undefined,
					}
				: undefined;
			setError(null);
			const data = await getAssignedTask({ token, user_id, params });
			if (!data) {
				setTaskOrders([]);
			}
			setTaskOrders(data || []);
		} catch (error: any) {
			setError(error.message || "Unknown error");
			setTaskOrders([]);
		}
	};

	useEffect(() => {
		setIsLoading(true);
		if (
			isReady &&
			userContext.id &&
			userContext.token &&
			userContext.operationAreaId
		) {
			const fetchData = async (): Promise<any> => {
				try {
					setTaskOrders([]);
					await fetchTaskOrderData({
						token: userContext.token,
						user_id: userContext.id,
					});
				} catch (error) {
					console.error("Failed to fetch:", error);
				} finally {
					setIsLoading(false);
				}
			};

			fetchData();
		}
	}, [userContext, filterValues, isReady]);

	const headerFields: FieldConfig[] = [
		{
			key: "id",
			className: "text-black text-lg font-bold",
			labelTranslator: TaskOrderTranslation,
			valueClassName: clsx(
				"mt-1 font-mono text-gray-600 text-sm",
				fontMono.variable
			),
		},
	];

	const bodyFields: FieldConfig[] = [
		{
			key: "requestorders.quota_number",
			className: "text-gray-600 text-md font-semibold",
			labelTranslator: RequestOrderTranslation,
		},
		{
			key: "requestorders.farmer_name",
			className: "text-gray-600 text-md font-semibold pb-4",
			labelTranslator: RequestOrderTranslation,
		},
		{
			key: "activities.name",
			className: "text-gray-500 text-sm",
			labelTranslator: TaskOrderTranslation,
		},
		{
			key: "tool_type.tool_type_name",
			className: "text-gray-500 text-sm",
			labelTranslator: TaskOrderTranslation,
		},
		{
			key: "ap_date",
			className: "text-gray-500 text-sm",
			labelTranslator: TaskOrderTranslation,
		},
	];

	const filterFields: FormSection[] = [
		{
			fields: [
				{
					type: "dropdown",
					name: "status",
					label: "สถานะ",
					options: [
						{ label: "ทั้งหมด", value: "all" },
						...Object.entries(TaskOrderStatusTranslation).map(
							([value, label]) => ({
								label: label as string,
								value: value as string,
							})
						),
					],
				},
				{
					type: "date",
					name: "start_date",
					label: "วันเริ่มต้น",
					className: "w-2/3",
				},
				{
					type: "date",
					name: "end_date",
					label: "วันสิ้นสุด",
					className: "w-2/3",
				},
			],
		},
	];

	const statusConfig = {
		colorMap: TaskOrderStatusColorMap,
		translation: TaskOrderStatusTranslation,
	};

	const actions = [
		{
			key: "view",
			label: "ดูรายละเอียด",
			icon: <InfoIcon />,
			onClick: ({ item }: { item: RequestOrder }) =>
				handleNewPage({ params: { id: item.id, action: "view" } }),
		},
		{
			key: "edit",
			label: "แก้ไข",
			icon: <EditIcon />,
			onClick: ({ item }: { item: RequestOrder }) =>
				handleNewPage({ params: { id: item.id, action: "edit" } }),
		},
		{
			key: "reject",
			label: "ปฏิเสธ",
			icon: <RejectIcon />,
			className: "text-danger-500",
			onClick: ({ item }: { item: RequestOrder }) =>
				handleNewPage({ params: { id: item.id, action: "reject" } }),
		},
	];

	const handleApplyFilters = (values: any) => {
		try {
			let startDate;
			if (!values.start_date) {
				startDate = startDateValue;
			} else if (typeof values.start_date === "string") {
				startDate = toCalendar(
					parseDate(values.start_date),
					new BuddhistCalendar()
				);
			} else {
				startDate = values.start_date;
			}

			let endDate;
			if (!values.end_date) {
				endDate = endDateValue;
			} else if (typeof values.end_date === "string") {
				endDate = toCalendar(
					parseDate(values.end_date),
					new BuddhistCalendar()
				);
			} else {
				endDate = values.end_date;
			}

			let status;
			if (values.status === "all") {
				status = undefined;
			} else {
				status = values.status;
			}

			setFilterValues({
				start_date: startDate,
				end_date: endDate,
				status: status,
			});
		} catch (error) {
			console.error("Error processing date values:", error);
		}

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
			case "comment":
				router.push(`/task/${params.id}/${params.action}`);
				break;
			case "reject":
			case "add":

			default:
				console.log(`Action triggered: ${params.action}`);
				setIsLoading(false);
				break;
		}
	};

	return (
		<div>
			{/* Modal ------------------------------------------------------------- */}
			<FilterModal
				isOpen={isOpenFilter}
				title="ฟิลเตอร์รายการงานย่อย"
				sections={filterFields}
				submitLabel="Apply Filters"
				cancelLabel="Cancel"
				onSubmit={handleApplyFilters}
				onClose={onCloseFilter}
				values={filterValues}
			/>

			{/* Header ----------------------------------------------------------- */}
			<Header title="รายการงานย่อย" className="mb-6 w-full text-left">
				<Button
					radius="sm"
					variant="flat"
					color="primary"
					endContent={<FilterIcon />}
					onPress={onOpenFilter}
					className="hidden sm:inline-flex font-semibold"
				>
					Filter
				</Button>

				<Button
					isIconOnly
					radius="sm"
					variant="flat"
					color="primary"
					endContent={<FilterIcon />}
					onPress={onOpenFilter}
					className="sm:hidden"
				/>

				<Divider orientation="vertical" className="w-[1px]" />

				<Button
					radius="sm"
					variant="solid"
					color="primary"
					endContent={<PlusIcon />}
					onPress={() => handleNewPage({ params: { action: "add" } })}
					className="hidden sm:inline-flex font-semibold"
				>
					Add
				</Button>

				<Button
					isIconOnly
					radius="sm"
					variant="solid"
					color="primary"
					endContent={<PlusIcon />}
					onPress={() => handleNewPage({ params: { action: "add" } })}
					className="sm:hidden"
				/>
			</Header>

			{/* Body ------------------------------------------------------------- */}
			{error ? (
				<div className="my-8 font-medium text-gray-500 text-center">
					{error}
				</div>
			) : (
				<div>
					<div className="mb-4 font-medium text-gray-700 text-right">
						{`จำนวนทั้งหมด: ${taskOrders.length ?? 0} รายการ`}
					</div>

					<CardComponent
						actions={actions}
						bodyFields={bodyFields}
						headerFields={headerFields}
						items={taskOrders}
						statusConfig={statusConfig}
					/>
				</div>
			)}
		</div>
	);
}
