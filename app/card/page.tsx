"use client";
import React, { useEffect, useState } from "react";
import { useDisclosure } from "@heroui/react";

import { User } from "@/interfaces/interfaces";
import { mock_users } from "@/utils/mock";
import { AlertModal } from "@/components/AlertModal";
import { CardComponent } from "@/components/CardComponent";
import {
  UserRoleTranslation,
  UserStatusColorMap,
  UserStatusTranslation,
} from "@/utils/constants";
import { useLoading } from "@/providers/LoadingContext";

function Card() {
  // const [isLoading, setIsLoading] = useState(true);
  const { setIsLoading } = useLoading();
  const [users, setUsers] = useState<User[]>([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  useEffect(() => {
    setIsLoading(true);

    const fetchData = () => {
      setTimeout(() => {
        setUsers(mock_users);
        setIsLoading(false);
      }, 3000);
    };

    fetchData();

    const intervalId = setInterval(() => {
      fetchData();
    }, 10000);

    return () => clearInterval(intervalId);
  }, [setIsLoading]);

  const handleView = (user: User) => {
    console.log(`Viewing user: ${user.fullname}`);
  };

  const handleEdit = (user: User) => {
    console.log(`Editing user: ${user.fullname}`);
  };

  const handleDelete = (user: User) => {
    setUserToDelete(user);
    onOpen();
  };

  function confirmDelete(): void {
    if (userToDelete) {
      console.log(`Deleting user: ${userToDelete.fullname}`);
      setUsers(users.filter((u) => u.id !== userToDelete.id));
    }
    setUserToDelete(null);
    onClose();
  }

  return (
    <>
      {isOpen && (
        <AlertModal
          cancelText="ยกเลิก"
          confirmText="ยืนยัน"
          isOpen={isOpen}
          message={
            userToDelete
              ? `คุณแน่ใจหรือไม่ว่าต้องการลบผู้ใช้ ${userToDelete.fullname}`
              : "คุณแน่ใจหรือไม่ว่าต้องการลบผู้ใช้คนนี้?"
          }
          title="ลบผู้ใช้"
          onClose={onClose}
          onConfirm={confirmDelete}
          onOpen={onOpen}
        />
      )}
      <CardComponent<User>
        actions={[
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
    </>
  );
}

export default Card;
