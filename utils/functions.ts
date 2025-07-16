import { AlertComponentProps } from "@/interfaces/props";
import {
	Activity,
	AeArea,
	Car,
	CustomerType,
	OperationArea,
	RequestOrder,
	TaskOrder,
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
import { getAssignedTask, getTaskById } from "@/libs/taskOrderAPI";
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
	showAlert,
}: {
	token: string;
	setCustomerTypes: (options: CustomerType[]) => void;
	showAlert: (
		alert: Omit<AlertComponentProps, "isVisible" | "handleClose">
	) => void;
}) {
	if (token) {
		try {
			const customer_type = await getCustomerTypes({
				token: token,
			});

			setCustomerTypes(customer_type);
		} catch (err: any) {
			showAlert({
				title: "Failed to fetch customer types",
				description: err.message,
				color: "danger",
			});
		}
	}
}

export async function fetchReqOrderData({
	token,
	params,
	setReqOrders,
	showAlert,
}: {
	token: string;
	params: any;
	setReqOrders: (orders: RequestOrder[]) => void;
	showAlert: (
		alert: Omit<AlertComponentProps, "isVisible" | "handleClose">
	) => void;
}) {
	if (token && params) {
		try {
			const data = await getRequestOrders({
				token,
				paramData: params,
			});

			setReqOrders(data);
		} catch (err: any) {
			if (err.status === 404) {
				showAlert({
					title: "ไม่พบรายการใบสั่งงานในขณะนี้",
					description: err.message,
					color: "default",
				});
			} else {
				showAlert({
					title: "Failed to fetch",
					description: err.message,
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
	showAlert,
}: {
	token: string;
	requestId: number;
	setReqOrder: (order: RequestOrder) => void;
	showAlert: (
		alert: Omit<AlertComponentProps, "isVisible" | "handleClose">
	) => void;
}) {
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
				showAlert({
					title: "ไม่พบรายการใบสั่งงานในขณะนี้",
					description: error.message,
					color: "default",
				});
			} else {
				showAlert({
					title: "Failed to fetch",
					description: error.message,
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
	showAlert,
}: {
	token: string;
	ae_id?: number;
	role?: string[];
	setUsers: (users: User[]) => void;
	showAlert: (
		alert: Omit<AlertComponentProps, "isVisible" | "handleClose">
	) => void;
}) {
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
				showAlert({
					title: "ไม่พบข้อมูลผู้ใช้ในขณะนี้",
					description: error.message,
					color: "default",
				});
			} else {
				showAlert({
					title: "Failed to fetch",
					description: error.message,
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
	showAlert,
}: {
	token: string;
	setAE: (ae: AeArea[]) => void;
	showAlert: (
		alert: Omit<AlertComponentProps, "isVisible" | "handleClose">
	) => void;
}) {
	if (token) {
		try {
			const data = await getAeAreaAll({
				token,
			});

			setAE(data);
		} catch (error: any) {
			if (error.status === 404) {
				showAlert({
					title: "ไม่พบข้อมูลสังกัดในขณะนี้",
					description: error.message,
					color: "default",
				});
			} else {
				showAlert({
					title: "Failed to fetch",
					description: error.message,
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
	showAlert,
}: {
	token: string;
	setOpArea: (op: OperationArea[]) => void;
	showAlert: (
		alert: Omit<AlertComponentProps, "isVisible" | "handleClose">
	) => void;
}) {
	if (token) {
		try {
			const data = await getOperationAreas({
				token,
			});

			setOpArea(data);
		} catch (error: any) {
			if (error.status === 404) {
				showAlert({
					title: "ไม่พบข้อมูลพื้นที่ปฏิบัติงานในขณะนี้",
					description: error.message,
					color: "default",
				});
			} else {
				showAlert({
					title: "Failed to fetch",
					description: error.message,
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
	showAlert,
}: {
	token: string;
	ae_id?: number;
	setCars: (cars: Car[]) => void;
	showAlert: (
		alert: Omit<AlertComponentProps, "isVisible" | "handleClose">
	) => void;
}) {
	if (token) {
		try {
			const paramData = {
				...(ae_id && { ae_id }),
			};
			const cars = await getCars({ token, paramData: paramData || {} });

			setCars(cars);
		} catch (error: any) {
			if (error.status === 404) {
				showAlert({
					title: "ไม่พบข้อมูลรถในขณะนี้",
					description: error.message,
					color: "default",
				});
			} else {
				showAlert({
					title: "Failed to fetch cars",
					description: error.message,
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
	showAlert,
}: {
	token: string;
	setActivitiesWithToolTypes: (activities: Activity[]) => void;
	showAlert: (
		alert: Omit<AlertComponentProps, "isVisible" | "handleClose">
	) => void;
}) {
	if (token) {
		try {
			const data = await getActivities({
				token,
			});

			setActivitiesWithToolTypes(data);
		} catch (error: any) {
			if (error.status === 404) {
				showAlert({
					title: "ไม่พบข้อมูลกิจกรรมในขณะนี้",
					description: error.message,
					color: "default",
				});
			} else {
				showAlert({
					title: "Failed to fetch",
					description: error.message,
					color: "danger",
				});
			}

			setActivitiesWithToolTypes([] as Activity[]);
		}
	}
}

export async function fetchAssignedTask({
	token,
	user_id,
	setTaskOrders,
	showAlert,
}: {
	token: string;
	user_id?: number;
	setTaskOrders: (orders: TaskOrder[]) => void;
	showAlert: (
		alert: Omit<AlertComponentProps, "isVisible" | "handleClose">
	) => void;
}) {
	if (token) {
		try {
			const paramData = {
				...(user_id && { user_id }),
			};

			const data = await getAssignedTask({
				token,
				paramData,
			});

			setTaskOrders(data);
		} catch (err: any) {
			if (err.status === 404) {
				showAlert({
					title: "ไม่พบรายการใบงานย่อยในขณะนี้",
					description: err.message,
					color: "default",
				});
			} else {
				showAlert({
					title: "Failed to fetch",
					description: err.message,
					color: "danger",
				});
			}

			setTaskOrders([] as TaskOrder[]);
		}
	}
}

export async function fetchTaskOrder({
	token,
	taskId,
	setTaskOrder,
	showAlert,
}: {
	token: string;
	taskId: number;
	setTaskOrder: (orders: TaskOrder) => void;
	showAlert: (
		alert: Omit<AlertComponentProps, "isVisible" | "handleClose">
	) => void;
}) {
	if (token && taskId) {
		try {
			const data = await getTaskById({
				token,
				paramData: {
					taskId,
				},
			});

			setTaskOrder(data);
		} catch (err: any) {
			if (err.status === 404) {
				showAlert({
					title: "ไม่พบรายการใบงานย่อยในขณะนี้",
					description: err.message,
					color: "default",
				});
			} else {
				showAlert({
					title: "Failed to fetch",
					description: err.message,
					color: "danger",
				});
			}
			setTaskOrder({} as TaskOrder);
		}
	}
}
