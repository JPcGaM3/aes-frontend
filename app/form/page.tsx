"use client";

import React from "react";

import FormComponent from "@/components/FormComponent";
import { RequestOrderTranslation } from "@/utils/constants";
import { RequestOrderInputField } from "@/utils/enum";
import { FormField } from "@/interfaces/interfaces";

export default function FormPage() {
  const fields: FormField[] = [
    [
      {
        type: "dropdown",
        name: RequestOrderInputField.CustomerType,
        label: RequestOrderTranslation.customer_type,
        options: [
          { label: "Option 1", value: "option1" },
          { label: "Option 2", value: "option2" },
        ],
      },
      {
        type: "dropdown",
        name: RequestOrderInputField.Affiliation,
        label: RequestOrderTranslation.affiliation,
        options: [
          { label: "Option 1", value: "option1" },
          { label: "Option 2", value: "option2" },
        ],
      },
      {
        type: "dropdown",
        name: RequestOrderInputField.Unit,
        label: RequestOrderTranslation.unit,
        options: [
          { label: "Option 1", value: "option1" },
          { label: "Option 2", value: "option2" },
        ],
      },
    ],
    {
      type: "number",
      name: RequestOrderInputField.Quota,
      label: RequestOrderTranslation.quota_number,
      min: 0,
    },
    {
      type: "text",
      name: RequestOrderInputField.Name,
      label: RequestOrderTranslation.farm_name,
    },
    {
      type: "number",
      name: RequestOrderInputField.LandNumber,
      label: RequestOrderTranslation.land_number,
    },
    {
      type: "text",
      name: RequestOrderInputField.LocationName,
      label: RequestOrderTranslation.location_id,
    },
    {
      type: "text",
      name: RequestOrderInputField.Supervisor,
      label: RequestOrderTranslation.supervisor_id,
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
    <div className="flex justify-center min-h-screen">
      <div className="min-w-[400px]">
        <FormComponent
          fields={fields}
          subtitle="Please fill out the form below."
          title="Request Order Form"
          onCancel={handleCancel}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
