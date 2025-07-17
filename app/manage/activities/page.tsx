"use client";

import React, { useEffect, useState } from "react";

import TableComponent from "@/app/(component-demo)/table/page";
import { FieldConfig } from "@/interfaces/interfaces";
import { getActivities } from "@/libs/activityAPI";
import { useAuth } from "@/providers/AuthContext";
import { useLoading } from "@/providers/LoadingContext";
import { DeleteIcon, EditIcon } from "@/utils/icons";

export default function ManageCarsPage() {
	const { showLoading, hideLoading } = useLoading();
	const { userContext } = useAuth();
	const [activities, setActivities] = useState<any[]>([]);
	// const router = useRouter();

	const handleActions = ({
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
				hideLoading();
				break;

			case "reject":
			case "add":
				break;

			case "delete":
				hideLoading();
				break;

			default:
				hideLoading();
				break;
		}
	};

	const fetchData = async () => {
		try {
			const activities = await getActivities({
				token: userContext.token,
			});

			setActivities(activities);
		} catch (error) {
			console.error("Error fetching cars:", error);
		}
	};

	useEffect(() => {
		if (userContext.token) {
			try {
				showLoading();
				fetchData();
			} finally {
				hideLoading();
			}
		}
	}, [userContext]);

	const tableHeaderFields: FieldConfig[] = [{ label: "Name", key: "name" }];

	// const cardHeaderFields = [{ label: "Asset", key: "asset" }];

	// const cardBodyFields = [
	//   { label: "Description", key: "asset_description" },
	//   { label: "HP", key: "hp" },
	// ];

	const actions = [
		{
			key: "edit",
			label: "แก้ไข",
			icon: <EditIcon />,
			onClick: (item: any) =>
				handleActions({ params: { action: "edit", id: item.id } }),
		},
		{
			key: "delete",
			label: "ลบ",
			icon: <DeleteIcon />,
			className: "text-danger-500",
			onClick: (item: any) =>
				handleActions({ params: { action: "delete", id: item.id } }),
		},
	];

	return (
		<>
			<TableComponent
				actions={actions}
				datas={activities}
				headers={tableHeaderFields}
			/>
			{/* <CardComponent
        actions={actions}
        bodyFields={cardBodyFields}
        headerFields={cardHeaderFields}
        items={car}
      /> */}
		</>
	);
}
