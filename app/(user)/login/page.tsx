"use client";

import React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { FormField, FormSection } from "@/interfaces/interfaces";
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
  // useEffect(() => {
  //   const fetchOperationAreas = async () => {
  //     try {
  //       const data = await getOperationAreas({ paramData: {} });
  //       setOperationAreas(data || []);
  //     } catch (err: any) {
  //       setAlert({
  //         title: "โหลดข้อมูลพื้นที่ปฏิบัติงานล้มเหลว",
  //         description: err.message || "Unknown error occurred",
  //         color: "danger",
  //         isVisible: true,
  //       });
  //     }
  //   };

  //   fetchOperationAreas();
  // }, []);

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

  const sections: FormSection[] = [
    {
      fields: [
        {
          type: "text",
          name: "username",
          isRequired: true,
        },
        {
          type: "password",
          name: "password",
          isRequired: true,
        },
        {
          type: "dropdown",
          name: "operation_area_id",
          isRequired: true,
          // options: operationAreas.map((area: OperationArea) => ({
          //   value: area.id,
          //   label: `${area.operation_area} (${area.ae_area?.name || "-"})`,
          // })),
          options: [
            { value: 1, label: "พื้นที่ปฏิบัติงาน 1 (AE Area 1)" },
            { value: 2, label: "พื้นที่ปฏิบัติงาน 2 (AE Area 2)" },
            { value: 3, label: "พื้นที่ปฏิบัติงาน 3 (AE Area 3)" },
          ]
        },
      ],
    },
  ];

  return (
    <div className="flex items-center justify-center w-full">
      <FormComponent
        sections={sections}
        title="ยินดีต้อนรับ"
        subtitle="กรุณาระบุตัวตนเพื่อเข้าใช้งาน"
        submitLabel="ยืนยัน"
        onSubmit={handleSubmit}
        // values={{ username: "L.Kritsada", password: "Ad#F5C2v66", operation_area_id: 3 }}
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
