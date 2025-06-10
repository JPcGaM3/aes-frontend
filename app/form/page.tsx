// import FormComponent from "@/components/FormComponent";

// function Form() {
//   return (
//     <div className="flex flex-col gap-8">
//       <FormComponent
//         headers={[
//           ["firstname", "lastname"],
//           "username",
//           "password",
//           "confirm password",
//           "address",
//           "city",
//           "state",
//           "phone",
//           "email",
//         ]}
//       />
//     </div>
//   );
// }

// export default Form;

"use client";

import React from "react";
import FormComponent, { FormField } from "@/components/FormComponent";

const fields: FormField[] = [
  [
    {
      type: "text",
      name: "firstname",
      label: "First Name",
      isRequired: true,
    },
    {
      type: "text",
      name: "lastname",
      label: "Last Name",
      isRequired: true,
    },
  ],
  {
    type: "text",
    name: "username",
    label: "Username",
    isRequired: true,
  },
  {
    type: "password",
    name: "password",
    label: "Password",
    isRequired: true,
  },
  {
    type: "password",
    name: "confirm_password",
    label: "Confirm Password",
    isRequired: true,
  },
  {
    type: "email",
    name: "email",
    label: "Email",
    isRequired: true,
  },
  {
    type: "number",
    name: "age",
    label: "Age",
    isRequired: true,
    min: 0,
    max: 120,
  },
  {
    type: "dropdown",
    name: "country",
    label: "Country",
    isRequired: true,
    options: [
      { value: "us", label: "United States" },
      { value: "ca", label: "Canada" },
      { value: "uk", label: "United Kingdom" },
      { value: "au", label: "Australia" },
    ],
    selectionMode: "single",
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
