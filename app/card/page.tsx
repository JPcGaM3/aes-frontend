"use client";
import React, { useMemo, useState } from "react";

import { User } from "@/interfaces/interfaces";
import {
  UserRoleTranslation,
  UserStatusColorMap,
  UserStatusTranslation,
} from "@/utils/constants";
import CardComponent from "@/components/CardComponent";
import { mock_users } from "@/utils/mock";

// interface UserCardsProps {
//   users: User[];
//   onView?: (user: User) => void;
//   onEdit?: (user: User) => void;
//   onDelete?: (user: User) => void;
// }
// { users, onView, onEdit, onDelete }: UserCardsProps

function Card() {
  const [users, setUsers] = useState<User[]>([]);

  useMemo(() => {
    setUsers(mock_users);
  }, []);

  const handleView = (user: User) => {
    console.log(`Viewing user: ${user.fullname}`);
  };

  const handleEdit = (user: User) => {
    console.log(`Editing user: ${user.fullname}`);
  };

  const handleDelete = (user: User) => {
    console.log(`Deleting user: ${user.fullname}`);
  };

  return (
    <CardComponent<User>
      actions={[
        {
          key: "view",
          label: "View",
          onClick: handleView,
        },
        {
          key: "edit",
          label: "Edit",
          onClick: handleEdit,
        },
        {
          key: "delete",
          label: "Delete",
          onClick: handleDelete,
        },
      ]}
      bodyFields={[
        {
          key: "fullname",
          className: "font-semibold text-lg capitalize",
        },
        {
          key: "role",
          className: "text-gray-600 capitalize",
          translation: UserRoleTranslation,
        },
        {
          key: "phone",
          className: "text-gray-600 capitalize",
        },
        {
          key: "unit",
          className: "text-gray-500",
        },
        {
          key: "zone",
          className: "text-gray-400 text-sm",
        },
      ]}
      headerFields={[
        {
          key: "quota_number",
          label: "Quota Number",
          className: "font-semibold text-lg capitalize text-start",
        },
      ]}
      items={users}
      statusConfig={{
        key: "status",
        defaultValue: "inactive",
        colorMap: UserStatusColorMap,
        translation: UserStatusTranslation,
      }}
    />
  );
}

export default Card;