import {
  UserRole,
  UserStatus,
  RequestOrderStatus,
  TaskOrderStatus,
} from "./enum";

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
