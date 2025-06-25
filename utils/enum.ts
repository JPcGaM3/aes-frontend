export enum USERROLE {
  Admin = "admin",
  DepartmentHead = "department_head",
  UnitHead = "unit_head",
  Driver = "driver",
  Farmpro = "farmpro",
  CaneMIS = "canemis",
  SongSirm = "song_sirm",
}

export enum USERSTATUS {
  Working = "working",
  Inactive = "inactive",
  OnLeave = "on_leave",
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
}

export enum TASKORDERSTATUS {
  Created = "created",
  Pending = "pending",
  InProgress = "in_progress",
  OnHold = "on_hold",
  Completed = "completed",
}