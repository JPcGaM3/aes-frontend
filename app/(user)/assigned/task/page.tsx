"use client";

import React, { useRef } from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, useDisclosure } from "@heroui/react";
import clsx from "clsx";
import moment from "moment-timezone";
import {
	parseDate,
	CalendarDate,
	BuddhistCalendar,
	toCalendar,
} from "@internationalized/date";

import { useAuth } from "@/providers/AuthContext";
import {
	EditIcon,
	FilterIcon,
	InfoIcon,
	RejectIcon,
	StartIcon,
} from "@/utils/icons";
import {
	RequestOrderTranslation,
	TaskOrderStatusColorMap,
	TaskOrderStatusTranslation,
	TaskOrderTranslation,
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
import { TaskOrder } from "@/interfaces/schema";
import { fetchAssignedTask } from "@/utils/functions";
import { useAlert } from "@/providers/AlertContext";
import { TASKORDERSTATUS } from "@/utils/enum";

interface filterInterface {
	start_date?: CalendarDate;
	end_date?: CalendarDate;
	status?: string;
}

moment.locale("th");

export default function TaskPage() {
	const router = useRouter();
	const { userContext, isReady } = useAuth();
	const { showLoading, hideLoading } = useLoading();
	const { showAlert } = useAlert();
	const hasFetched = useRef(false);
	const [taskOrders, setTaskOrders] = useState<TaskOrder[]>([]);

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

	useEffect(() => {
		if (
			isReady &&
			userContext.id &&
			userContext.ae_id &&
			userContext.token &&
			!hasFetched.current
		) {
			showLoading();
			hasFetched.current = true;

			const fetchData = async () => {
				try {
					const promises = [
						fetchAssignedTask({
							token: userContext.token,
							user_id: userContext.id,
							setTaskOrders,
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
	}, [
		filterValues,
		isReady,
		userContext.ae_id,
		userContext.token,
		userContext.id,
	]);

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
			key: "quota_number",
			path: "requestorders.quota_number",
			className: "text-gray-600 text-md font-semibold",
			labelTranslator: RequestOrderTranslation,
		},
		{
			key: "farmer_name",
			path: "requestorders.farmer_name",
			className: "text-gray-600 text-md font-semibold pb-4",
			labelTranslator: RequestOrderTranslation,
		},
		{
			key: "activities_id",
			path: "activities.name",
			className: "text-gray-500 text-sm",
			labelTranslator: TaskOrderTranslation,
		},
		{
			key: "tool_types_id",
			path: "tool_type.tool_type_name",
			className: "text-gray-500 text-sm",
			labelTranslator: TaskOrderTranslation,
		},
		{
			key: "ap_date",
			path: "ap_date",
			className: "text-gray-500 text-sm",
			labelTranslator: TaskOrderTranslation,
			valueFunction: (item: any) => {
				return item.ap_date
					? moment(item.ap_date).tz("Asia/Bangkok").format("LL")
					: "-";
			},
		},
	];

	const filterSections: FormSection[] = [
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
					type: "text",
					name: "quota_number",
					labelTranslator: RequestOrderTranslation,
				},
				[
					{
						type: "date",
						name: "start_date",
						label: "วันเริ่มต้น",
					},
					{
						type: "date",
						name: "end_date",
						label: "วันสิ้นสุด",
					},
				],
			],
		},
	];

	const statusConfig = {
		colorMap: TaskOrderStatusColorMap,
		translation: TaskOrderStatusTranslation,
	};

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
		} catch (error: any) {
			showAlert({
				title: "Failed to process date values",
				description: error.message || "Unknown error occurred",
				color: "danger",
			});
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
		showLoading();

		router.push(`task/${params.id}?action=${params.action}`);
	};

	const getActions = (item: TaskOrder) => {
		const actionList: ActionConfig[] = [
			{
				key: "detail",
				label: "รายละเอียด",
				icon: <InfoIcon />,
				onClick: (item: TaskOrder) =>
					handleNewPage({
						params: { id: item.id, action: "detail" },
					}),
			},
		];

		if (
			item.status !== TASKORDERSTATUS.Rejected &&
			item.status !== TASKORDERSTATUS.Completed
		) {
			actionList.push(
				{
					key: "start",
					label: "เริ่มงาน",
					icon: <StartIcon />,
					onClick: (item: TaskOrder) =>
						handleNewPage({
							params: { id: item.id, action: "start" },
						}),
				},
				{
					key: "comment",
					label: "แจ้งปัญหา",
					icon: <EditIcon />,
					onClick: (item: TaskOrder) =>
						handleNewPage({
							params: { id: item.id, action: "comment" },
						}),
				},
				{
					key: "reject",
					label: "ปฏิเสธ",
					icon: <RejectIcon />,
					className: "text-danger-500",
					onClick: (item: TaskOrder) =>
						handleNewPage({
							params: { id: item.id, action: "reject" },
						}),
				}
			);
		}

		return actionList;
	};

	return (
		<>
			{/* Modal ------------------------------------------------------------- */}
			<FilterModal
				isOpen={isOpenFilter}
				sections={filterSections}
				title="ฟิลเตอร์รายการงานย่อย"
				values={filterValues}
				onClose={onCloseFilter}
				onSubmit={handleApplyFilters}
			/>

			{/* Header ----------------------------------------------------------- */}
			<Header
				className="w-full mb-6 text-left"
				orientation="horizontal"
				subtitle="งานย่อยทั้งหมดของคุณ"
				title="รายการใบงานย่อย"
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
					{`จำนวนทั้งหมด: ${taskOrders.length ?? 0} รายการ`}
				</div>

				<CardComponent
					actions={(item: TaskOrder) => getActions(item)}
					bodyFields={bodyFields}
					headerFields={headerFields}
					items={taskOrders}
					statusConfig={statusConfig}
				/>
			</div>
		</>
	);
}
