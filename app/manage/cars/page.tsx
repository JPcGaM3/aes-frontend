"use client";

import TableComponent from "@/app/(component-demo)/table/page";
import CardComponent from "@/components/CardComponent";
import { FieldConfig, TableHeader } from "@/interfaces/interfaces";
import { getCars } from "@/libs/carAPI";
import { useAuth } from "@/providers/AuthContext";
import { useLoading } from "@/providers/LoadingContext";
import { EditIcon, InfoIcon, RejectIcon } from "@/utils/icons";
import React, { useEffect, useState } from "react";

export default function ManageCarsPage() {
	const { setIsLoading } = useLoading();
	const { userContext } = useAuth();
	const [car, setCar] = useState<any[]>([]);

	const fetchData = async () => {
		try {
			const cars = await getCars({ token: userContext.token });
			setCar(cars);
		} catch (error) {
			console.error("Error fetching cars:", error);
		}
	};

	useEffect(() => {
		if (userContext.token) {
			try {
				setIsLoading(true);
				fetchData();
			} finally {
				setIsLoading(false);
			}
		}
	}, [userContext]);

	const tableHeaderFields: FieldConfig[] = [
		{ label: "Asset", key: "asset" },
		{ label: "Description", key: "asset_description" },
		{ label: "HP", key: "hp" },
	];

	const cardHeaderFields = [{ label: "Asset", key: "asset" }];

	const cardBodyFields = [
		{ label: "Description", key: "asset_description" },
		{ label: "HP", key: "hp" },
	];

	const actions = [
		{
			key: "view",
			label: "ดูรายละเอียด",
			icon: <InfoIcon />,
			onClick: () => console.log("View details clicked"),
			// onClick: () => handleNewPage("view"),
		},
		{
			key: "edit",
			label: "แก้ไข",
			icon: <EditIcon />,
			onClick: () => console.log("Edit clicked"),
			// onClick: () => handleNewPage("edit"),
		},
		{
			key: "reject",
			label: "ปฏิเสธ",
			icon: <RejectIcon />,
			className: "text-danger-500",
			onClick: () => console.log("Reject clicked"),
			// onClick: () => handleNewPage("reject"),
		},
	];

	return (
		<>
			<TableComponent
				headers={tableHeaderFields}
				datas={car}
				actions={actions}
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
