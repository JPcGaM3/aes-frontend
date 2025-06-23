"use client";

import React from "react";

import FormComponent from "@/components/FormComponent";
import { useAuth } from "@/providers/AuthContext";
import { FormField } from "@/interfaces/interfaces";
import { useRouter } from "next/navigation";
import { useLoading } from "@/providers/LoadingContext";
import { Button } from "@heroui/button";
import { useDisclosure } from "@heroui/react";
import { AlertModal } from "@/components/AlertModal";

export default function LoginPage() {
  const router = useRouter();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { userContext, login, logout } = useAuth();
  const { setIsLoading } = useLoading();

  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      setIsLoading(true);
      await login(username, password);
      router.push("/");
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 300);
    }
  };

  const handleLogout = () => {
    onOpen();
  };

  const handleConfirmLogout = () => {
    logout();
    console.log("User logged out : ", userContext);
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
      <div className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl px-2 sm:px-4 md:px-8">
        <AlertModal
          isOpen={isOpen}
          onClose={onClose}
          title="Logout"
          message="Are you sure you want to logout?"
          confirmText="Yes"
          cancelText="No"
          onConfirm={handleConfirmLogout}
        />

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

        <Button
          variant="bordered"
          radius="sm"
          className="w-full mt-4"
          onPress={() => handleLogout()}
        >
          Logout
        </Button>

        {error && <div className="text-red-500 mb-2 pt-4">{error}</div>}
      </div>
    </div>
  );
}
