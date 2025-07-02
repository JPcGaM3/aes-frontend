"use client";

import React from "react";
import { use, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

import clsx from "clsx";
import { fontMono } from "@/config/fonts";

import { Button, Tab, Tabs } from "@heroui/react";

import Header from "@/components/Header";
import FieldValueDisplayer from "@/components/FieldValueDisplayer";
import { useLoading } from "@/providers/LoadingContext";

export default function RequestManagementPage({
  params,
}: {
  params: Promise<{ rid: string }>;
}) {
  const { rid } = use(params);
  const { setIsLoading } = useLoading();

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const action = searchParams.get("action") || "view";

  const [selectedTab, setSelectedTab] = useState(action);

  const handleTabChange = (key: React.Key) => {
    if (typeof key === "string") {
      setSelectedTab(key);

      const newSearchParams = new URLSearchParams(searchParams.toString());
      newSearchParams.delete("action");

      const newQuery = newSearchParams.toString();
      router.push(`${pathname}${newQuery ? `?${newQuery}` : ""}`);
    }
  };

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
