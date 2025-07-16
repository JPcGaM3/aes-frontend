"use client";

import React from "react";
import { useRouter } from "next/navigation";

import { FormSection } from "@/interfaces/interfaces";
import { useAuth } from "@/providers/AuthContext";
import FormComponent from "@/components/FormComponent";
import { RequestOrderTranslation } from "@/utils/constants";
import { useLoading } from "@/providers/LoadingContext";
import { useAlert } from "@/providers/AlertContext";

export default function LoginPage() {
	const router = useRouter();

	const { login } = useAuth();
	const { setIsLoading } = useLoading();
	const { showAlert } = useAlert();

	const handleSubmit = async (values: any) => {
		setIsLoading(true);
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
			router.push("/home");
		} catch (error: any) {
			showAlert({
				title: "เข้าสู่ระบบล้มเหลว",
				description: error.message || "เกิดข้อผิดพลาดในการเข้าสู่ระบบ",
				color: "danger",
			});
		} finally {
			setIsLoading(false);
		}
	};

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
			],
		},
	];

	return (
		<div className="flex justify-center items-center w-full">
			<FormComponent
				isCompact={true}
				sections={sections}
				submitLabel="ยืนยัน"
				subtitle="กรุณาระบุตัวตนเพื่อเข้าใช้งาน"
				title="ยินดีต้อนรับ"
				onSubmit={handleSubmit}
			/>
		</div>
	);
}
