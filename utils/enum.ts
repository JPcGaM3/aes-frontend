export enum UserRole {
  Admin = "admin",
  DepartmentHead = "department_head",
  UnitHead = "unit_head",
  Driver = "driver",
  Farmpro = "farmpro",
  CaneMIS = "canemis",
  SongSirm = "song_sirm",
}

export enum UserStatus {
  Working = "working",
  Inactive = "inactive",
  OnLeave = "on_leave",
}

export enum RequestOrderStatus {
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

export enum TaskOrderStatus {
  Created = "created",
  Pending = "pending",
  InProgress = "in_progress",
  OnHold = "on_hold",
  Completed = "completed",
}

export enum RequestOrderInputField {
    CustomerType = "customer_type",
    Affiliation = "affiliation",
    Unit = "unit",
    Quota = "quota",
    Name = "name",
    LandNumber = "land_number",
    LocationName = "location_name",
    Lattitude = "lattitude",
    Longitude = "longitude",
    Supervisor = "supervisor",
}

export enum TaskOrderInputField {
    Activity = "activity",
    Tool = "tool",
    StartTime = "start_time",
}
