import {
  UserRole,
  UserStatus,
  RequestOrderStatus,
  TaskOrderStatus,
  RequestOrderInputField,
  TaskOrderInputField,
} from "./enum";

import { ColorType } from "@/types";

export const UserRoleTranslation = {
  [UserRole.Admin]: "แอดมิน",
  [UserRole.DepartmentHead]: "หัวหน้าแผนก",
  [UserRole.UnitHead]: "หัวหน้าหน่วย",
  [UserRole.Driver]: "พนักขับรถ",
  [UserRole.Farmpro]: "farmpro",
  [UserRole.CaneMIS]: "canemis",
  [UserRole.SongSirm]: "เขตส่งเสริม",
};

export const UserStatusTranslation = {
  [UserStatus.Working]: "กำลังทำงาน",
  [UserStatus.Inactive]: "ว่างงาน",
  [UserStatus.OnLeave]: "ลาหยุด",
};

export const RequestOrderStatusTranslation = {
  [RequestOrderStatus.Created]: "สร้างคำสั่งงาน",
  [RequestOrderStatus.PendingApproval]: "รออนุมัติ",
  [RequestOrderStatus.PendingEdit]: "รอแก้ไข",
  [RequestOrderStatus.Pending]: "รอการดำเนินการ",
  [RequestOrderStatus.InProgress]: "กำลังดำเนินการ",
  [RequestOrderStatus.PendingReview]: "รอการตรวจสอบ",
  [RequestOrderStatus.PendingConfirm]: "รอการยืนยัน",
  [RequestOrderStatus.Completed]: "เสร็จสิ้น",
  [RequestOrderStatus.Rejected]: "ถูกปฏิเสธ",
};

export const TaskOrderStatusTranslation = {
  [TaskOrderStatus.Created]: "สร้างคำสั่งงาน",
  [TaskOrderStatus.Pending]: "รอการดำเนินการ",
  [TaskOrderStatus.InProgress]: "กำลังดำเนินการ",
  [TaskOrderStatus.OnHold]: "รอการดำเนินการ",
  [TaskOrderStatus.Completed]: "เสร็จสิ้น",
};

export const RequestOrderInputFieldTranslation = {
  [RequestOrderInputField.CustomerType]: "หัวตารางแจ้งงาน",
  [RequestOrderInputField.Affiliation]: "สังกัด",
  [RequestOrderInputField.Unit]: "เขต",
  [RequestOrderInputField.Quota]: "โควต้า",
  [RequestOrderInputField.Name]: "ชื่อ",
  [RequestOrderInputField.LandNumber]: "เลขที่แปลง",
  [RequestOrderInputField.LocationName]: "ชื่อสถานที่",
  [RequestOrderInputField.Lattitude]: "พิกัด X",
  [RequestOrderInputField.Longitude]: "พิกัด Y",
  [RequestOrderInputField.Supervisor]: "ผู้รับผิดชอบ",
};

export const TaskOrderInputFieldTranslation = {
  [TaskOrderInputField.Activity]: "กิจกรรม",
  [TaskOrderInputField.Tool]: "เครื่องมือ",
  [TaskOrderInputField.StartTime]: "เวลาเริ่มต้น",
};

export const UserStatusColorMap: Record<UserStatus, ColorType> = {
  working: "danger",
  inactive: "primary",
  on_leave: "warning",
};

export const RequestOrderStatusColorMap: Record<RequestOrderStatus, ColorType> =
  {
    created: "default",
    pending_approval: "default",
    pending_edit: "default",
    pending: "default",
    in_progress: "primary",
    pending_review: "default",
    pending_confirm: "default",
    completed: "success",
    rejected: "danger",
  };

export const TaskOrderStatusColorMap: Record<TaskOrderStatus, ColorType> = {
  created: "default",
  pending: "default",
  in_progress: "primary",
  on_hold: "warning",
  completed: "success",
};
