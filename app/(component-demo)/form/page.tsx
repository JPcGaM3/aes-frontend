"use client";

import React from "react";

import FormComponent from "@/components/FormComponent";
import { FormSection } from "@/interfaces/interfaces";

export default function FormPage() {
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

	const handleSubmit = () => {};

	const handleCancel = () => {};

	return (
		<div className="flex flex-col items-center justify-center gap-20">
			<FormComponent
				sections={sections}
				subtitle="Please fill out the form below."
				title="Request Order Form"
				onCancel={handleCancel}
				onChange={(changed: any) => {
					const loggedValues = { ...changed };

					if (loggedValues.dateField) {
						loggedValues.dateField = loggedValues.dateField.toString();
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
				isCompact
				sections={sections}
				subtitle="Please fill out the form below."
				title="Request Order Form"
				onCancel={handleCancel}
				onChange={(changed: any) => {
					const loggedValues = { ...changed };

					if (loggedValues.dateField) {
						loggedValues.dateField = loggedValues.dateField.toString();
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
		</div>
	);
}
