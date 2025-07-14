import React from "react";
import { AutocompleteItem } from "@heroui/react";

import { PatchedAutocomplete } from "./components/PatchedAutocomplete";

export default function TestAutocomplete() {
	const options = [
		{ value: "1", label: "January" },
		{ value: "2", label: "February" },
		{ value: "3", label: "March" },
		{ value: "4", label: "April" },
		{ value: "5", label: "May" },
		{ value: "6", label: "June" },
	];

	return (
		<div className="max-w-md p-8">
			<h2 className="mb-4 text-xl font-bold">PatchedAutocomplete Test</h2>

			<PatchedAutocomplete
				classNames={{
					label: "min-w-[100px] p-0 text-start",
					mainWrapper: "w-full min-w-0",
					base: "min-w-0",
					popoverContent: "rounded-lg p-0",
				}}
				label="เดือนปฏิบัติงาน"
				labelPlacement="outside-left"
				placeholder="โปรดเลือก เดือนปฏิบัติงาน"
			>
				{options.map((option) => (
					<AutocompleteItem key={option.value}>{option.label}</AutocompleteItem>
				))}
			</PatchedAutocomplete>
		</div>
	);
}
