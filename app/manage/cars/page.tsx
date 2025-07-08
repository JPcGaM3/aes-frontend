"use client";

import React, { useEffect, useState } from "react";

import TableComponent from "@/app/(component-demo)/table/page";
import { FieldConfig } from "@/interfaces/interfaces";
import { getCars } from "@/libs/carAPI";
import { useAuth } from "@/providers/AuthContext";
import { useLoading } from "@/providers/LoadingContext";
import { DeleteIcon, EditIcon } from "@/utils/icons";

export default function ManageCarsPage() {
	const { setIsLoading } = useLoading();
	const { userContext } = useAuth();
	const [car, setCar] = useState<any[]>([]);
	// const router = useRouter();

	const handleActions = ({
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
				setIsLoading(false);
				break;

			case "reject":
			case "add":
				break;

			case "delete":
				setIsLoading(false);
				break;

			default:
				setIsLoading(false);
				break;
		}
	};

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
				datas={car}
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
