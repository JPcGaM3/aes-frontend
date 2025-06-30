"use client";

import React from "react";
import { useRouter } from "next/navigation";

import { Button, useDisclosure } from "@heroui/react";

import Header from "@/components/Header";
import AlertModal from "@/components/AlertModal";

import { useAuth } from "@/providers/AuthContext";
import { useLoading } from "@/providers/LoadingContext";

export default function ProfilePage() {
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { setIsLoading } = useLoading();
  const { logout } = useAuth();

  const handleLogout = () => {
    onOpen();
  };

  const handleConfirmLogout = () => {
    setIsLoading(true);

    logout();
    onClose();

    router.push("/login");
  };

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl px-2 sm:px-4 md:px-8">
        <AlertModal
          isOpen={isOpen}
          onClose={onClose}
          title="Logout"
          message="Are you sure you want to logout?"
          confirmText="Yes"
          cancelText="No"
          onConfirm={handleConfirmLogout}
        />

        <Header title="User Profile" subtitle="Manage your profile settings" />

        <Button
          variant="bordered"
          size="lg"
          radius="sm"
          className="w-full mt-4 font-semibold"
          onPress={() => handleLogout()}
        >
          ออกจากระบบ
        </Button>
      </div>
    </div>
  );
}
