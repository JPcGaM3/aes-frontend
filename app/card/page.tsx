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
import { AlertModal } from "@/components/AlertModal";
import { useDisclosure } from "@heroui/react";
import DrawerComponent from "@/components/DrawerComponent";

export default function Card() {
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
    console.log(`Viewing user: ${user.fullname}`);

    onOpenView();
  };

  const handleEdit = (user: User) => {
    console.log(`Editing user: ${user.fullname}`);

    onOpenEdit();
  };

  const handleDelete = (user: User) => {
    console.log(`Deleting user: ${user.fullname}`);

    onOpenDelete();
  };

  const handleConfirmDelete = () => {
    console.log("Confirm deleting!");

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

  const statusConfig = {
    colorMap: UserStatusColorMap,
    translation: UserStatusTranslation,
  };

  return (
    <div>
      <AlertModal
        isOpen={isOpenDelete}
        onClose={() => onCloseDelete()}
        onConfirm={() => handleConfirmDelete()}
        title="Confirm Deletion"
        message="Are you sure you want to delete this user?"
        confirmText="Delete"
        cancelText="Cancel"
      />

      <DrawerComponent isOpen={isOpenView} onClose={onCloseView}>
        <div>View User Details</div>
      </DrawerComponent>

      <DrawerComponent isOpen={isOpenEdit} onClose={onCloseEdit}>
        <div>Edit User Details</div>
      </DrawerComponent>

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
