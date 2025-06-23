"use client";

import React, { useState } from "react";

import { mock_users } from "@/utils/mock";
import { FilterIcon } from "@/utils/icons";

import {
  UserRoleTranslation,
  UserStatusColorMap,
  UserStatusTranslation,
} from "@/utils/constants";

import {
  FieldConfig,
  FilterConfig,
  FormField,
  User,
} from "@/interfaces/interfaces";

import Header from "@/components/Header";
import FilterModal from "@/components/FilterModal";
import { AlertModal } from "@/components/AlertModal";
import { Button, useDisclosure } from "@heroui/react";
import FormComponent from "@/components/FormComponent";
import { CardComponent } from "@/components/CardComponent";
import DrawerComponent from "@/components/DrawerComponent";

export default function Card() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // useState for modal and drawer visibility ------------------------------
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

  const {
    isOpen: isOpenFilter,
    onOpen: onOpenFilter,
    onClose: onCloseFilter,
  } = useDisclosure();

  // Handlers for modal and drawer actions ---------------------------------
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

  const handleSaveEdit = (values: any) => {
    console.log("Form values: ", values);
    onCloseEdit();
  };

  const handleApplyFilters = (values: any) => {
    console.log("Filter values: ", values);
    onCloseFilter();
  };

  // Field configurations --------------------------------------------------
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

  const editFields: FormField[] = [
    {
      type: "dropdown",
      name: "quota_number",
      label: "Quota Number",
      placeholder: selectedUser?.quota_number,
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
    },
    {
      type: "text",
      name: "email",
      label: "Email",
      placeholder: selectedUser?.email,
    },
    {
      type: "text",
      name: "phone",
      label: "Phone",
      placeholder: selectedUser?.phone,
    },
    {
      type: "number",
      name: "unit",
      label: "Unit",
      placeholder: selectedUser?.unit,
    },
    {
      type: "text",
      name: "zone",
      label: "Zone",
      placeholder: selectedUser?.zone,
    },
    {
      type: "text",
      name: "ae",
      label: "AE",
      placeholder: selectedUser?.ae,
    },
    {
      type: "text",
      name: "role",
      label: "Role",
      placeholder: selectedUser?.role,
    },
    {
      type: "text",
      name: "status",
      label: "Status",
      placeholder: selectedUser?.status,
    },
    {
      type: "number",
      name: "leader_id",
      label: "Leader ID",
      placeholder: selectedUser?.leader_id,
    },
  ];

  const filterFields: FormField[] = [
    {
      type: "dropdown",
      name: "status",
      label: "Status",
      options: [
        { label: "All", value: "all" },
        { label: "Active", value: "active" },
        { label: "Inactive", value: "inactive" },
      ],
    },
    {
      type: "dropdown",
      name: "ae",
      label: "AE",
      options: [
        { label: "All", value: "all" },
        { label: "CT", value: "ct" },
        { label: "NE1", value: "ne1" },
        { label: "NE2", value: "ne2" },
      ],
    },
  ];

  const statusConfig = {
    colorMap: UserStatusColorMap,
    translation: UserStatusTranslation,
  };

  return (
    <div>
      {/* Drawer ----------------------------------------------------------- */}
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
                if (typeof value === "boolean") {
                  value = value.toString();
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
            fields={editFields}
            title="Edit User"
            subtitle="Edit user details"
            onSubmit={handleSaveEdit}
            onCancel={() => onCloseEdit()}
          />
        </div>
      </DrawerComponent>

      {/* Modal ------------------------------------------------------------- */}
      <AlertModal
        isOpen={isOpenDelete}
        onClose={() => onCloseDelete()}
        onConfirm={() => handleConfirmDelete()}
        title="Confirm Deletion"
        message="Are you sure you want to delete this user?"
        confirmText="Delete"
        cancelText="Cancel"
      />

      <FilterModal
        isOpen={isOpenFilter}
        title="Filter Users"
        subtitle="Apply filters to user list"
        fields={filterFields}
        submitLabel="Apply Filters"
        cancelLabel="Cancel"
        onSubmit={handleApplyFilters}
        onClose={() => onCloseFilter()}
        initialValues={{ status: "all", ae: "all" }}
      />

      {/* Header ----------------------------------------------------------- */}
      <Header title="User Management" className="mb-6 w-full text-left">
        <Button
          radius="sm"
          variant="flat"
          color="primary"
          endContent={<FilterIcon />}
          onPress={onOpenFilter}
        >
          Filter User
        </Button>
      </Header>

      {/* Body ------------------------------------------------------------- */}
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
