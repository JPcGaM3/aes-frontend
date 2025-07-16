"use client";

import React from "react";
import { use } from "react";
import moment from "moment-timezone";
import { useSearchParams, usePathname, useRouter } from "next/navigation";

import ProtectedRoute from "@/components/HigherOrderComponent";
import { USERROLE } from "@/utils/enum";

moment.locale("th");

export default function TaskManagementPage({
	params,
}: {
	params: Promise<{ tid: string }>;
}) {
	const { tid } = use(params);
	// const { setIsLoading } = useLoading();
	// const { userContext, isReady } = useAuth();

	const searchParams = useSearchParams();
	const router = useRouter();
	const pathname = usePathname();
	const action = searchParams.get("action") || "view";

	// const [taskOrder, setTaskOrder] = useState<TaskOrder>({} as TaskOrder);

	// const hasFetched = useRef(false);
	// const [selectedTab, setSelectedTab] = useState(action);

	// const [isSubmitting, setIsSubmitting] = useState(false);
	// const [commentValues, setCommentValues] = useState<{
	// 	comment: string;
	// }>({
	// 	comment: "",
	// });
	// const [alert, setAlert] = useState<AlertComponentProps>({
	// 	title: "",
	// 	description: "",
	// 	isVisible: false,
	// });

	// useEffect(() => {
	// 	if (tid && isReady && !hasFetched.current) {
	// 		setIsLoading(true);
	// 		hasFetched.current = true;
	// 		const fetchData = async () => {
	// 			try {
	// 				const promises = [
	// 					fetchTaskOrder({
	// 						token: userContext.token,
	// 						taskId: Number(tid),
	// 						setTaskOrder,
	// 						setAlert,
	// 					}),
	// 				];

	// 				await Promise.all(promises);
	// 			} catch (error: any) {
	// 				setAlert({
	// 					title: "Failed to fetch",
	// 					description: error.message || "Unknown error occurred",
	// 					color: "danger",
	// 					isVisible: true,
	// 				});
	// 			} finally {
	// 				setIsLoading(false);
	// 			}
	// 		};

	// 		fetchData();
	// 	}
	// }, [isReady, tid]);

	// const handleTabChange = (key: React.Key) => {
	// 	if (typeof key === "string") {
	// 		setSelectedTab(key);

	// 		const newSearchParams = new URLSearchParams(
	// 			searchParams.toString()
	// 		);

	// 		newSearchParams.set("action", key);

	// 		const newQuery = newSearchParams.toString();

	// 		router.replace(`${pathname}${newQuery ? `?${newQuery}` : ""}`);
	// 	}
	// };

	// const handleCommentChange = (newValues: typeof commentValues) => {
	// 	setCommentValues(newValues);
	// };

	// const handleCancel = () => {
	// 	setIsLoading(true);
	// 	setCommentValues({ comment: "" });
	// 	router.back();
	// };

	// const handleStatus = async (): Promise<any> => {
	// 	if (
	// 		tid ||
	// 		isReady ||
	// 		userContext.id ||
	// 		userContext.role ||
	// 		userContext.token ||
	// 		userContext.ae_id
	// 	) {
	// 		setIsSubmitting(true);

	// 		if (!commentValues.comment.trim()) {
	// 			setAlert({
	// 				title: "Warning!!",
	// 				description: "คำอธิบาย: กรุณาระบุเหตุผล",
	// 				color: "warning",
	// 				isVisible: true,
	// 			});

	// 			setIsSubmitting(false);

	// 			return;
	// 		}

	// 		try {
	// 			const paramData = {
	// 				comment: (commentValues.comment as string) || undefined,
	// 			};

	// 			await SetStatusTaskOrder({
	// 				token: userContext.token,
	// 				tid: Number(tid),
	// 				paramData: paramData,
	// 			});

	// 			setAlert({
	// 				title: "แจ้งปัญหาใบงานย่อยสำเร็จ",
	// 				description: `แจ้งปัญหาใบงานย่อยเลขที่ ${taskOrder.id} แล้ว`,
	// 				color: "success",
	// 				isVisible: true,
	// 			});

	// 			setTimeout(() => {
	// 				router.back();
	// 			}, 2000);
	// 		} catch (err: any) {
	// 			setAlert({
	// 				title: "แจ้งปัญหาใบงานย่อยไม่สำเร็จ",
	// 				description: err.message || "Unknown error occurred",
	// 				color: "danger",
	// 				isVisible: true,
	// 			});
	// 		} finally {
	// 			setIsSubmitting(false);
	// 		}
	// 	} else {
	// 		setAlert({
	// 			title: "ไม่สามารถโหลดข้อมูลผู้ใช้งานได้",
	// 			description: "กรุณาเข้าสู่ระบบและลองอีกครั้ง",
	// 			color: "danger",
	// 			isVisible: true,
	// 		});

	// 		setTimeout(() => {
	// 			setIsLoading(false);
	// 			router.push("/login");
	// 		}, 2000);
	// 	}
	// };

	return (
		<>
			<ProtectedRoute allowedRoles={[USERROLE.Admin, USERROLE.Driver]}>
				Task Management Page for {tid}
			</ProtectedRoute>
		</>
	);
}
