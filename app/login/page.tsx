"use client";

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
  };

  return (
    <div className="flex justify-center min-h-screen">
      <div className="min-w-[400px]">
        <FormComponent
          fields={fields}
          subtitle="Please enter your credentials."
          title="Login"
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}

export default LoginPage;
