"use client";

import React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Button, useDisclosure } from "@heroui/react";

import AlertModal from "@/components/AlertModal";
import FieldValueDisplayer, {
  FieldSection,
} from "@/components/FieldValueDisplayer";

import { AlertComponentProps } from "@/components/AlertComponent";

import { useAuth } from "@/providers/AuthContext";
import { useLoading } from "@/providers/LoadingContext";
import { UserProfile } from "@/interfaces/interfaces";

import { getProfile } from "@/libs/userAPI";

export default function ProfilePage() {
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { setIsLoading } = useLoading();
  const { userContext, logout } = useAuth();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [alert, setAlert] = useState<AlertComponentProps>({
    title: "",
    description: "",
    isVisible: false,
  });

  // TODO: core fetch function
  useEffect(() => {
    if (userContext.token) {
      const fetchProfile = async () => {
        try {
          setIsLoading(true);
          const response = await getProfile({ token: userContext.token });
          await setProfile(response.profile);
          console.log("Profile data:", response.profile);
        } catch (error: any) {
          setAlert({
            title: "Failed to load user profile",
            description: error.message,
            color: "danger",
            isVisible: true,
          });
        } finally {
          setIsLoading(false);
        }
      };

      fetchProfile();
    }
  }, [userContext]);

  const handleLogout = () => {
    onOpen();
  };

  const handleConfirmLogout = () => {
    setIsLoading(true);

    logout();
    onClose();

    router.push("/login");
  };

  const profileSections: FieldSection[] = profile
    ? [
        {
          title: "ข้อมูลส่วนตัว",
          fields: [
            { label: "รหัสพนักงาน", value: profile.id },
            { label: "อีเมล", value: profile.email },
            { label: "ชื่อ-สกุล (TH)", value: profile.employeeName?.th || "-" },
            { label: "ชื่อ-สกุล (EN)", value: profile.employeeName?.en || "-" },
          ],
        },
        {
          title: "ข้อมูลการติดต่อ",
          fields: [
            { label: "เบอร์โทรศัพท์", value: "-" },
            { label: "ที่อยู่", value: "-" },
          ],
        },
        {
          title: "ข้อมูลการทำงาน",
          fields: [
            { label: "ตำแหน่ง", value: profile.position?.name?.th || "-" },
            { label: "ระดับ", value: profile.level?.name || "-" },
            { label: "ฝ่าย/แผนก", value: profile.department?.name?.th || "-" },
            { label: "บริษัท", value: profile.company?.name || "-" },
            { label: "โรงงาน", value: profile.plant?.name || "-" },
            { label: "ผู้อนุมัติ", value: profile.approver?.username || "-" },
          ],
        },
      ]
    : [];

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-xl">
        {isOpen && (
          <AlertModal
            isOpen={isOpen}
            onClose={onClose}
            title="Logout"
            message="Are you sure you want to logout?"
            confirmText="Yes"
            cancelText="No"
            onConfirm={handleConfirmLogout}
          />
        )}

        {alert.isVisible && (
          <AlertModal
            isOpen={alert.isVisible}
            title={alert.title}
            message={alert.description}
            onClose={() => setAlert({ ...alert, isVisible: false })}
          />
        )}

        {profile && <FieldValueDisplayer sections={profileSections} />}

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
