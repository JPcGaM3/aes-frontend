"use client";

import React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { FormField } from "@/interfaces/interfaces";

import { useAuth } from "@/providers/AuthContext";
import { useLoading } from "@/providers/LoadingContext";

import FormComponent from "@/components/FormComponent";
import AlertComponent, {
  AlertComponentProps,
} from "@/components/AlertComponent";

import { getOperationAreas } from "@/libs/operationAreaAPI";
import { LoginParams } from "@/libs/userAPI";

export default function LoginPage() {
  const router = useRouter();

  const { login } = useAuth();
  const { setIsLoading } = useLoading();

  const [operationAreas, setOperationAreas] = useState<any[]>([]);
  const [alert, setAlert] = useState<AlertComponentProps>({
    title: "",
    description: "",
    isVisible: false,
  });

  // Fetch operation areas on mount
  useEffect(() => {
    const fetchOperationAreas = async () => {
      try {
        const data = await getOperationAreas({ paramData: {}, });
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

      const selectedArea = operationAreas.find(
        (area) => String(area.id) === String(values.operation_area_id)
      );
      const ae_id = selectedArea?.ae_id || null;

      await login({
        params: {
          username: values.username,
          password: values.password,
          ae_id,
          operation_area_id: values.operation_area_id,
        } as LoginParams,
      });

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
    {
      type: "dropdown",
      name: "operation_area_id",
      label: "พื้นที่ปฏิบัติงาน",
      isRequired: true,
      options: operationAreas.map((area) => ({
        value: String(area.id),
        label: `${area.operation_area} (${area.ae_area?.name || "-"})`,
      })),
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
