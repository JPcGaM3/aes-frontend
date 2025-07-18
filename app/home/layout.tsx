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
		<ProtectedRoute
			allowedRoles={[
				USERROLE.Admin,
				USERROLE.DepartmentHead,
				USERROLE.UnitHead,
				USERROLE.Driver,
			]}
		>
			<section className="flex flex-col justify-center gap-4">
				<div className="justify-center inline-block w-full">
					{children}
				</div>
			</section>
		</ProtectedRoute>
	);
}
