import { AlertComponentProps } from "@/interfaces/props";
import {
	Activity,
	AeArea,
	Car,
	CustomerType,
	OperationArea,
	RequestOrder,
	User,
} from "@/interfaces/schema";
import { getActivities } from "@/libs/activityAPI";
import { getAeAreaAll } from "@/libs/aeAreaAPI";
import { getCars } from "@/libs/carAPI";
import { getCustomerTypes } from "@/libs/customerTypeAPI";
import { getOperationAreas } from "@/libs/operationAreaAPI";
import {
	getRequestOrders,
	getRequestOrderWithTask,
} from "@/libs/requestOrderAPI";
import { getUsers } from "@/libs/userAPI";

/**
 * Translates an enum value using a translation map.
 *
 * @param value - The enum value to translate.
 * @param translationMap - The map containing translations for each enum value.
 * @returns The translated value, or the original value if no translation is found.
 */

export function translateEnumValue<T extends string>(
	value: T,
	translationMap: Record<string, string>
): string {
	return translationMap[value] || value;
}

/**
 * Retrieves a nested value from an object using a dot-separated path.
 *
 * @param obj - The object to retrieve the value from.
 * @param path - The dot-separated path to the desired value.
 * @returns The value at the specified path, or undefined if not found.
 */
export function getNestedValue(obj: Record<string, any>, path: string): any {
	return path.split(".").reduce((acc, part) => acc && acc[part], obj);
}

export async function fetchCustomerTypes({
	token,
	setCustomerTypes,
	setAlert,
	setIsLoading,
}: {
	token: string;
	setCustomerTypes: (options: CustomerType[]) => void;
	setAlert: (alert: AlertComponentProps) => void;
	setIsLoading: (loading: boolean) => void;
}) {
	setIsLoading(true);
	if (token) {
		try {
			const customer_type = await getCustomerTypes({
				token: token,
			});

			setCustomerTypes(customer_type);
		} catch (error: any) {
			setAlert({
				title: "ไม่สามารถโหลดข้อมูลแหล่งที่มาได้",
				description: error.message || "เกิดข้อผิดพลาดในการโหลดข้อมูล",
				color: "danger",
			});
		}
	}
}

export async function fetchReqOrderData({
	token,
	params,
	setReqOrders,
	setAlert,
	setIsLoading,
}: {
	token: string;
	params: any;
	setReqOrders: (orders: RequestOrder[]) => void;
	setAlert: (alert: AlertComponentProps) => void;
	setIsLoading: (loading: boolean) => void;
}) {
	setIsLoading(true);
	if (token && params) {
		try {
			const data = await getRequestOrders({
				token,
				paramData: params,
			});

			setReqOrders(data);
		} catch (error: any) {
			if (error.status === 404) {
				setAlert({
					title: "ไม่พบรายการใบสั่งงานในขณะนี้",
					description: error.message,
					color: "default",
				});
			} else {
				setAlert({
					title: "ไม่สามารถโหลดข้อมูลใบสั่งงานได้",
					description:
						error.message || "เกิดข้อผิดพลาดในการโหลดข้อมูล",
					color: "danger",
				});
			}

			setReqOrders([]);
		}
	}
}

export async function fetchReqOrderWithTaskData({
	token,
	requestId,
	setReqOrder,
	setAlert,
	setIsLoading,
}: {
	token: string;
	requestId: number;
	setReqOrder: (order: RequestOrder) => void;
	setAlert: (alert: AlertComponentProps) => void;
	setIsLoading: (loading: boolean) => void;
}) {
	setIsLoading(true);
	if (token && requestId) {
		try {
			const data = await getRequestOrderWithTask({
				token,
				requestId,
			});

			setReqOrder({
				...data,
				work_order_number: `${data.ae_area?.name}${data.operation_area?.operation_area}${data.ap_year ? Number(data.created_at?.toLocaleString().slice(0, 4)) + 543 : ""}/${data.run_number || ""}`,
			});
		} catch (error: any) {
			if (error.status === 404) {
				setAlert({
					title: "ไม่พบรายการใบสั่งงานในขณะนี้",
					description: error.message,
					color: "default",
				});
			} else {
				setAlert({
					title: "ไม่สามารถโหลดข้อมูลใบสั่งงานได้",
					description:
						error.message || "เกิดข้อผิดพลาดในการโหลดข้อมูล",
					color: "danger",
				});
			}

			setReqOrder({} as RequestOrder);
		}
	}
}

export async function fetchUsers({
	token,
	ae_id,
	role,
	setUsers,
	setAlert,
	setIsLoading,
}: {
	token: string;
	ae_id?: number;
	role?: string[];
	setUsers: (users: User[]) => void;
	setAlert: (alert: AlertComponentProps) => void;
	setIsLoading: (loading: boolean) => void;
}) {
	setIsLoading(true);
	if (token) {
		try {
			const paramData = {
				...(ae_id && { ae_id }),
				...(!(role!.length == 0) && { role }),
			};

			const data = await getUsers({
				token,
				paramData: paramData || {},
			});

			setUsers(data);
		} catch (error: any) {
			if (error.status === 404) {
				setAlert({
					title: "ไม่พบข้อมูลผู้ใช้ในขณะนี้",
					description: error.message,
					color: "default",
				});
			} else {
				setAlert({
					title: "ไม่สามารถโหลดข้อมูลผู้ใช้งานได้",
					description:
						error.message || "เกิดข้อผิดพลาดในการโหลดข้อมูล",
					color: "danger",
				});
			}

			setUsers([] as User[]);
		}
	}
}

export async function fetchAE({
	token,
	setAE,
	setAlert,
	setIsLoading,
}: {
	token: string;
	setAE: (ae: AeArea[]) => void;
	setAlert: (alert: AlertComponentProps) => void;
	setIsLoading: (loading: boolean) => void;
}) {
	setIsLoading(true);
	if (token) {
		try {
			const data = await getAeAreaAll({
				token,
			});

			setAE(data);
		} catch (error: any) {
			if (error.status === 404) {
				setAlert({
					title: "ไม่พบข้อมูลสังกัดในขณะนี้",
					description: error.message,
					color: "default",
				});
			} else {
				setAlert({
					title: "ไม่สามารถโหลดข้อมูลสังกัดได้",
					description:
						error.message || "เกิดข้อผิดพลาดในการโหลดข้อมูล",
					color: "danger",
				});
			}

			setAE([] as AeArea[]);
		}
	}
}

export async function fetchOperationAreas({
	token,
	setOpArea,
	setAlert,
	setIsLoading,
}: {
	token: string;
	setOpArea: (op: OperationArea[]) => void;
	setAlert: (alert: AlertComponentProps) => void;
	setIsLoading: (loading: boolean) => void;
}) {
	setIsLoading(true);
	if (token) {
		try {
			const data = await getOperationAreas({
				token,
			});

			setOpArea(data);
		} catch (error: any) {
			if (error.status === 404) {
				setAlert({
					title: "ไม่พบข้อมูลพื้นที่ปฏิบัติงานในขณะนี้",
					description: error.message,
					color: "default",
				});
			} else {
				setAlert({
					title: "ไม่สามารถโหลดข้อมูลพื้นที่ปฏิบัติงานได้",
					description:
						error.message || "เกิดข้อผิดพลาดในการโหลดข้อมูล",
					color: "danger",
				});
			}

			setOpArea([] as OperationArea[]);
		}
	}
}

export async function fetchCars({
	token,
	ae_id,
	setCars,
	setAlert,
	setIsLoading,
}: {
	token: string;
	ae_id?: number;
	setCars: (cars: Car[]) => void;
	setAlert: (alert: AlertComponentProps) => void;
	setIsLoading: (loading: boolean) => void;
}) {
	setIsLoading(true);
	if (token) {
		try {
			const paramData = {
				...(ae_id && { ae_id }),
			};
			const cars = await getCars({ token, paramData: paramData || {} });

			setCars(cars);
		} catch (error: any) {
			if (error.status === 404) {
				setAlert({
					title: "ไม่พบข้อมูลรถในขณะนี้",
					description: error.message,
					color: "default",
				});
			} else {
				setAlert({
					title: "ไม่สามารถโหลดข้อมูลรถได้",
					description:
						error.message || "เกิดข้อผิดพลาดในการโหลดข้อมูล",
					color: "danger",
				});
			}
			setCars([] as Car[]);
		}
	}
}

export async function fetchActivitiesWithToolTypes({
	token,
	setActivitiesWithToolTypes,
	setAlert,
	setIsLoading,
}: {
	token: string;
	setActivitiesWithToolTypes: (activities: Activity[]) => void;
	setAlert: (alert: AlertComponentProps) => void;
	setIsLoading: (loading: boolean) => void;
}) {
	setIsLoading(true);
	if (token) {
		try {
			const data = await getActivities({
				token,
			});

			setActivitiesWithToolTypes(data);
		} catch (error: any) {
			if (error.status === 404) {
				setAlert({
					title: "ไม่พบข้อมูลกิจกรรมในขณะนี้",
					description: error.message,
					color: "default",
				});
			} else {
				setAlert({
					title: "ไม่สามารถโหลดข้อมูลประเภทกิจกรรมได้",
					description:
						error.message || "เกิดข้อผิดพลาดในการโหลดข้อมูล",
					color: "danger",
				});
			}

			setActivitiesWithToolTypes([] as Activity[]);
		}
	}
}
