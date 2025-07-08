"use client";

import React from "react";
import { Divider } from "@heroui/react";
import type { FieldValueDisplayerProps } from "@/interfaces/props";
import { translateEnumValue } from "@/utils/functions";

export default function FieldValueDisplayer({
	className = "flex flex-col w-full gap-4",
	sections,
}: FieldValueDisplayerProps) {
	return (
		<div className={className}>
			{sections.map((section, idx) => (
				<div key={idx} className="flex flex-col gap-2 w-full">
					{/* Title ----------------------------------------------------------------------------------------------------------------------- */}
					{section.title && (
						<div className="flex items-center gap-5 w-full">
							<span className="font-semibold text-primary text-lg">
								{section.title}
							</span>

							<Divider className="flex-1 bg-primary w-full" />
						</div>
					)}

					{/* Fields ---------------------------------------------------------------------------------------------------------------------- */}
					<div className="gap-x-1 gap-y-2 grid grid-cols-[repeat(auto-fit,minmax(400px,1fr))] w-full">
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

								<span className="text-gray-800 text-sm break-all">
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
