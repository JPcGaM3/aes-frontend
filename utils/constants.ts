import {
	REQUESTORDERSTATUS,
	TASKORDERSTATUS,
	USERROLE,
	USERSTATUS,
} from "./enum";

import { ColorType } from "@/types";

const UserRoleTranslation = {
	[USERROLE.Admin]: "แอดมิน",
	[USERROLE.DepartmentHead]: "หัวหน้าแผนก",
	[USERROLE.UnitHead]: "หัวหน้าหน่วย",
	[USERROLE.Driver]: "พนักขับรถ",
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
	[TASKORDERSTATUS.Pending]: "รอการดำเนินการ",
	[TASKORDERSTATUS.InProgress]: "กำลังดำเนินการ",
	[TASKORDERSTATUS.OnHold]: "รอการดำเนินการ",
	[TASKORDERSTATUS.Completed]: "เสร็จสิ้น",
};

const TaskOrderStatusColorMap: Record<TASKORDERSTATUS, ColorType> = {
	CREATED: "default",
	PENDING: "default",
	IN_PROGRESS: "primary",
	ON_HOLD: "warning",
	COMPLETED: "success",
	CANCELLED: "danger",
};

const RequestOrderTranslation: Record<string, string> = {
	work_order_number: "เลขที่ใบสั่งงาน",
	phone: "เบอร์ติดต่อ",
	customer_type_id: "แหล่งที่มา",
	operation_area_id: "พื้นที่ปฏิบัติงาน",
	quota_number: "รหัสโควต้า",
	farmer_name: "ชื่อไร่",
	land_number: "เลขที่แปลง",
	zone: "รหัสไร่",
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
	unit_head: "หัวหน้าหน่วย",
	count: "จำนวนกิจกรรม",
	comment: "หมายเหตุ",
	created_at: "วันที่สร้าง",
	created_by: "ผู้สร้าง",
	updated_at: "วันที่แก้ไข",
	updated_by: "ผู้แก้ไข",
};

const TaskOrderTranslation: Record<string, string> = {
	id: "รหัสงานย่อย",
	area_number: "เลขที่พื้นที่",
	area_target: "พื้นที่เป้าหมาย",
	area_actual: "พื้นที่จริง",
	price: "ราคา",
	comment: "หมายเหตุ",
	ap_date: "วันที่ปฏิบัติงาน",
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
	car_id: "รหัสรถ",
	tool_id: "รหัสเครื่องมือ",
	tool_type_name: "ประเภทเครื่องมือ",
	activity_name: "กิจกรรม",
	assigned_user_id: "รหัสผู้รับมอบหมาย",
	created_at: "วันที่สร้าง",
	updated_at: "วันที่แก้ไข",
	created_by: "ผู้สร้าง",
	updated_by: "ผู้แก้ไข",
};

const UserStatusColorMap: Record<USERSTATUS, ColorType> = {
	WORKING: "warning",
	INACTIVE: "primary",
	ON_LEAVE: "warning",
	CANCELLED: "default",
	REJECTED: "danger",
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

const years = [2024, 2025, 2026, 2027, 2028, 2029, 2030];

const monthList = [
	...Object.entries(month).map(([value, label]) => ({
		label: label as string,
		value: value as string,
	})),
];

const yearList = [
	...years.map((year) => ({
		label: String(year + 543),
		value: String(year),
	})),
];

const yearMap = yearList.reduce(
	(acc, { value, label }) => ({ ...acc, [value]: label }),
	{} as Record<string, string>
);

export {
	UserRoleTranslation,
	UserStatusTranslation,
	RequestOrderStatusTranslation,
	TaskOrderStatusTranslation,
	RequestOrderTranslation,
	TaskOrderTranslation,
	UserStatusColorMap,
	RequestOrderStatusColorMap,
	TaskOrderStatusColorMap,
	month,
	monthList,
	years,
	yearList,
	yearMap,
};
