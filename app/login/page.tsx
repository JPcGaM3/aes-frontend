"use client";

import React, { useState } from "react";

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
  const { login, logout } = useAuth();
  const { setIsLoading } = useLoading();

  const [error, setError] = useState("");

  const handleSubmit = async (values: any) => {
    setError("");

    try {
      setIsLoading(true);
      await login(values.username, values.password);
      router.push("/");
    } catch (err: any) {
      setError(err.message || "Login failed");
    }
  };

  const handleLogout = () => {
    onOpen();
  };

  const handleConfirmLogout = () => {
    setIsLoading(true);
    
    logout();
    onClose();

    router.push("/");
  };

  const fields: FormField[] = [
    {
      type: "text",
      name: "username",
      label: "ชื่อผู้ใช้งาน / อีเมล",
      isRequired: true,
    },
    {
      type: "password",
      name: "password",
      label: "รหัสผ่าน",
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
          title="ยินดีต้อนรับ"
          subtitle="กรุณาระบุตัวตนเพื่อเข้าใช้งาน"
          submitLabel="ยืนยัน"
          onSubmit={handleSubmit}
        />

        <Button
          variant="bordered"
          radius="sm"
          className="w-full mt-4 font-semibold"
          onPress={() => handleLogout()}
        >
          ออกจากระบบ
        </Button>

        {error && <div className="text-red-500 mb-2 pt-4">{error}</div>}
      </div>
    </div>
  );
}
