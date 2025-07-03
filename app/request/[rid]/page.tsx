"use client";

import React from "react";
import { use, useState, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

import clsx from "clsx";
import { fontMono } from "@/config/fonts";

import { Button, Tab, Tabs } from "@heroui/react";

import Header from "@/components/Header";
import FieldValueDisplayer from "@/components/FieldValueDisplayer";

import { useLoading } from "@/providers/LoadingContext";
import { useAuth } from "@/providers/AuthContext";

import { getRequestOrderWithTask } from "@/libs/requestOrderAPI";
import { FieldSection } from "@/interfaces/interfaces";

export default function RequestManagementPage({
  params,
}: {
  params: Promise<{ rid: number }>;
}) {
  // const and hooks -------------------------------------------------------------------------------------------
  const { rid } = use(params);
  const { userContext } = useAuth();
  const { setIsLoading } = useLoading();

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const action = searchParams.get("action") || "view";

  const [selectedTab, setSelectedTab] = useState(action);
  const [requestData, setRequestData] = useState(null);
  const [taskData, setTaskData] = useState(null);

  // Fetch data ------------------------------------------------------------------------------------------------
  useEffect(() => {
    if (rid && userContext.token) {
      const fetchData = async ({
        token,
        requestId,
      }: {
        token: string;
        requestId: number;
      }) => {
        setIsLoading(true);
        try {
          const response = await getRequestOrderWithTask({
            token: token,
            requestId: requestId,
          });
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchData({
        token: userContext.token,
        requestId: rid,
      });
    }
  }, [rid, userContext.token]);

  // Handler ---------------------------------------------------------------------------------------------------
  const handleTabChange = (key: React.Key) => {
    if (typeof key === "string") {
      setSelectedTab(key);

      const newSearchParams = new URLSearchParams(searchParams.toString());
      newSearchParams.delete("action");

      const newQuery = newSearchParams.toString();
      router.push(`${pathname}${newQuery ? `?${newQuery}` : ""}`);
    }
  };

  // Field config ----------------------------------------------------------------------------------------------
  const dataSection: FieldSection[] = [
    {
      fields: [],
    },
    {
      title: "ข้อมูลการทำงาน",
      fields: [],
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <Tabs
        aria-label="TabOptions"
        radius="sm"
        selectedKey={selectedTab}
        onSelectionChange={handleTabChange}
        className="flex flex-col items-center justify-center w-full p-0 font-semibold"
      >
        {/* View tab ------------------------------------------------------------------------------------------- */}
        <Tab
          key="view"
          title="รายละเอียด"
          className="flex flex-col items-center justify-center w-full gap-8"
        >
          <Header
            title="ดูรายละเอียดใบสั่งงาน"
            subtitle="@CT0RDC02568/00057"
            subtitleClassName={clsx(
              "mt-1 text-sm text-gray-600 font-mono",
              fontMono.variable
            )}
            hasBorder={false}
          />

          {/* <FieldValueDisplayer sections={profileSections} /> */}

          <Button
            size="lg"
            radius="sm"
            color="danger"
            variant="flat"
            className="w-full max-w-sm font-semibold sm:max-w-md md:max-w-lg lg:max-w-xl"
            onPress={() => {
              setIsLoading(true);
              router.push(`/request`);
            }}
          >
            ย้อนกลับ
          </Button>
        </Tab>

        {/* Edit tab ------------------------------------------------------------------------------------------- */}
        <Tab
          key="edit"
          title="แก้ไข"
          className="flex flex-col items-center justify-center w-full"
        ></Tab>

        {/* Reject tab ----------------------------------------------------------------------------------------- */}
        <Tab
          key="reject"
          title="ยกเลิก"
          className="flex flex-col items-center justify-center w-full"
        ></Tab>
      </Tabs>
    </div>
  );
}
