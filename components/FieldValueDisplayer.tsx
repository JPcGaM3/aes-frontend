"use client";

import React from "react";
import { Divider } from "@heroui/react";
import type { FieldValueDisplayerProps } from "@/interfaces/props";
import { translateEnumValue } from "@/utils/functions";

export default function FieldValueDisplayer({
  className = "flex flex-col w-full max-w-sm gap-4 sm:max-w-md md:max-w-lg lg:max-w-xl",
  sections,
}: FieldValueDisplayerProps) {
  return (
    <div className={className}>
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
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-x-1 gap-y-2">
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
                
                <span className="text-sm text-gray-800 break-all">
                  :{" "}
                  {(() => {
                    let displayValue =
                      typeof field.value === "string" && field.translator
                        ? translateEnumValue(field.value, field.translator)
                        : field.value;
                    if (
                      typeof displayValue === "string" &&
                      (displayValue.length > 20 || displayValue.includes("\n"))
                    ) {
                      displayValue = displayValue.slice(0, 20) + "...";
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
