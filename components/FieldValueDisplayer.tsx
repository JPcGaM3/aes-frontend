"use client";

import React from "react";
import { Divider } from "@heroui/react";

export interface FieldValue {
  label: string;
  value: React.ReactNode;
  highlight?: boolean;
  className?: string;
}

export interface FieldSection {
  title?: string;
  fields: FieldValue[];
}

export interface FieldValueDisplayerProps {
  className?: string;
  sections: FieldSection[];
}

export default function FieldValueDisplayer({
  className = "flex flex-col gap-3 w-full",
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

              <Divider className="flex-1 bg-primary h-[1.5px] w-full" />
            </div>
          )}

          {/* Fields ---------------------------------------------------------------------------------------------------------------------- */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 tracking-normal">
            {section.fields.map((field, i) => (
              <div
                key={i}
                className={`flex items-start gap-2 ${field.className || ""}`}
              >
                <span
                  className={`text-sm font-medium min-w-[80px] ${field.highlight ? "text-blue-600" : ""}`}
                >
                  {field.label}
                </span>
                <span className="text-gray-900 break-all text-sm">{field.value}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
