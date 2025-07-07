"use client";

import React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { clsx } from "clsx";

import { Button, useDisclosure } from "@heroui/react";

import Header from "@/components/Header";
import AlertModal from "@/components/AlertModal";
import FieldValueDisplayer from "@/components/FieldValueDisplayer";
import AlertComponent from "@/components/AlertComponent";

import { useAuth } from "@/providers/AuthContext";
import { useLoading } from "@/providers/LoadingContext";
import { UserProfileResponse } from "@/interfaces/schema";
import { AlertComponentProps } from "@/interfaces/props";

import { getProfile } from "@/libs/userAPI";
import { fontMono } from "@/config/fonts";

export default function ProfilePage() {
	const router = useRouter();
	const { isOpen, onOpen, onClose } = useDisclosure();
	const { setIsLoading } = useLoading();
	const { userContext, logout } = useAuth();

	const [profile, setProfile] = useState<UserProfileResponse["data"] | null>(
		null
	);
	const [alert, setAlert] = useState<AlertComponentProps>({
		title: "",
		description: "",
		isVisible: false,
	});

	// TODO: core fetch function
	useEffect(() => {
		if (userContext.token) {
			const fetchProfile = async ({ token }: { token: string }) => {
				try {
					setIsLoading(true);
					const response = await getProfile({ token });

					setProfile(response);
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

			fetchProfile({ token: userContext!.token ?? "" });
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

	const profileSections = [
		{
			title: "ข้อมูลส่วนตัว",
			fields: [
				{ label: "รหัสพนักงาน", value: profile?.user_result.id ?? "-" },
				{ label: "อีเมล", value: profile?.user_result.email ?? "-" },
				{
					label: "ชื่อ-สกุล (TH)",
					value: profile?.profile.employeeName?.th ?? "-",
				},
				{
					label: "ชื่อ-สกุล (EN)",
					value: profile?.profile.employeeName?.en ?? "-",
				},
				{
					label: "เบอร์โทรศัพท์",
					value: profile?.user_result.phone ?? "-",
				},
				{ label: "ที่อยู่", value: "-" },
			],
		},
		{
			title: "ข้อมูลการทำงาน",
			fields: [
				{
					label: "ตำแหน่ง",
					value: profile?.user_result.role?.length
						? profile.user_result.role.join(", ")
						: "-",
				},
				{ label: "ระดับ", value: profile?.profile.level?.name ?? "-" },
				{
					label: "แผนก",
					value:
						profile?.profile.department?.name?.en?.replace(/ Section$/i, "") ??
						"-",
				},
				{
					label: "สังกัด AE",
					value: profile?.user_result.ae_area?.name ?? "-",
				},
			],
		},
	];

	const firstname = profile?.profile.employeeName?.en?.split(" ")[1] ?? "-";

	return (
		<div className="flex items-center justify-center pt-3">
			<div className="flex flex-col items-center justify-center w-full gap-8">
				{isOpen && (
					<AlertModal
						isOpen={isOpen}
						onClose={onClose}
						title="ออกจากระบบ"
						message="คุณแน่ใจหรือไม่ว่าต้องการออกจากระบบ ?"
						confirmText="ยืนยัน"
						cancelText="ยกเลิก"
						onConfirm={handleConfirmLogout}
					/>
				)}

				{alert.isVisible && (
					<AlertComponent
						title={alert.title}
						description={alert.description}
						color={alert.color}
						isVisible={alert.isVisible}
						handleClose={() => setAlert({ ...alert, isVisible: false })}
					/>
				)}

				<div className="flex flex-col items-center justify-center gap-1">
					<div className="flex items-center justify-center w-24 h-24 text-4xl font-bold text-gray-700 bg-gray-200 rounded-full">
						{profile?.user_result.email?.charAt(0)?.toUpperCase() ?? "-"}
					</div>

					<Header
						title={firstname}
						subtitle={`employee_id: ${profile?.profile.id ? `@${profile?.profile.id}` : "-"}`}
						subtitleClassName={clsx(
							"mt-1 text-sm text-gray-600 font-mono",
							fontMono.variable
						)}
						hasBorder={false}
					/>
				</div>

				<FieldValueDisplayer sections={profileSections} />

				<Button
					size="lg"
					radius="sm"
					color="danger"
					variant="flat"
					className="w-full max-w-sm font-semibold sm:max-w-md md:max-w-lg lg:max-w-xl"
					onPress={() => handleLogout()}
				>
					ออกจากระบบ
				</Button>
			</div>
		</div>
	);
}
