"use client";

import React, { useState } from "react";
import { Form, Input, Button } from "@heroui/react";

import FormComponent from "@/components/FormComponent";
import { FormSection } from "@/interfaces/interfaces";

export default function FormPage() {
	const [action, setAction] = useState<any>(null);

	const sections: FormSection[] = [
		{
			fields: [
				{
					type: "text",
					name: "textField",
					label: "Text Field",
					isRequired: true,
				},
				{
					type: "email",
					name: "emailField",
					label: "Email Field",
					isRequired: true,
				},
				{
					type: "password",
					name: "passwordField",
					label: "Password Field",
					isRequired: true,
				},
				{
					type: "password",
					name: "confirmPasswordField",
					label: "Confirm Password Field",
					isRequired: true,
				},
				{
					type: "number",
					name: "numberField",
					label: "Number Field",
					min: 0,
					max: 100,
					isRequired: true,
				},
				{
					type: "dropdown",
					name: "dropdownField",
					label: "Dropdown Field",
					isRequired: true,
					options: [
						{ label: "Option 1", value: "option1" },
						{ label: "Option 2", value: "option2" },
					],
				},
				[
					{
						type: "date",
						name: "dateFieldStart",
						isRequired: true,
					},
					{
						type: "date",
						name: "dateFieldEnd",
						isRequired: true,
					},
				],
				{
					type: "date-range",
					name: "dateRangeField",
					label: "Date Range Field",
					isRequired: true,
				},
			],
		},
	];

	const handleSubmit = (values: any) => {
		setAction(`submit ${JSON.stringify(values)}`);
	};

	const handleCancel = () => {
		setAction("cancel");
	};

	return (
		<div className="flex flex-col items-center justify-center gap-20">
			<FormComponent
				cancelLabel="Cancel"
				sections={sections}
				size="compact"
				submitLabel="Submit"
				subtitle="Please fill out the form below."
				title="Request Order Form"
				onCancel={handleCancel}
				onChange={(changed: any) => {
					const loggedValues = { ...changed };

					if (loggedValues.dateField) {
						loggedValues.dateField =
							loggedValues.dateField.toString();
					}
					if (loggedValues.dateRangeField) {
						loggedValues.dateRangeField = {
							start: loggedValues.dateRangeField.start?.toString(),
							end: loggedValues.dateRangeField.end?.toString(),
						};
					}
				}}
				onSubmit={handleSubmit}
			/>
			<FormComponent
				cancelLabel="Cancel"
				sections={sections}
				size="expanded"
				submitLabel="Submit"
				subtitle="Please fill out the form below."
				title="Request Order Form"
				onCancel={handleCancel}
				onChange={(changed: any) => {
					const loggedValues = { ...changed };

					if (loggedValues.dateField) {
						loggedValues.dateField =
							loggedValues.dateField.toString();
					}
					if (loggedValues.dateRangeField) {
						loggedValues.dateRangeField = {
							start: loggedValues.dateRangeField.start?.toString(),
							end: loggedValues.dateRangeField.end?.toString(),
						};
					}
				}}
				onSubmit={handleSubmit}
			/>

			{action && (
				<div className="text-small text-default-500">
					Action: <code>{action}</code>
				</div>
			)}

			<Form
				className="flex flex-col w-full max-w-xs gap-4"
				onReset={() => setAction("reset")}
				onSubmit={(e) => {
					e.preventDefault();
					let data = Object.fromEntries(
						new FormData(e.currentTarget)
					);

					setAction(`submit ${JSON.stringify(data)}`);
				}}
			>
				<Input
					errorMessage="Please enter a valid username"
					isRequired={true}
					label="Username"
					labelPlacement="outside"
					name="username"
					placeholder="Enter your username"
					type="text"
				/>

				<Input
					errorMessage="Please enter a valid email"
					isRequired={true}
					label="Email"
					labelPlacement="outside"
					name="email"
					placeholder="Enter your email"
					type="email"
				/>
				<div className="flex gap-2">
					<Button color="primary" type="submit">
						Submit
					</Button>
					<Button type="reset" variant="flat">
						Reset
					</Button>
				</div>
				{action && (
					<div className="text-small text-default-500">
						Action: <code>{action}</code>
					</div>
				)}
			</Form>
		</div>
	);
}
