import { useState, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { parseDate, CalendarDate } from "@internationalized/date";

import {
	TaskOrderFormData,
	TaskOrderUIItem,
	TaskOrderOperation,
	RequestOrderFormData,
	FormChangeState,
} from "@/types/form-state";
import { TaskOrder } from "@/interfaces/schema";
import { useAlert } from "@/providers/AlertContext";

interface UseTaskOrderFormReturn {
	taskOrderUIItems: TaskOrderUIItem[];
	formChanges: FormChangeState;
	requestOrderChanges: Partial<RequestOrderFormData>;
	taskOrderErrors: Record<string, string | null>;
	addTaskOrder: () => void;
	removeTaskOrder: (uiId: string) => void;
	updateTaskOrder: (
		uiId: string,
		changes: Partial<TaskOrderFormData>
	) => void;
	updateRequestOrder: (changes: Partial<RequestOrderFormData>) => void;
	validateTaskOrders: () => boolean;
	clearTaskOrderError: (uiId: string, fieldName: string) => void;
	resetChanges: () => void;
	getTaskOrderOperations: () => TaskOrderOperation[];
	initializeFromData: (requestOrder: any) => void;
	hasChanges: () => boolean;
}

export function useTaskOrderForm(): UseTaskOrderFormReturn {
	const { showAlert } = useAlert();

	const [taskOrderUIItems, setTaskOrderUIItems] = useState<TaskOrderUIItem[]>(
		[]
	);
	const [requestOrderChanges, setRequestOrderChanges] = useState<
		Partial<RequestOrderFormData>
	>({});
	const [taskOrderErrors, setTaskOrderErrors] = useState<
		Record<string, string | null>
	>({});
	const [originalTaskOrders, setOriginalTaskOrders] = useState<TaskOrder[]>(
		[]
	);

	const convertDateForAPI = (date: any): string | undefined => {
		if (!date) return undefined;

		if (typeof date === "object" && date.year && date.month && date.day) {
			const year = date.year;
			const month = date.month.toString().padStart(2, "0");
			const day = date.day.toString().padStart(2, "0");

			return `${year}-${month}-${day}`;
		}

		if (typeof date === "string") {
			return date;
		}

		if (date instanceof Date) {
			return date.toISOString().split("T")[0];
		}

		if (date.toString) {
			return date.toString();
		}

		return undefined;
	};

	const convertDateForUI = (
		dateString: string | undefined
	): CalendarDate | undefined => {
		if (!dateString || typeof dateString !== "string") return undefined;

		try {
			const dateOnly = dateString.split("T")[0];
			const [year, month, day] = dateOnly.split("-").map(Number);

			if (year && month && day) {
				return parseDate(
					`${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`
				);
			}

			return undefined;
		} catch {
			return undefined;
		}
	};

	const initializeFromData = useCallback(
		(requestOrder: any) => {
			const taskOrders = requestOrder?.taskorders || [];

			setOriginalTaskOrders(taskOrders);

			const uiItems: TaskOrderUIItem[] = taskOrders.map(
				(task: TaskOrder) => ({
					...task,
					uiId: uuidv4(),
					isNew: false,
					isDeleted: false,
					ap_date: convertDateForUI(task.ap_date as string),
				})
			);

			setTaskOrderUIItems(uiItems);
			setRequestOrderChanges({});
		},
		[convertDateForUI]
	);

	const addTaskOrder = useCallback(() => {
		const activeTaskCount = taskOrderUIItems.filter(
			(item) => !item.isDeleted
		).length;

		if (activeTaskCount >= 5) {
			showAlert({
				title: "เพิ่มกิจกรรมล้มเหลว",
				description: "ไม่สามารถเพิ่มกิจกรรมได้มากกว่า 5 รายการ",
				color: "warning",
			});

			return;
		}

		setTaskOrderUIItems((prev) => {
			const newTaskOrder: TaskOrderUIItem = {
				uiId: uuidv4(),
				isNew: true,
				isDeleted: false,
				activities_id: undefined,
				tool_types_id: undefined,
				car_id: undefined,
				tool_id: undefined,
				assigned_user_id: undefined,
				target_area: undefined,
			};

			return [...prev, newTaskOrder];
		});
	}, [taskOrderUIItems, showAlert]);

	const removeTaskOrder = useCallback((uiId: string) => {
		setTaskOrderUIItems((prev) =>
			prev.map((item) =>
				item.uiId === uiId ? { ...item, isDeleted: true } : item
			)
		);
	}, []);

	const updateTaskOrder = useCallback(
		(uiId: string, changes: Partial<TaskOrderFormData>) => {
			setTaskOrderUIItems((prev) =>
				prev.map((item) =>
					item.uiId === uiId ? { ...item, ...changes } : item
				)
			);

			Object.keys(changes).forEach((fieldName) => {
				const fieldKey = `${uiId}_${fieldName}`;

				if (taskOrderErrors[fieldKey] !== undefined) {
					setTaskOrderErrors((prev) => {
						const newErrors = { ...prev };

						delete newErrors[fieldKey];

						return newErrors;
					});
				}
			});
		},
		[taskOrderErrors]
	);

	const updateRequestOrder = useCallback(
		(changes: Partial<RequestOrderFormData>) => {
			setRequestOrderChanges((prev) => ({ ...prev, ...changes }));
		},
		[]
	);

	const resetChanges = useCallback(() => {
		setRequestOrderChanges({});

		const uiItems: TaskOrderUIItem[] = originalTaskOrders.map(
			(task: TaskOrder) => ({
				...task,
				uiId: uuidv4(),
				isNew: false,
				isDeleted: false,
				ap_date: convertDateForUI(task.ap_date as string),
			})
		);

		setTaskOrderUIItems(uiItems);
	}, [originalTaskOrders, convertDateForUI]);

	const getTaskOrderOperations = useCallback((): TaskOrderOperation[] => {
		const operations: TaskOrderOperation[] = [];

		taskOrderUIItems.forEach((item) => {
			if (item.isNew && !item.isDeleted) {
				operations.push({
					type: "create",
					data: {
						activities_id: item.activities_id,
						tool_types_id: item.tool_types_id,
						car_id: item.car_id,
						tool_id: item.tool_id,
						assigned_user_id: item.assigned_user_id,
						target_area: item.target_area,
						actual_area: item.actual_area,
						price: item.price,
						ap_date: convertDateForAPI(item.ap_date),
					},
				});
			} else if (!item.isNew && item.isDeleted && item.id) {
				operations.push({
					type: "delete",
					data: { id: item.id },
				});
			} else if (!item.isNew && !item.isDeleted && item.id) {
				const original = originalTaskOrders.find(
					(t) => t.id === item.id
				);

				if (original && hasTaskOrderChanged(original, item)) {
					operations.push({
						type: "update",
						data: {
							id: item.id,
							activities_id: item.activities_id,
							tool_types_id: item.tool_types_id,
							car_id: item.car_id,
							tool_id: item.tool_id,
							assigned_user_id: item.assigned_user_id,
							target_area: item.target_area,
							actual_area: item.actual_area,
							price: item.price,
							ap_date: convertDateForAPI(item.ap_date),
						},
					});
				}
			}
		});

		return operations;
	}, [taskOrderUIItems, originalTaskOrders, convertDateForAPI]);

	const hasChanges = useCallback(() => {
		const hasRequestOrderChanges =
			Object.keys(requestOrderChanges).length > 0;
		const hasTaskOrderChanges = getTaskOrderOperations().length > 0;

		return hasRequestOrderChanges || hasTaskOrderChanges;
	}, [requestOrderChanges, getTaskOrderOperations]);

	const validateTaskOrders = useCallback((): boolean => {
		const newErrors: Record<string, string | null> = {};

		taskOrderUIItems
			.filter((item) => !item.isDeleted)
			.forEach((taskOrder) => {
				const requiredFields = [
					"activities_id",
					"tool_types_id",
					"car_id",
					"assigned_user_id",
					"target_area",
					"ap_date",
				];

				requiredFields.forEach((field) => {
					const value = taskOrder[field as keyof TaskOrderUIItem];
					const isEmpty =
						value === undefined ||
						value === null ||
						value === "" ||
						(Array.isArray(value) && value.length === 0);

					if (isEmpty) {
						const fieldKey = `${taskOrder.uiId}_${field}`;

						newErrors[fieldKey] = null;
					}
				});

				if (
					taskOrder.target_area !== undefined &&
					taskOrder.target_area !== null &&
					taskOrder.target_area <= 0
				) {
					const fieldKey = `${taskOrder.uiId}_target_area`;

					newErrors[fieldKey] = "พื้นที่เป้าหมายต้องมากกว่า 0";
				}
			});

		setTaskOrderErrors(newErrors);

		return Object.keys(newErrors).length === 0;
	}, [taskOrderUIItems]);

	const clearTaskOrderError = useCallback(
		(uiId: string, fieldName: string) => {
			const fieldKey = `${uiId}_${fieldName}`;

			if (taskOrderErrors[fieldKey] !== undefined) {
				const newErrors = { ...taskOrderErrors };

				delete newErrors[fieldKey];
				setTaskOrderErrors(newErrors);
			}
		},
		[taskOrderErrors]
	);

	const formChanges: FormChangeState = {
		requestOrder: requestOrderChanges,
		taskOrders: getTaskOrderOperations(),
	};

	return {
		taskOrderUIItems: taskOrderUIItems.filter((item) => !item.isDeleted),
		formChanges,
		requestOrderChanges,
		taskOrderErrors,
		addTaskOrder,
		removeTaskOrder,
		updateTaskOrder,
		updateRequestOrder,
		validateTaskOrders,
		clearTaskOrderError,
		resetChanges,
		getTaskOrderOperations,
		initializeFromData,
		hasChanges,
	};
}

function hasTaskOrderChanged(
	original: TaskOrder,
	current: TaskOrderUIItem
): boolean {
	const fieldsToCheck: (keyof TaskOrderFormData)[] = [
		"activities_id",
		"tool_types_id",
		"car_id",
		"tool_id",
		"assigned_user_id",
		"target_area",
		"actual_area",
		"price",
		"ap_date",
	];

	return fieldsToCheck.some((field) => {
		const originalValue = original[field];
		const currentValue = current[field];

		if (field === "ap_date") {
			const originalDateString =
				typeof originalValue === "string"
					? originalValue
					: originalValue?.toString?.() || "";
			const currentDateString =
				typeof currentValue === "string"
					? currentValue
					: currentValue?.toString?.() || "";

			return originalDateString !== currentDateString;
		}

		return originalValue !== currentValue;
	});
}
