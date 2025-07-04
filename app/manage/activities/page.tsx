"use client";

import TableComponent from "@/app/(component-demo)/table/page";
import CardComponent from "@/components/CardComponent";
import { FieldConfig, TableHeader } from "@/interfaces/interfaces";
import { getActivities } from "@/libs/activityAPI";
import { getCars } from "@/libs/carAPI";
import { useAuth } from "@/providers/AuthContext";
import { useLoading } from "@/providers/LoadingContext";
import { DeleteIcon, EditIcon, InfoIcon, RejectIcon } from "@/utils/icons";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

export default function ManageCarsPage() {
  const { setIsLoading } = useLoading();
  const { userContext } = useAuth();
  const [activities, setActivities] = useState<any[]>([]);
  // const router = useRouter();

  const handleActions = ({
    params,
  }: {
    params: {
      action: string;
      id?: number;
    };
  }) => {
    setIsLoading(true);

    switch (params.action) {
      case "view":
      case "edit":
        console.log(`Action triggered: ${params.action} ${params.id}`);
        setIsLoading(false);
        // router.push(`/manage/cars/${params.id}?action=${params.action}`);
        break;
      case "reject":
      case "add":
        console.log(`Action triggered: ${params.action}`);
        // router.push("/manage/cars/add");
        break;
      case "delete":
        console.log(`Action triggered: ${params.action} ${params.id}`);
        setIsLoading(false);
        // router.push("/manage/cars/delete");
        break;

      default:
        console.log(`Action triggered: ${params.action}`);
        setIsLoading(false);
        break;
    }
  };

  const fetchData = async () => {
    try {
      const activities = await getActivities({ token: userContext.token });
      setActivities(activities);
    } catch (error) {
      console.error("Error fetching cars:", error);
    }
  };

  useEffect(() => {
    if (userContext.token) {
      try {
        setIsLoading(true);
        fetchData();
      } finally {
        setIsLoading(false);
      }
    }
  }, [userContext]);

  const tableHeaderFields: FieldConfig[] = [{ label: "Name", key: "name" }];

  // const cardHeaderFields = [{ label: "Asset", key: "asset" }];

  // const cardBodyFields = [
  //   { label: "Description", key: "asset_description" },
  //   { label: "HP", key: "hp" },
  // ];

  const actions = [
    {
      key: "edit",
      label: "แก้ไข",
      icon: <EditIcon />,
      onClick: (item: any) =>
        handleActions({ params: { action: "edit", id: item.id } }),
    },
    {
      key: "delete",
      label: "ลบ",
      icon: <DeleteIcon />,
      className: "text-danger-500",
      onClick: (item: any) =>
        handleActions({ params: { action: "delete", id: item.id } }),
    },
  ];

  return (
    <>
      <TableComponent
        headers={tableHeaderFields}
        datas={activities}
        actions={actions}
      />
      {/* <CardComponent
        actions={actions}
        bodyFields={cardBodyFields}
        headerFields={cardHeaderFields}
        items={car}
      /> */}
    </>
  );
}
