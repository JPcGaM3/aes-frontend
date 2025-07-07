"use client";

import TableComponent from "@/app/(component-demo)/table/page";
import CardComponent from "@/components/CardComponent";
import { FieldConfig, TableHeader } from "@/interfaces/interfaces";
import { getCars } from "@/libs/carAPI";
import { getUsers } from "@/libs/userAPI";
import { useAuth } from "@/providers/AuthContext";
import { useLoading } from "@/providers/LoadingContext";
import { DeleteIcon, EditIcon, InfoIcon, RejectIcon } from "@/utils/icons";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

export default function ManageCarsPage() {
	const { setIsLoading } = useLoading();
	const { userContext } = useAuth();
	const [user, setUser] = useState<any[]>([]);
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
				console.log(`Action triggered: ${params.action} ${params.id}`);
				setIsLoading(false);
				// router.push(`/manage/cars/${params.id}?action=${params.action}`);
				break;
			case "reject":
			case "add":
				console.log(`Action triggered: ${params.action}`);
				// router.push("/manage/cars/add");
				break;
			case "delete":
				console.log(`Action triggered: ${params.action} ${params.id}`);
				setIsLoading(false);
				// router.push("/manage/cars/delete");
				break;

			default:
				console.log(`Action triggered: ${params.action}`);
				setIsLoading(false);
				break;
		}
	};

	const fetchData = async () => {
		try {
			var users = await getUsers({ token: userContext.token });
			users = users.map((user: any) => {
				const roles: string[] = [];
				user.user_role.forEach((role: any) => {
					roles.push(role.role.name as string);
				});
				return {
					...user,
					ae_area: user.ae_area.name,
					role: roles,
				};
			});
			setUser(users);
		} catch (error) {
			console.error("Error fetching users:", error);
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
		{ label: "ID", key: "employee_id" },
		{ label: "Fullname", key: "fullname" },
		{ label: "Role", key: "role" },
		{ label: "AE", key: "ae_area" },
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
				headers={tableHeaderFields}
				datas={user}
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
