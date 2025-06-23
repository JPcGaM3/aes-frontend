"use client";

import React, { useState } from "react";

import { mock_users } from "@/utils/mock";
import { CardComponent } from "@/components/CardComponent";

import {
  UserRoleTranslation,
  UserStatusColorMap,
  UserStatusTranslation,
} from "@/utils/constants";

import { FieldConfig, FormField, User } from "@/interfaces/interfaces";
import { AlertModal } from "@/components/AlertModal";
import { useDisclosure } from "@heroui/react";
import DrawerComponent from "@/components/DrawerComponent";
import FormComponent from "@/components/FormComponent";
import Header from "@/components/Header";

export default function Card() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const {
    isOpen: isOpenView,
    onOpen: onOpenView,
    onClose: onCloseView,
  } = useDisclosure();

  const {
    isOpen: isOpenEdit,
    onOpen: onOpenEdit,
    onClose: onCloseEdit,
  } = useDisclosure();

  const {
    isOpen: isOpenDelete,
    onOpen: onOpenDelete,
    onClose: onCloseDelete,
  } = useDisclosure();

  const handleView = (user: User) => {
    setSelectedUser(user);
    onOpenView();
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    onOpenEdit();
  };

  const handleDelete = (user: User) => {
    setSelectedUser(user);
    onOpenDelete();
  };

  const handleConfirmDelete = () => {
    onCloseDelete();
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

  const formFields: FormField[] = [
    {
      type: "dropdown",
      name: "quota_number",
      label: "Quota Number",
      placeholder: selectedUser?.quota_number,
      isRequired: true,
      options: [
        { label: "Option 1", value: "option1" },
        { label: "Option 2", value: "option2" },
      ],
    },
    {
      type: "text",
      name: "fullname",
      label: "Full Name",
      placeholder: selectedUser?.fullname,
      isRequired: true,
    },
    {
      type: "text",
      name: "email",
      label: "Email",
      placeholder: selectedUser?.email,
      isRequired: true,
    },
    {
      type: "text",
      name: "phone",
      label: "Phone",
      placeholder: selectedUser?.phone,
      isRequired: true,
    },
    {
      type: "number",
      name: "unit",
      label: "Unit",
      placeholder: selectedUser?.unit,
      isRequired: true,
    },
    {
      type: "text",
      name: "zone",
      label: "Zone",
      placeholder: selectedUser?.zone,
      isRequired: true,
    },
    {
      type: "text",
      name: "ae",
      label: "AE",
      placeholder: selectedUser?.ae,
      isRequired: true,
    },
    {
      type: "text",
      name: "role",
      label: "Role",
      placeholder: selectedUser?.role,
      isRequired: true,
    },
    {
      type: "text",
      name: "status",
      label: "Status",
      placeholder: selectedUser?.status,
      isRequired: true,
    },
    {
      type: "number",
      name: "leader_id",
      label: "Leader ID",
      placeholder: selectedUser?.leader_id,
      isRequired: true,
    },
  ];

  const statusConfig = {
    colorMap: UserStatusColorMap,
    translation: UserStatusTranslation,
  };

  return (
    <div>
      <DrawerComponent isOpen={isOpenView} onClose={onCloseView}>
        <div className="px-6 pb-6">
          <Header title="View User" subtitle="User details" />
          <div className="flex flex-col gap-2">
            {selectedUser &&
              Object.keys(selectedUser).map((key) => {
                let value = (selectedUser as any)[key];
                if (value === undefined || value === null) {
                  return null;
                }

                if (value instanceof Date) {
                  value = value.toLocaleString();
                }

                return (
                  <div key={key} className="flex flex-row items-center">
                    <div className="w-1/3">{key}</div>
                    <div className="w-2/3">: {value}</div>
                  </div>
                );
              })}
          </div>
        </div>
      </DrawerComponent>

      <DrawerComponent isOpen={isOpenEdit} onClose={onCloseEdit}>
        <div className="px-6 pb-6">
          <FormComponent
            fields={formFields}
            title="Edit User"
            subtitle="Edit user details"
            onSubmit={() => {}}
            onCancel={() => {}}
          />
        </div>
      </DrawerComponent>

      <AlertModal
        isOpen={isOpenDelete}
        onClose={() => onCloseDelete()}
        onConfirm={() => handleConfirmDelete()}
        title="Confirm Deletion"
        message="Are you sure you want to delete this user?"
        confirmText="Delete"
        cancelText="Cancel"
      />

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
