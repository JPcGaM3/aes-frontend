import {
	toCalendar,
	BuddhistCalendar,
	parseDate,
} from "@internationalized/date";
import moment from "moment-timezone";

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
	UserProfileResponse,
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
import { getProfile, getUsers } from "@/libs/userAPI";

moment.locale("th");

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

export function convertToChristianCalendar(
	dateValue: any,
	timezone: string = "Asia/Bangkok"
): string | null {
	if (!dateValue) return null;

	try {
		if (typeof dateValue === "object" && dateValue.calendar) {
			const christianYear =
				dateValue.calendar.identifier === "buddhist"
					? dateValue.year - 543
					: dateValue.year;

			const momentDate = moment.tz(
				{
					year: christianYear,
					month: dateValue.month - 1,
					day: dateValue.day,
					hour: dateValue.hour || 0,
					minute: dateValue.minute || 0,
					second: dateValue.second || 0,
					millisecond: dateValue.millisecond || 0,
				},
				timezone
			);

			return momentDate.toISOString();
		}

		if (typeof dateValue === "string") {
			return moment.tz(dateValue, timezone).toISOString();
		}

		if (dateValue instanceof Date) {
			return moment.tz(dateValue, timezone).toISOString();
		}

		return null;
	} catch {
		return null;
	}
}

export function convertToBuddhistCalendar(
	dateValue: any,
	timezone: string = "Asia/Bangkok"
): any | null {
	if (!dateValue) return null;

	try {
		if (typeof dateValue === "object" && dateValue.calendar) {
			if (dateValue.calendar.identifier === "buddhist") {
				return dateValue;
			}

			return toCalendar(dateValue, new BuddhistCalendar());
		}

		if (typeof dateValue === "string") {
			const parsedDate = parseDate(dateValue);

			return toCalendar(parsedDate, new BuddhistCalendar());
		}

		if (dateValue instanceof Date) {
			const dateString = dateValue.toISOString().split("T")[0];
			const parsedDate = parseDate(dateString);

			return toCalendar(parsedDate, new BuddhistCalendar());
		}

		return null;
	} catch {
		return null;
	}
}

/**
 * Example usage
 *
 *  Convert to Christian for database storage
 *	@const christianDate = convertToChristianCalendar(formData.ap_date);
 *
 *	Convert to Buddhist for display
 *	@const buddhistDate = convertToBuddhistCalendar(someDate);
 *
 *	General converter
 *	@const convertedDate = convertDateCalendar(dateValue, 'christian');
 */

export function convertDateCalendar(
	dateValue: any,
	targetCalendar: "buddhist" | "christian",
	timezone: string = "Asia/Bangkok"
): any | null {
	if (targetCalendar === "christian") {
		return convertToChristianCalendar(dateValue, timezone);
	} else {
		return convertToBuddhistCalendar(dateValue, timezone);
	}
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
		} catch (error: any) {
			showAlert({
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
					title: "ไม่สามารถโหลดข้อมูลใบสั่งงานได้",
					description: err.message || "เกิดข้อผิดพลาดในการโหลดข้อมูล",
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

			setTaskOrder({
				...data,
				requestorders: {
					...data.requestorders,
					work_order_number: `${data.requestorders.ae_area?.name || ""}${data.requestorders.operation_area?.operation_area || ""}${data.requestorders.ap_year ? Number(data.requestorders.created_at?.toLocaleString().slice(0, 4)) + 543 : ""}/${data.requestorders.run_number || ""}`,
				},
			});
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

export async function fetchProfile({
	token,
	setProfile,
	showAlert,
}: {
	token: string;
	setProfile: (profile: UserProfileResponse["data"]) => void;
	showAlert: (
		alert: Omit<AlertComponentProps, "isVisible" | "handleClose">
	) => void;
}) {
	if (token) {
		try {
			const data = await getProfile({ token });

			setProfile(data);
		} catch (error: any) {
			if (error.status === 404) {
				showAlert({
					title: "ไม่พบข้อมูลผู้ใช้ในขณะนี้",
					description: error.message,
					color: "default",
				});
			} else {
				showAlert({
					title: "ไม่สามารถโหลดข้อมูลผู้ใช้ได้",
					description:
						error.message || "เกิดข้อผิดพลาดในการโหลดข้อมูล",
					color: "danger",
				});
			}
			setProfile({} as UserProfileResponse["data"]);
		}
	}
}
