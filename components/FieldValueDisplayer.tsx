"use client";

import type { FieldValueDisplayerProps } from "@/interfaces/props";

import React from "react";
import { Divider } from "@heroui/react";

import { translateEnumValue } from "@/utils/functions";

export default function FieldValueDisplayer({
	size = "compact",
	sections,
	className = "flex flex-col w-full gap-4",
}: FieldValueDisplayerProps) {
	let computedClassName = "";

	if (size === "compact") {
		computedClassName = "w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl";
	} else if (size === "expanded") {
		computedClassName = "w-full max-w-sm sm:max-w-lg md:max-w-2xl lg:max-w-4xl";
	} else {
		computedClassName = "w-full";
	}

	return (
		<div className={`${computedClassName} ${className}`}>
			{sections.map((section, idx) => (
				<div key={idx} className="flex flex-col w-full gap-2">
					{/* Title ----------------------------------------------------------------------------------------------------------------------- */}
					{section.title && (
						<div className="flex items-center w-full gap-5">
							<span className="text-lg font-semibold text-primary">
								{section.title}
							</span>

							<Divider className="flex-1 w-full bg-primary" />
						</div>
					)}

					{/* Fields ---------------------------------------------------------------------------------------------------------------------- */}
					<div className="grid w-full grid-cols-[repeat(auto-fit,minmax(400px,1fr))] gap-x-1 gap-y-2">
						{section.fields.map((field, i) => (
							<div
								key={i}
								className={`flex items-start gap-2 ${field.className || ""}`}
							>
								<span
									className={`text-sm font-semibold min-w-[100px] ${field.highlight ? "text-blue-600" : ""}`}
								>
									{(() => {
										let displayLabel =
											typeof field.name === "string" && field.labelTranslator
												? translateEnumValue(field.name, field.labelTranslator)
												: field.name;

										return displayLabel;
									})()}
								</span>

								<span className="text-sm text-gray-800 break-all">
									:{" "}
									{(() => {
										let displayValue =
											typeof field.value === "string" && field.translator
												? translateEnumValue(field.value, field.translator)
												: field.value;

										if (
											typeof displayValue === "string" &&
											(displayValue.length > 30 || displayValue.includes("\n"))
										) {
											displayValue = displayValue.slice(0, 30) + "...";
										}

										return displayValue;
									})()}
								</span>
							</div>
						))}
					</div>
				</div>
			))}
		</div>
	);
}
