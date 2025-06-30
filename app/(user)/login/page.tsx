"use client";

import React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { FormField } from "@/interfaces/interfaces";

import { useAuth } from "@/providers/AuthContext";
import { useLoading } from "@/providers/LoadingContext";

import FormComponent from "@/components/FormComponent";

export default function LoginPage() {
  const router = useRouter();

  const { login } = useAuth();
  const { setIsLoading } = useLoading();

  const [error, setError] = useState("");

  const handleSubmit = async (values: any) => {
    setError("");

    try {
      setIsLoading(true);
      await login(values.username, values.password);
      router.push("/");
    } catch (err: any) {
      setIsLoading(false);
      setError(err.message || "Login failed");
    }
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
    <div className="flex justify-center">
      <div className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl px-2 sm:px-4 md:px-8">
        <FormComponent
          fields={fields}
          title="ยินดีต้อนรับ"
          subtitle="กรุณาระบุตัวตนเพื่อเข้าใช้งาน"
          submitLabel="ยืนยัน"
          onSubmit={handleSubmit}
        />

        {error && <div className="text-red-500 mb-2 pt-4">{error}</div>}
      </div>
    </div>
  );
}
