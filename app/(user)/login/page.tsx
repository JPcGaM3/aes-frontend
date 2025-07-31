"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

import { FormSection } from "@/interfaces/interfaces";
import { useAuth } from "@/providers/AuthContext";
import FormComponent from "@/components/FormComponent";
import { RequestOrderTranslation } from "@/utils/constants";
import { useLoading } from "@/providers/LoadingContext";
import { useAlert } from "@/providers/AlertContext";
import { USERROLE } from "@/utils/enum";

export default function LoginPage() {
	const router = useRouter();

	const { login, userContext, isReady } = useAuth();
	const { showLoading, hideLoading } = useLoading();
	const { showAlert } = useAlert();

	const handleSubmit = async (values: any) => {
		showLoading();
		const isEmail = values.username.includes("@mitrphol.com");

		const body = isEmail
			? { email: values.username, password: values.password }
			: { username: values.username, password: values.password };

		try {
			await login({
				params: {
					ae_id: values.ae_id,
				},
				body: {
					...body,
				},
			});
		} catch (error: any) {
			showAlert({
				title: "เข้าสู่ระบบล้มเหลว",
				description: error.message || "เกิดข้อผิดพลาดในการเข้าสู่ระบบ",
				color: "danger",
			});
		} finally {
			hideLoading();
		}
	};

	useEffect(() => {
		if (isReady && userContext.token) {
			if (
				userContext.role.find(
					(role) =>
						role === USERROLE.Admin || role === USERROLE.UnitHead
				)
			) {
				router.push("/request");
			} else if (
				userContext.role.find(
					(role) => role === USERROLE.DepartmentHead
				)
			) {
				router.push("/list");
			} else if (
				userContext.role.find((role) => role === USERROLE.Driver)
			) {
				router.push("/assigned/task");
			} else {
				router.push("/home");
			}
		}
	}, [userContext, isReady]);

	const sections: FormSection[] = [
		{
			fields: [
				{
					type: "text",
					name: "username",
					label: "ชื่อผู้ใช้งาน",
					isRequired: true,
				},
				{
					type: "password",
					name: "password",
					label: "รหัสผ่าน",
					isRequired: true,
				},
				{
					type: "dropdown",
					name: "ae_id",
					labelTranslator: RequestOrderTranslation,
					isRequired: true,
					options: [
						{ label: "CT0", value: 1 },
						{ label: "NE1", value: 2 },
						{ label: "NE2", value: 3 },
					],
				},
				{
					type: "date",
					name: "end_date",
					label: "วันที่สิ้นสุด",
					calendarProps: {
						minValue: new Date(),
						maxValue: new Date(
							Date.now() + 365 * 24 * 60 * 60 * 1000
						),
					},
					isRequired: true,
				},
			],
		},
	];

	return (
		<div className="flex items-center justify-center w-full">
			<FormComponent
				isCompact={true}
				sections={sections}
				submitLabel="ยืนยัน"
				subtitle="กรุณาระบุตัวตนเพื่อเข้าใช้งาน"
				title="ยินดีต้อนรับสู่ AE Service"
				onSubmit={handleSubmit}
			/>
		</div>
	);
}
