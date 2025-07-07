"use client";

import React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { FormSection } from "@/interfaces/interfaces";
import { AlertComponentProps } from "@/interfaces/props";

import { useAuth } from "@/providers/AuthContext";
import { useLoading } from "@/providers/LoadingContext";

import FormComponent from "@/components/FormComponent";
import AlertComponent from "@/components/AlertComponent";

import { LoginParams } from "@/libs/userAPI";

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

      await login({
        params: {
          username: values.username,
          password: values.password,
          ae_area_id: values.ae_id,
        } as LoginParams,
      });

      router.push("/home");
    } catch (err: any) {
      setAlert({
        title: "Login Failed",
        description: err.message || "Unknown error occurred",
        color: "danger",
        isVisible: true,
      });
      setIsLoading(false);
    }
  };

  const sections: FormSection[] = [
    {
      fields: [
        {
          type: "text",
          name: "username",
          label: "ชื่อผู้ใช้งาน",
          isRequired: true,
        },
        {
          type: "password",
          name: "password",
          label: "รหัสผ่าน",
          isRequired: true,
        },
        {
          type: "dropdown",
          name: "ae_id",
          label: "พื้นที่ปฏิบัติงาน",
          isRequired: true,
          options: [
            { label: "CT0", value: 1 },
            { label: "NE1", value: 2 },
            { label: "NE2", value: 3 },
          ],
        },
      ],
    },
  ];

  return (
    <div className="flex justify-center items-center w-full">
      <FormComponent
        isCompact={true}
        sections={sections}
        title="ยินดีต้อนรับ"
        subtitle="กรุณาระบุตัวตนเพื่อเข้าใช้งาน"
        submitLabel="ยืนยัน"
        onSubmit={handleSubmit}
      />

      {/* Alert */}
      {alert.isVisible && (
        <AlertComponent
          isCompact={true}
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
