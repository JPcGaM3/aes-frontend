import { Metadata } from "next";

import ProtectedRoute from "@/components/HigherOrderComponent";
import { USERROLE } from "@/utils/enum";

export const metadata: Metadata = {
	title: "หน้าโปรไฟล์",
};

export default function ProfileLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<ProtectedRoute allowedRoles={Object.values(USERROLE)}>
			<section className="flex flex-col justify-center gap-4">
				<div className="justify-center inline-block w-full">
					{children}
				</div>
			</section>
		</ProtectedRoute>
	);
}
