import Header from "@/components/Header";
import ProtectedRoute from "@/components/HigherOrderComponent";
import { USERROLE } from "@/utils/enum";

export default function HomePage() {
	return (
		<ProtectedRoute
			allowedRoles={[
				USERROLE.Admin,
				USERROLE.DepartmentHead,
				USERROLE.UnitHead,
				USERROLE.Driver,
			]}
		>
			<div>
				<Header
					subtitle="ยินดีต้อนรับสู่ AE Service"
					title="หน้าหลัก"
				/>
			</div>
		</ProtectedRoute>
	);
}
