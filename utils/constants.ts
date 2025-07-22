import {
	REQUESTORDERSTATUS,
	TASKORDERSTATUS,
	USERROLE,
	USERSTATUS,
} from "./enum";

import { DropdownOption } from "@/interfaces/interfaces";
import { ColorType } from "@/types";

const UserRoleTranslation = {
	[USERROLE.Admin]: "แอดมิน",
	[USERROLE.DepartmentHead]: "หัวหน้าแผนก",
	[USERROLE.UnitHead]: "หัวหน้าหน่วย",
	[USERROLE.Driver]: "พนักงานขับรถ",
	[USERROLE.Farmpro]: "farmpro",
	[USERROLE.CaneMIS]: "canemis",
	[USERROLE.SongSirm]: "เขตส่งเสริม",
};

const UserStatusTranslation = {
	[USERSTATUS.Working]: "กำลังทำงาน",
	[USERSTATUS.Inactive]: "ว่างงาน",
	[USERSTATUS.OnLeave]: "ลาหยุด",
};

const RequestOrderStatusTranslation = {
	[REQUESTORDERSTATUS.Created]: "สร้างคำสั่งงาน",
	[REQUESTORDERSTATUS.PendingApproval]: "รออนุมัติ",
	[REQUESTORDERSTATUS.PendingEdit]: "รอแก้ไข",
	[REQUESTORDERSTATUS.Pending]: "รอการดำเนินการ",
	[REQUESTORDERSTATUS.InProgress]: "กำลังดำเนินการ",
	[REQUESTORDERSTATUS.PendingReview]: "รอการตรวจสอบ",
	[REQUESTORDERSTATUS.PendingConfirm]: "รอการยืนยัน",
	[REQUESTORDERSTATUS.Completed]: "เสร็จสิ้น",
	[REQUESTORDERSTATUS.Rejected]: "ถูกปฏิเสธ",
	[REQUESTORDERSTATUS.Cancelled]: "ถูกยกเลิก",
};

const RequestOrderStatusColorMap: Record<REQUESTORDERSTATUS, ColorType> = {
	CREATED: "default",
	PENDING_APPROVAL: "warning",
	PENDING_EDIT: "warning",
	PENDING: "warning",
	IN_PROGRESS: "primary",
	PENDING_REVIEW: "warning",
	PENDING_CONFIRM: "warning",
	COMPLETED: "success",
	REJECTED: "danger",
	CANCELLED: "danger",
};

const TaskOrderStatusTranslation = {
	[TASKORDERSTATUS.Created]: "สร้างคำสั่งงาน",
	[TASKORDERSTATUS.InProgress]: "กำลังดำเนินการ",
	[TASKORDERSTATUS.Completed]: "เสร็จสิ้น",
};

const TaskOrderStatusColorMap: Record<TASKORDERSTATUS, ColorType> = {
	CREATED: "default",
	PENDING: "default",
	IN_PROGRESS: "primary",
	ON_HOLD: "warning",
	COMPLETED: "success",
	CANCELLED: "danger",
	REJECTED: "danger",
};

const RequestOrderTranslation: Record<string, string> = {
	work_order_number: "เลขที่ใบสั่งงาน",
	phone: "เบอร์ติดต่อ",
	customer_type_id: "กลุ่มลูกค้า",
	operation_area_id: "พื้นที่ปฏิบัติงาน",
	quota_number: "รหัสโควต้า",
	farmer_name: "ชื่อไร่/ชื่อชาวไร่",
	land_number: "เลขที่แปลง",
	zone: "รหัสไร่/เขต",
	ap_month: "เดือนปฏิบัติงาน",
	ap_year: "ปีปฏิบัติงาน",
	ae_id: "สังกัด",
	target_area: "พื้นที่เป้าหมาย",
	actual_area: "พื้นที่จริง",
	active: "สถานะใช้งาน",
	evidence: "หลักฐาน",
	sale: "ค่าใช้บริการ",
	status: "สถานะ",
	supervisor_name: "ผู้ประสานงาน",
	location_xy: "พิกัด",
	activities: "กิจกรรม",
	tool_types: "ประเภทเครื่องมือ",
	unit_head_id: "หัวหน้าหน่วย",
	count: "จำนวนกิจกรรม",
	comment: "หมายเหตุ",
	created_at: "วันที่สร้าง",
	created_by: "ผู้สร้าง",
	updated_at: "วันที่แก้ไข",
	updated_by: "ผู้แก้ไข",
};

const TaskOrderTranslation: Record<string, string> = {
	id: "รหัสงานย่อย",
	target_area: "พื้นที่เป้าหมาย",
	actual_area: "พื้นที่จริง",
	price: "ราคา",
	comment: "หมายเหตุ",
	ap_date: "วันที่ปฏิบัติงาน",
	start_date: "วันที่เริ่มต้น",
	start_time: "เวลาเริ่มต้น",
	end_date: "วันที่สิ้นสุด",
	end_time: "เวลาสิ้นสุด",
	oil_slip: "สลิปน้ำมัน",
	oil_start_mile: "เลขไมล์เริ่มต้น (น้ำมัน)",
	start_mile: "เลขไมล์เริ่มต้น",
	end_mile: "เลขไมล์สิ้นสุด",
	oil_start: "น้ำมันเริ่มต้น",
	oil_end: "น้ำมันสิ้นสุด",
	car_start_hour: "ชั่วโมงรถเริ่มต้น",
	car_end_hour: "ชั่วโมงรถสิ้นสุด",
	start_timer: "เวลาเริ่มต้น",
	end_timer: "เวลาสิ้นสุด",
	status: "สถานะ",
	request_order_id: "รหัสคำสั่งงานหลัก",
	car_id: "รถ",
	tool_id: "เครื่องมือ",
	tool_types_id: "ประเภทเครื่องมือ",
	activities_id: "กิจกรรม",
	user_id: "ผู้ปฏิบัติงาน",
	assigned_user_id: "ผู้รับมอบหมาย",
	created_at: "วันที่สร้าง",
	updated_at: "วันที่แก้ไข",
	created_by: "ผู้สร้าง",
	updated_by: "ผู้แก้ไข",
};

const UserStatusColorMap: Record<USERSTATUS, ColorType> = {
	WORKING: "danger",
	INACTIVE: "primary",
	ON_LEAVE: "warning",
};

const month: Record<string, string> = {
	January: "มกราคม",
	February: "กุมภาพันธ์",
	March: "มีนาคม",
	April: "เมษายน",
	May: "พฤษภาคม",
	June: "มิถุนายน",
	July: "กรกฎาคม",
	August: "สิงหาคม",
	September: "กันยายน",
	October: "ตุลาคม",
	November: "พฤศจิกายน",
	December: "ธันวาคม",
};

const monthList = [
	...Object.entries(month).map(([value, label]) => ({
		label: label as string,
		value: value as string,
	})),
];

const getYearList = ({
	range = 5,
	canSelectPast = false,
}: {
	range?: number;
	canSelectPast?: boolean;
}): DropdownOption[] => {
	const now = new Date();
	const currentYear = now.getFullYear();
	const startYear = canSelectPast ? currentYear - range : currentYear;
	const endYear = currentYear + range;

	return Array.from({ length: endYear - startYear + 1 }, (_, i) => ({
		label: (startYear + i).toString(),
		value: startYear + i,
	}));
};

const colorClasses = {
	default: {
		solid: "bg-default text-default-foreground",
		flat: "bg-default-100 text-default-foreground",
		faded: "bg-default-100 border-1 border-default-300 text-default-foreground",
		bordered: "bg-transparent border-1 border-default text-default",
	},
	primary: {
		solid: "bg-primary text-primary-foreground",
		flat: "bg-primary-50 text-primary-600",
		faded: "bg-primary-50 border-1 border-primary-200 text-primary-600",
		bordered: "bg-transparent border-1 border-primary text-primary",
	},
	secondary: {
		solid: "bg-secondary text-secondary-foreground",
		flat: "bg-secondary-50 text-secondary-600",
		faded: "bg-secondary-50 border-1 border-secondary-200 text-secondary-600",
		bordered: "bg-transparent border-1 border-secondary text-secondary",
	},
	success: {
		solid: "bg-success text-success-foreground",
		flat: "bg-success-50 text-success-700",
		faded: "bg-success-50 border-1 border-success-300 text-success-700",
		bordered: "bg-transparent border-1 border-success text-success",
	},
	warning: {
		solid: "bg-warning text-warning-foreground",
		flat: "bg-warning-50 text-warning-700",
		faded: "bg-warning-50 border-1 border-warning-300 text-warning-700",
		bordered: "bg-transparent border-1 border-warning text-warning",
	},
	danger: {
		solid: "bg-danger text-danger-foreground",
		flat: "bg-danger-50 text-danger-600",
		faded: "bg-danger-50 border-1 border-danger-200 text-danger-600",
		bordered: "bg-transparent border-1 border-danger text-danger",
	},
};

export {
	UserRoleTranslation,
	UserStatusTranslation,
	TaskOrderStatusTranslation,
	RequestOrderStatusTranslation,
	TaskOrderTranslation,
	RequestOrderTranslation,
	colorClasses,
	UserStatusColorMap,
	TaskOrderStatusColorMap,
	RequestOrderStatusColorMap,
	month,
	monthList,
	getYearList,
};
