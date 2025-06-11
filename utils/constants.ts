import {
  REQUESTORDERSTATUS,
  TASKORDERSTATUS,
  USERROLE,
  USERSTATUS,
} from "./enum";

import { ColorType } from "@/types";

export const UserRoleTranslation = {
  [USERROLE.Admin]: "แอดมิน",
  [USERROLE.DepartmentHead]: "หัวหน้าแผนก",
  [USERROLE.UnitHead]: "หัวหน้าหน่วย",
  [USERROLE.Driver]: "พนักขับรถ",
  [USERROLE.Farmpro]: "farmpro",
  [USERROLE.CaneMIS]: "canemis",
  [USERROLE.SongSirm]: "เขตส่งเสริม",
};

export const UserStatusTranslation = {
  [USERSTATUS.Working]: "กำลังทำงาน",
  [USERSTATUS.Inactive]: "ว่างงาน",
  [USERSTATUS.OnLeave]: "ลาหยุด",
};

export const RequestOrderStatusTranslation = {
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

export const TaskOrderStatusTranslation = {
  [TASKORDERSTATUS.Created]: "สร้างคำสั่งงาน",
  [TASKORDERSTATUS.Pending]: "รอการดำเนินการ",
  [TASKORDERSTATUS.InProgress]: "กำลังดำเนินการ",
  [TASKORDERSTATUS.OnHold]: "รอการดำเนินการ",
  [TASKORDERSTATUS.Completed]: "เสร็จสิ้น",
};

export const UserStatusColorMap: Record<USERSTATUS, ColorType> = {
  working: "danger",
  inactive: "primary",
  on_leave: "warning",
};

export const RequestOrderStatusColorMap: Record<REQUESTORDERSTATUS, ColorType> =
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

export const TaskOrderStatusColorMap: Record<TASKORDERSTATUS, ColorType> = {
  created: "default",
  pending: "default",
  in_progress: "primary",
  on_hold: "warning",
  completed: "success",
};
