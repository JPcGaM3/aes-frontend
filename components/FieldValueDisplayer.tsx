"use client";

import React from "react";
import { Divider } from "@heroui/react";
import clsx from "clsx";
import { fontMono } from "@/config/fonts";
import type {
	FieldValue,
	FieldSection,
	FieldValueDisplayerProps,
} from "@/interfaces/props";

export default function FieldValueDisplayer({
	className = "flex flex-col gap-3 w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl",
	sections,
}: FieldValueDisplayerProps) {
	return (
		<div className={className}>
			{sections.map((section, idx) => (
				<div key={idx} className="flex flex-col gap-2 w-full">
					{/* Title ----------------------------------------------------------------------------------------------------------------------- */}
					{section.title && (
						<div className="flex items-center gap-5 w-full">
							<span className="font-semibold text-lg text-primary">
								{section.title}
							</span>

							<Divider className="flex-1 bg-primary w-full" />
						</div>
					)}

					{/* Fields ---------------------------------------------------------------------------------------------------------------------- */}
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-x-1 gap-y-2">
						{section.fields.map((field, i) => (
							<div
								key={i}
								className={`flex items-start gap-2 ${field.className || ""}`}
							>
								<span
									className={`text-sm font-semibold min-w-[80px] ${field.highlight ? "text-blue-600" : ""}`}
								>
									{field.label}
								</span>
								<span className="text-gray-800 break-all text-sm">
									: {field.value}
								</span>
							</div>
						))}
					</div>
				</div>
			))}
		</div>
	);
}
