export enum USERROLE {
  Admin = "admin",
  DepartmentHead = "department_head",
  UnitHead = "unit_head",
  Driver = "driver",
  Farmpro = "farmpro",
  CaneMIS = "canemis",
  SongSirm = "song_sirm",
  Manager = "manager",
  SubManager = "sub_manager",
  Commander = "commander",
  SubCommander = "sub_commander",
  Accountant = "accountant",
  Maintenance = "maintenance",
}

export enum USERSTATUS {
  Working = "working",
  Inactive = "inactive",
  OnLeave = "on_leave",
  Cancelled = "cancelled",
  Rejected = "rejected",
}

export enum REQUESTORDERSTATUS {
  Created = "created",
  PendingApproval = "pending_approval",
  PendingEdit = "pending_edit",
  Pending = "pending",
  InProgress = "in_progress",
  PendingReview = "pending_review",
  PendingConfirm = "pending_confirm",
  Completed = "completed",
  Rejected = "rejected",
  Cancelled = "cancelled",
}

export enum TASKORDERSTATUS {
  Created = "created",
  Pending = "pending",
  InProgress = "in_progress",
  OnHold = "on_hold",
  Completed = "completed",
  Cancelled = "cancelled",
}