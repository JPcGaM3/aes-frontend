"use client";

import React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { FormField } from "@/interfaces/interfaces";

import { useAuth } from "@/providers/AuthContext";
import { useLoading } from "@/providers/LoadingContext";

import FormComponent from "@/components/FormComponent";
import AlertComponent, { AlertComponentProps } from "@/components/AlertComponent";

export default function LoginPage() {
  const router = useRouter();

  const { login } = useAuth();
  const { setIsLoading } = useLoading();

  const [alert, setAlert] = useState<AlertComponentProps>({
    title: "",
    description: "",
    isVisible: false,
  });

  const handleSubmit = async (values: any) => {
    try {
      setIsLoading(true);
      await login(values.username, values.password);
      router.push("/home");
    } catch (err: any) {
      setIsLoading(false);
      setAlert({
        title: "Login Failed",
        description: err.message || "Unknown error occurred",
        color: "danger",
        isVisible: true,
      });
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
    <div className="flex justify-center w-full items-center">
        <FormComponent
          fields={fields}
          title="ยินดีต้อนรับ"
          subtitle="กรุณาระบุตัวตนเพื่อเข้าใช้งาน"
          submitLabel="ยืนยัน"
          onSubmit={handleSubmit}
        />

        {/* Alert */}
        {alert.isVisible && (
          <AlertComponent
            title={alert.title}
            description={alert.description}
            color={alert.color}
            isVisible={alert.isVisible}
            handleClose={() => setAlert({ ...alert, isVisible: false })}
          />
        )}
    </div>
  );
}
