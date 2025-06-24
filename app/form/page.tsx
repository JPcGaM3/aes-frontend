"use client";

import React from "react";

import FormComponent from "@/components/FormComponent";
import { RequestOrderTranslation } from "@/utils/constants";
import { RequestOrderInputField } from "@/utils/enum";
import { FormField } from "@/interfaces/interfaces";

export default function FormPage() {
  const fields: FormField[] = [
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
    {
      type: "date",
      name: "dateField",
      label: "Date Field",
      isRequired: true,
    },
    {
      type: "date-range",
      name: "dateRangeField",
      label: "Date Range Field",
      isRequired: true,
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
      <FormComponent
        fields={fields}
        subtitle="Please fill out the form below."
        title="Request Order Form"
        onCancel={handleCancel}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
