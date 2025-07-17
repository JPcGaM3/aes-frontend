"use client";

import React, { useEffect, useState } from "react";

import TableComponent from "@/app/(demo)/table/page";
import { FieldConfig } from "@/interfaces/interfaces";
import { getUsers } from "@/libs/userAPI";
import { useAuth } from "@/providers/AuthContext";
import { useLoading } from "@/providers/LoadingContext";
import { DeleteIcon, EditIcon } from "@/utils/icons";

export default function ManageCarsPage() {
	const { setIsLoading } = useLoading();
	const { userContext } = useAuth();
	const [user, setUser] = useState<any[]>([]);

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
				datas={user}
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
