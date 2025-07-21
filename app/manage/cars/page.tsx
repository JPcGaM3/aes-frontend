"use client";

import React, { useEffect, useState } from "react";

import { getCars } from "@/libs/carAPI";
import { useAuth } from "@/providers/AuthContext";
import { useLoading } from "@/providers/LoadingContext";
import { RemoveIcon, EditIcon } from "@/utils/icons";
import CardComponent from "@/components/CardComponent";

export default function ManageCarsPage() {
	const { showLoading, hideLoading } = useLoading();
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
			const cars = await getCars({ token: userContext.token });

			setCar(cars);
		} catch (error) {
			alert("Error fetching cars : " + error);
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

	// const tableHeaderFields: FieldConfig[] = [
	// 	{ label: "Asset", key: "asset" },
	// 	{ label: "Description", key: "asset_description" },
	// 	{ label: "HP", key: "hp" },
	// ];

	const cardHeaderFields = [{ label: "Asset", key: "asset" }];

	const cardBodyFields = [
		{ label: "Description", key: "asset_description" },
		{ label: "HP", key: "hp" },
	];

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
			icon: <RemoveIcon />,
			className: "text-danger-500",
			onClick: (item: any) =>
				handleActions({ params: { action: "delete", id: item.id } }),
		},
	];

	return (
		<>
			<CardComponent
				actions={actions}
				bodyFields={cardBodyFields}
				headerFields={cardHeaderFields}
				items={car}
			/>
		</>
	);
}
