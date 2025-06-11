"use client"

import React from "react";
import FormComponent from "@/components/FormComponent";
import { FormField } from "@/interfaces/interfaces";

const fields: FormField[] = [
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
];

function LoginPage() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login form submitted");
  };

  return (
    <div className="min-w-[400px]">
      <FormComponent
        title="Login"
        subtitle="Please enter your credentials."
        fields={fields}
        onSubmit={handleSubmit}
      />
    </div>
  );
}

export default LoginPage;
