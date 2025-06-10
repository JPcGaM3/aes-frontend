"use client";
import React, { useCallback } from "react";
import {
  Button,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/react";

import { VerticalDotsIcon } from "./TableComponent";

import { User } from "@/interfaces/interfaces";
import { ColorType } from "@/types";
import { UserStatus } from "@/utils/enum";
import { UserRoleTranslation, UserStatusTranslation } from "@/utils/constants";
import { translateEnumValue } from "@/utils/functions";

function CardComponent({ users }: { users: User[] }) {
  const userStatusColorMap: Record<UserStatus, ColorType> = {
    working: "danger",
    inactive: "primary",
    on_leave: "warning",
  };

  const renderCell = useCallback(
    ({ user }: { user: User }) => (
      <div
        key={user.id}
        className="flex flex-col gap-2 bg-white shadow-md p-4 rounded-lg w-64 h-full"
      >
        <Chip
          className="w-fit capitalize"
          color={userStatusColorMap[(user.status || "inactive") as UserStatus]}
          size="sm"
          variant="flat"
        >
          {translateEnumValue(user.status || "inactive", UserStatusTranslation)}
        </Chip>
        <div className="flex flex-col">
          <h3 className="font-semibold text-lg capitalize">{user.fullname}</h3>
          <p className="text-gray-600 capitalize">
            {translateEnumValue(user.role, UserRoleTranslation)}
          </p>
          <p className="text-gray-600 capitalize">{user.phone}</p>
          <p className="text-gray-500">{user.unit}</p>
          <p className="text-gray-400 text-sm">{user.zone}</p>
        </div>

        <div className="flex justify-end gap-2 mt-2">
          <Dropdown>
            <DropdownTrigger>
              <Button isIconOnly size="sm" variant="light">
                <div className="text-default-300">
                  <VerticalDotsIcon />
                </div>
              </Button>
            </DropdownTrigger>
            <DropdownMenu>
              <DropdownItem key="view">View</DropdownItem>
              <DropdownItem key="edit">Edit</DropdownItem>
              <DropdownItem key="delete">Delete</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
    ),
    [userStatusColorMap],
  );

  return (
    <div className="flex flex-wrap justify-start items-center gap-8 w-full h-full">
      {users.map((user) => renderCell({ user }))}
    </div>
  );
}

export default CardComponent;
