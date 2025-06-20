"use client";

import React from "react";

import { mock_users } from "@/utils/mock";
import { CardComponent } from "@/components/CardComponent";

import {
  UserRoleTranslation,
  UserStatusColorMap,
  UserStatusTranslation,
} from "@/utils/constants";

import { FieldConfig, User } from "@/interfaces/interfaces";

export default function Card() {
  const handleView = (user: User) => {
    console.log(`Viewing user: ${user.fullname}`);
  };

  const handleEdit = (user: User) => {
    console.log(`Editing user: ${user.fullname}`);
  };

  const handleDelete = (user: User) => {
    console.log(`Deleting user: ${user.fullname}`);
  };

  const actions = [
    {
      key: "view",
      label: "ดูรายละเอียด",
      onClick: handleView,
    },
    {
      key: "edit",
      label: "แก้ไข",
      onClick: handleEdit,
    },
    {
      key: "delete",
      label: "ลบ",
      onClick: handleDelete,
    },
  ];

  const headerFields: FieldConfig[] = [
    {
      key: "quota_number",
      label: "Quota Number",
      className: "text-black text-lg font-bold",
    },
  ];

  const bodyFields: FieldConfig[] = [
    {
      key: "fullname",
      label: "Full Name",
      className: "text-black text-md font-bold",
    },
    {
      key: "role",
      label: "Role",
      className: "text-gray-600 text-md font-semibold pb-2",
      translation: UserRoleTranslation,
    },
    {
      key: "phone",
      label: "Phone",
      className: "text-gray-500 text-sm",
    },
    {
      key: "unit",
      label: "Unit",
      className: "text-gray-500 text-sm",
    },
    {
      key: "zone",
      label: "Zone",
      className: "text-gray-500 text-sm",
    },
  ];

  const statusConfig = {
    colorMap: UserStatusColorMap,
    translation: UserStatusTranslation,
  };

  return (
    <div>
      <CardComponent<User>
        actions={actions}
        bodyFields={bodyFields}
        headerFields={headerFields}
        items={mock_users}
        statusConfig={statusConfig}
      />
    </div>
  );
}
