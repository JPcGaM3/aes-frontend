import { Metadata } from "next";

import ProtectedRoute from "@/components/HigherOrderComponent";
import { USERROLE } from "@/utils/enum";

export const metadata: Metadata = {
	title: "หน้าแรก",
};

export default function HomeLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<ProtectedRoute allowedRoles={Object.values(USERROLE)}>
			<section className="flex flex-col justify-center gap-4">
				<div className="inline-block justify-center w-full">
					{children}
				</div>
			</section>
		</ProtectedRoute>
	);
}
