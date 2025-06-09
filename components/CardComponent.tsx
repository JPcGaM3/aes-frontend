"use client";
import React from "react";
import { Chip } from "@heroui/react";

import { INF_User } from "@/interfaces";
import { ColorType, UserStatus } from "@/types";

function CardComponent({ users }: { users: INF_User[] }) {
  const statusColorMap: Record<UserStatus, ColorType> = {
    active: "success",
    paused: "danger",
    vacation: "warning",
  };

  return (
    <div className="gap-4 grid grid-cols-4">
      {users.map((user) => (
        <div key={user.id} className="bg-white shadow-md p-4 rounded-lg">
          <h3 className="font-semibold text-lg">{user.name}</h3>
          <p className="text-gray-600">{user.role}</p>
          <p className="text-gray-500">{user.email}</p>
          <p className="text-gray-400 text-sm">Age: {user.age}</p>
          {
            <Chip
              className="capitalize"
              color={
                statusColorMap[
                  (user.status.toLowerCase() as UserStatus) || "default"
                ]
              }
              size="sm"
              variant="flat"
            >
              {user.status}
            </Chip>
          }
          <div className="mt-4">
            <button className="bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded text-white">
              View Profile
            </button>
            <button className="bg-gray-200 hover:bg-gray-300 ml-2 px-3 py-1 rounded text-gray-800">
              Edit
            </button>
            <button className="bg-red-500 hover:bg-red-600 ml-2 px-3 py-1 rounded text-white">
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default CardComponent;
