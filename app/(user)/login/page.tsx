"use client";

import React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { FormField } from "@/interfaces/interfaces";
import { AlertComponentProps } from "@/interfaces/props";

import { useAuth } from "@/providers/AuthContext";
import { useLoading } from "@/providers/LoadingContext";

import FormComponent from "@/components/FormComponent";
import AlertComponent from "@/components/AlertComponent";

import { getOperationAreas } from "@/libs/operationAreaAPI";
import { LoginParams } from "@/libs/userAPI";
import { OperationArea } from "@/interfaces/schema";

export default function LoginPage() {
  const router = useRouter();

  const { login } = useAuth();
  const { setIsLoading } = useLoading();

  const [operationAreas, setOperationAreas] = useState<OperationArea[]>([]);
  const [alert, setAlert] = useState<AlertComponentProps>({
    title: "",
    description: "",
    isVisible: false,
  });

  // TODO: core fetch function
  useEffect(() => {
    const fetchOperationAreas = async () => {
      try {
        const data = await getOperationAreas({ paramData: {} });
        setOperationAreas(data || []);
      } catch (err: any) {
        setAlert({
          title: "โหลดข้อมูลพื้นที่ปฏิบัติงานล้มเหลว",
          description: err.message || "Unknown error occurred",
          color: "danger",
          isVisible: true,
        });
      }
    };

    fetchOperationAreas();
  }, []);

  const handleSubmit = async (values: any) => {
    try {
      setIsLoading(true);

      await login({
        params: {
          username: values.username,
          password: values.password,
        } as LoginParams,
        operationAreaId: Number(values.operation_area_id),
      });

      router.push("/home");
    } catch (err: any) {
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
    {
      type: "dropdown",
      name: "operation_area_id",
      label: "พื้นที่ปฏิบัติงาน",
      isRequired: true,
      options: operationAreas.map((area: OperationArea) => ({
        value: area.id,
        label: `${area.operation_area} (${area.ae_area?.name || "-"})`,
      })),
    },
  ];

  return (
    <div className="flex items-center justify-center w-full">
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
