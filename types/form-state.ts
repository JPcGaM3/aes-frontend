import type { CalendarDate } from "@internationalized/date";

export interface TaskOrderFormData {
	id?: number;
	activities_id?: number;
	tool_types_id?: number;
	car_id?: number;
	tool_id?: number;
	assigned_user_id?: number;
	target_area?: number;
	actual_area?: number;
	price?: number;
	ap_date?: string | Date | CalendarDate;
}

export interface RequestOrderFormData {
	customer_type_id?: number;
	phone?: string;
	operation_area_id?: number;
	ae_id?: number;
	zone?: string;
	quota_number?: string;
	farmer_name?: string;
	target_area?: number;
	land_number?: number;
	location_xy?: string;
	ap_month?: string;
	ap_year?: number;
	supervisor_name?: string;
	unit_head_id?: number;
}

export interface TaskOrderOperation {
	type: "create" | "update" | "delete";
	data: TaskOrderFormData;
	originalIndex?: number; // for tracking position in UI
}

export interface FormChangeState {
	requestOrder: Partial<RequestOrderFormData>;
	taskOrders: TaskOrderOperation[];
}

// Helper types for UI operations
export interface TaskOrderUIItem extends TaskOrderFormData {
	uiId: string; // unique ID for React keys
	isNew: boolean; // true if this is a new task order
	isDeleted: boolean; // true if marked for deletion
}
