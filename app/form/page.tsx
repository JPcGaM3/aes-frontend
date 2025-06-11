"use client";

import React from "react";
import FormComponent, { FormField } from "@/components/FormComponent";
import { RequestOrderInputFieldTranslation } from "@/utils/constants";

const fields: FormField[] = [
  [
    {
      type: "dropdown",
      name: "customer_type",
      label: RequestOrderInputFieldTranslation.customer_type,
      options: [
        { label: "Option 1", value: "option1" },
        { label: "Option 2", value: "option2" },
      ],
    },
    {
      type: "dropdown",
      name: "affiliation",
      label: RequestOrderInputFieldTranslation.affiliation,
      options: [
        { label: "Option 1", value: "option1" },
        { label: "Option 2", value: "option2" },
      ],
    },
    {
      type: "dropdown",
      name: "unit",
      label: RequestOrderInputFieldTranslation.unit,
      options: [
        { label: "Option 1", value: "option1" },
        { label: "Option 2", value: "option2" },
      ],
    },
  ],
  {
    type: "number",
    name: "quota",
    label: RequestOrderInputFieldTranslation.quota,
    min: 0,
  },
  {
    type: "text",
    name: "name",
    label: RequestOrderInputFieldTranslation.name,
  },
  {
    type: "number",
    name: "land_num",
    label: RequestOrderInputFieldTranslation.land_number,
  },
  {
    type: "text",
    name: "location_name",
    label: RequestOrderInputFieldTranslation.location_name,
  },
  [
    {
      type: "text",
      name: "lattitude",
      label: RequestOrderInputFieldTranslation.lattitude,
    },
    {
      type: "text",
      name: "longitude",
      label: RequestOrderInputFieldTranslation.longitude,
    },
  ],
  {
    type: "text",
    name: "supervisor",
    label: RequestOrderInputFieldTranslation.supervisor,
  },
];

function FormPage() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submit the form");
  };

  return <FormComponent fields={fields} onSubmit={handleSubmit} />;
}

export default FormPage;
