"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import { Tab, Tabs } from "@heroui/react";

export default function RequestManagementPage({
  params,
}: {
  params: Promise<{ rid: string }>;
}) {
  const { rid } = React.use(params);
  const searchParams = useSearchParams();
  const action = searchParams.get("action") || "view";

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <Tabs
        aria-label="TabOptions"
        radius="sm"
        selectedKey={action}
        className="flex flex-col items-center justify-center w-full p-0 font-semibold"
      >
        {/* Key-in tab ------------------------------------------------------------------------------------------- */}
        <Tab
          key="view"
          title="View"
          className="flex flex-col items-center justify-center w-full"
        />
        <Tab
          key="edit"
          title="Edit"
          className="flex flex-col items-center justify-center w-full"
        />
        <Tab
          key="reject"
          title="Reject"
          className="flex flex-col items-center justify-center w-full"
        />
      </Tabs>
    </div>
  );
}
