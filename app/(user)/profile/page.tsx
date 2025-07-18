"use client";

import React, { useRef } from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { clsx } from "clsx";
import { useDisclosure } from "@heroui/react";

import Header from "@/components/Header";
import AlertModal from "@/components/AlertModal";
import FieldValueDisplayer from "@/components/FieldValueDisplayer";
import { useAuth } from "@/providers/AuthContext";
import { useLoading } from "@/providers/LoadingContext";
import { UserProfileResponse } from "@/interfaces/schema";
import { fontMono } from "@/config/fonts";
import { FieldSection } from "@/interfaces/interfaces";
import FormButtons from "@/components/FormButtons";
import { useAlert } from "@/providers/AlertContext";
import { fetchProfile } from "@/utils/functions";

export default function ProfilePage() {
	const router = useRouter();
	const { isOpen, onOpen, onClose } = useDisclosure();
	const { showLoading, hideLoading } = useLoading();
	const { userContext, logout } = useAuth();
	const { showAlert } = useAlert();
	const hasFetched = useRef(false);
	const [profile, setProfile] = useState<UserProfileResponse["data"] | null>(
		null
	);

	useEffect(() => {
		if (userContext.token && !hasFetched.current) {
			showLoading();
			hasFetched.current = true;
			const fetchData = async () => {
				try {
					const promises = [
						fetchProfile({
							token: userContext.token,
							setProfile: setProfile,
							showAlert: showAlert,
						}),
					];

					await Promise.all(promises);
				} catch (error: any) {
					showAlert({
						title: "ไม่สามารถโหลดข้อมูลผู้ใช้ได้",
						description: error.message,
						color: "danger",
					});
				} finally {
					hideLoading();
				}
			};

			fetchData();
		}
	}, [userContext]);

	const handleLogout = () => {
		onOpen();
	};

	const handleConfirmLogout = () => {
		logout();
		onClose();

		router.push("/login");
	};

	const profileSections: FieldSection[] = [
		{
			title: "ข้อมูลส่วนตัว",
			fields: [
				{ name: "รหัสพนักงาน", value: profile?.user_result?.id || "-" },
				{ name: "อีเมล", value: profile?.user_result?.email || "-" },
				{
					name: "ชื่อ-สกุล (TH)",
					value: profile?.profile?.employeeName?.th || "-",
				},
				{
					name: "ชื่อ-สกุล (EN)",
					value: profile?.profile?.employeeName?.en || "-",
				},
				{
					name: "เบอร์โทรศัพท์",
					value: profile?.user_result?.phone || "-",
				},
				{ name: "ที่อยู่", value: "-" },
			],
		},
		{
			title: "ข้อมูลการทำงาน",
			fields: [
				{
					name: "ตำแหน่ง",
					value: profile?.user_result?.role.join(", ") || "-",
				},
				{ name: "ระดับ", value: profile?.profile.level?.name || "-" },
				{
					name: "แผนก",
					value:
						profile?.profile.department?.name?.en?.replace(
							/ Section$/i,
							""
						) || "-",
				},
				{
					name: "สังกัด AE",
					value: profile?.user_result?.user_ae_area?.length
						? profile.user_result.user_ae_area
								.map((ae) => ae.ae_area?.name)
								.join(", ")
						: "-",
				},
			],
		},
	];

	const firstname = profile?.profile.employeeName?.en?.split(" ")[1] || "-";

	return (
		<div className="flex items-center justify-center pt-3">
			<div className="flex flex-col items-center justify-center w-full max-w-sm gap-8 sm:max-w-lg md:max-w-2xl lg:max-w-4xl">
				{isOpen && (
					<AlertModal
						cancelText="ยกเลิก"
						confirmText="ยืนยัน"
						message="คุณแน่ใจหรือไม่ว่าต้องการออกจากระบบ ?"
						title="ออกจากระบบ"
						onClose={onClose}
						onConfirm={handleConfirmLogout}
					/>
				)}

				<div className="flex flex-col items-center justify-center gap-4">
					<div className="flex items-center justify-center w-24 h-24 text-4xl font-bold text-gray-700 bg-gray-200 rounded-full">
						{profile?.user_result.email?.charAt(0)?.toUpperCase() ||
							"-"}
					</div>

					<Header
						hasBorder={false}
						subtitle={`employee_id: ${`@${profile?.profile.id || "-"}`}`}
						subtitleClassName={clsx(
							"mt-1 font-mono text-gray-600 text-sm",
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
