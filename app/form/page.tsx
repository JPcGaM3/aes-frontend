"use client";

import React from "react";
import FormComponent from "@/components/FormComponent";
import { RequestOrderInputFieldTranslation } from "@/utils/constants";
import { RequestOrderInputField } from "@/utils/enum";
import { FormField } from "@/interfaces/interfaces";

const fields: FormField[] = [
  [
    {
      type: "dropdown",
      name: RequestOrderInputField.CustomerType,
      label: RequestOrderInputFieldTranslation.customer_type,
      options: [
        { label: "Option 1", value: "option1" },
        { label: "Option 2", value: "option2" },
      ],
    },
    {
      type: "dropdown",
      name: RequestOrderInputField.Affiliation,
      label: RequestOrderInputFieldTranslation.affiliation,
      options: [
        { label: "Option 1", value: "option1" },
        { label: "Option 2", value: "option2" },
      ],
    },
    {
      type: "dropdown",
      name: RequestOrderInputField.Unit,
      label: RequestOrderInputFieldTranslation.unit,
      options: [
        { label: "Option 1", value: "option1" },
        { label: "Option 2", value: "option2" },
      ],
    },
  ],
  {
    type: "number",
    name: RequestOrderInputField.Quota,
    label: RequestOrderInputFieldTranslation.quota,
    min: 0,
  },
  {
    type: "text",
    name: RequestOrderInputField.Name,
    label: RequestOrderInputFieldTranslation.name,
  },
  {
    type: "number",
    name: RequestOrderInputField.LandNumber,
    label: RequestOrderInputFieldTranslation.land_number,
  },
  {
    type: "text",
    name: RequestOrderInputField.LocationName,
    label: RequestOrderInputFieldTranslation.location_name,
  },
  [
    {
      type: "text",
      name: RequestOrderInputField.Lattitude,
      label: RequestOrderInputFieldTranslation.lattitude,
    },
    {
      type: "text",
      name: RequestOrderInputField.Longitude,
      label: RequestOrderInputFieldTranslation.longitude,
    },
  ],
  {
    type: "text",
    name: RequestOrderInputField.Supervisor,
    label: RequestOrderInputFieldTranslation.supervisor,
  },
];

function FormPage() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submit the form");
  };

  const handleCancel = () => {
    console.log("Cancel the form");
  };

  return (
    <div className="min-w-[400px]">
      <FormComponent
        title="Request Order Form"
        subtitle="Please fill out the form below."
        fields={fields}
        onCancel={handleCancel}
        onSubmit={handleSubmit}
      />
    </div>
  );
}

export default FormPage;
