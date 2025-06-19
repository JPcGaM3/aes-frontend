"use client";

import React from "react";

import FormComponent from "@/components/FormComponent";
import { useAuth } from "@/providers/AuthContext";
import { FormField } from "@/interfaces/interfaces";

function LoginPage() {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const { user, login } = useAuth();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await login(username, password);
      console.log("Login successful : ", user);
    } catch (err: any) {
      setError(err.message || "Login failed");
    }
  };

  const fields: FormField[] = [
    {
      type: "text",
      name: "username",
      label: "Username / Email",
      isRequired: true,
    },
    {
      type: "password",
      name: "password",
      label: "Password",
      isRequired: true,
    },
  ];

  return (
    <div className="flex justify-center min-h-screen">
      <div className="min-w-[400px]">
        <FormComponent
          fields={fields}
          subtitle="Please enter your credentials."
          title="Login"
          onSubmit={handleSubmit}
          onValueChange={(name, value) => {
            if (name === "username") setUsername(value);
            if (name === "password") setPassword(value);
          }}
        />

        {error && <div className="text-red-500 mb-2 pt-2">{error}</div>}
      </div>
    </div>
  );
}

export default LoginPage;
