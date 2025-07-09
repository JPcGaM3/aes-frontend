"use client";

import React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { clsx } from "clsx";
import { useDisclosure } from "@heroui/react";

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
import { FieldSection } from "@/interfaces/interfaces";
import FormButtons from "@/components/FormButtons";

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

	const profileSections: FieldSection[] = [
		{
			title: "ข้อมูลส่วนตัว",
			fields: [
				{ name: "รหัสพนักงาน", value: profile?.user_result.id ?? "-" },
				{ name: "อีเมล", value: profile?.user_result.email ?? "-" },
				{
					name: "ชื่อ-สกุล (TH)",
					value: profile?.profile.employeeName?.th ?? "-",
				},
				{
					name: "ชื่อ-สกุล (EN)",
					value: profile?.profile.employeeName?.en ?? "-",
				},
				{
					name: "เบอร์โทรศัพท์",
					value: profile?.user_result.phone ?? "-",
				},
				{ name: "ที่อยู่", value: "-" },
			],
		},
		{
			title: "ข้อมูลการทำงาน",
			fields: [
				{
					name: "ตำแหน่ง",
					value: profile?.user_result.role?.length
						? profile.user_result.role.join(", ")
						: "-",
				},
				{ name: "ระดับ", value: profile?.profile.level?.name ?? "-" },
				{
					name: "แผนก",
					value:
						profile?.profile.department?.name?.en?.replace(/ Section$/i, "") ??
						"-",
				},
				{
					name: "สังกัด AE",
					value: profile?.user_result.ae_area?.name ?? "-",
				},
			],
		},
	];

	const firstname = profile?.profile.employeeName?.en?.split(" ")[1] ?? "-";

	return (
		<div className="flex items-center justify-center pt-3">
			<div className="flex flex-col items-center justify-center w-full max-w-sm gap-8 sm:max-w-lg md:max-w-2xl lg:max-w-4xl">
				{isOpen && (
					<AlertModal
						cancelText="ยกเลิก"
						confirmText="ยืนยัน"
						isOpen={isOpen}
						message="คุณแน่ใจหรือไม่ว่าต้องการออกจากระบบ ?"
						title="ออกจากระบบ"
						onClose={onClose}
						onConfirm={handleConfirmLogout}
					/>
				)}

				{alert.isVisible && (
					<AlertComponent
						color={alert.color}
						description={alert.description}
						handleClose={() => setAlert({ ...alert, isVisible: false })}
						isVisible={alert.isVisible}
						size="compact"
						title={alert.title}
					/>
				)}

				<div className="flex flex-col items-center justify-center gap-4">
					<div className="flex items-center justify-center w-24 h-24 text-4xl font-bold text-gray-700 bg-gray-200 rounded-full">
						{profile?.user_result.email?.charAt(0)?.toUpperCase() ?? "-"}
					</div>

					<Header
						hasBorder={false}
						subtitle={`employee_id: ${profile?.profile.id ? `@${profile?.profile.id}` : "-"}`}
						subtitleClassName={clsx(
							"mt-1 text-sm text-gray-600 font-mono",
							fontMono.variable
						)}
						title={firstname}
					/>
				</div>

				<FieldValueDisplayer sections={profileSections} />

				<FormButtons
					hasBorder={false}
					size="compact"
					submitColor="danger"
					submitLabel="ออกจากระบบ"
					onSubmit={handleLogout}
				/>
			</div>
		</div>
	);
}
