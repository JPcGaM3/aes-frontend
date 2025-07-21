"use client";

import React, { useEffect, useState } from "react";

import { getUsers } from "@/libs/userAPI";
import { useAuth } from "@/providers/AuthContext";
import { useLoading } from "@/providers/LoadingContext";
import { RemoveIcon, EditIcon } from "@/utils/icons";
import CardComponent from "@/components/CardComponent";

export default function ManageCarsPage() {
	const { showLoading, hideLoading } = useLoading();
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
			alert("Error fetching users : " + error);
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
	// 	{ label: "ID", key: "employee_id" },
	// 	{ label: "Fullname", key: "fullname" },
	// 	{ label: "Role", key: "role" },
	// 	{ label: "AE", key: "ae_area" },
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
				bodyFields={[]}
				headerFields={[]}
				items={user}
			/>
		</>
	);
}
