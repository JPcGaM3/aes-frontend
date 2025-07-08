"use client";

import {
	Button,
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownTrigger,
	useDisclosure,
} from "@heroui/react";

import { VerticalDotsIcon } from "@/utils/icons";
import { mock_users } from "@/utils/mock";

import { FormSection } from "@/interfaces/interfaces";
import { User } from "@/interfaces/schema";

import DrawerComponent from "@/components/DrawerComponent";
import FormComponent from "@/components/FormComponent";
import Header from "@/components/Header";

export default function DrawerPage() {
	const mockData: User = mock_users[0];

	const {
		isOpen: isOpenView,
		onOpen: onOpenView,
		onClose: onCloseView,
	} = useDisclosure();

	const {
		isOpen: isOpenEdit,
		onOpen: onOpenEdit,
		onClose: onCloseEdit,
	} = useDisclosure();

	const handleView = () => {
		console.log("Viewing user");

		onOpenView();
	};

	const handleEdit = () => {
		console.log("Editing user");

		onOpenEdit();
	};

	const actions = [
		{
			key: "view",
			label: "ดูรายละเอียด",
			onClick: handleView,
		},
		{
			key: "edit",
			label: "แก้ไข",
			onClick: handleEdit,
		},
	];

	const formSections: FormSection[] = [
		{
			fields: [
				{
					type: "text",
					name: "fullname",
					label: "Full Name",
					isRequired: true,
				},
				{
					type: "text",
					name: "email",
					label: "Email",
					isRequired: true,
				},
				{
					type: "text",
					name: "phone",
					label: "Phone",
					isRequired: true,
				},
				{
					type: "number",
					name: "unit",
					label: "Unit",
					isRequired: true,
				},
				{
					type: "text",
					name: "status",
					label: "Status",
					isRequired: true,
				},
			],
		},
	];

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		console.log("Submit the form");
	};

	const handleCancel = () => {
		console.log("Cancel the form");
	};

	return (
		<div>
			<DrawerComponent isOpen={isOpenView} onClose={onCloseView}>
				<div>
					<Header title="View User" subtitle="User details" />

					<div className="flex flex-col gap-2">
						{Object.keys(mockData).map((key) => {
							let value = (mockData as any)[key];
							if (value === undefined || value === null) {
								return null;
							}

							if (value instanceof Date) {
								value = value.toLocaleString();
							}
							if (typeof value === "boolean") {
								value = value.toString();
							}

							return (
								<div
									key={key}
									className="flex flex-row items-center"
								>
									<div className="w-1/3">{key}</div>
									<div className="w-2/3">: {value}</div>
								</div>
							);
						})}
					</div>
				</div>
			</DrawerComponent>

			<DrawerComponent isOpen={isOpenEdit} onClose={onCloseEdit}>
				<div className="flex flex-col gap-4">
					<FormComponent
						sections={formSections}
						title="Edit User"
						subtitle="Edit user details"
						onSubmit={handleSubmit}
						onCancel={handleCancel}
					/>
				</div>
			</DrawerComponent>

			<div className="flex flex-col gap-4">
				<Dropdown>
					<DropdownTrigger>
						<Button
							size="lg"
							variant="flat"
							color="primary"
							radius="sm"
							endContent={<VerticalDotsIcon />}
						>
							<span className="text-lg font-medium">
								Open actions menu
							</span>
						</Button>
					</DropdownTrigger>

					<DropdownMenu>
						{actions.map((action) => (
							<DropdownItem
								key={action.key}
								onClick={() =>
									action.onClick && action.onClick()
								}
							>
								{action.label}
							</DropdownItem>
						))}
					</DropdownMenu>
				</Dropdown>
			</div>
		</div>
	);
}
