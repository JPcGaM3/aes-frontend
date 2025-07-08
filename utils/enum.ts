export enum USERROLE {
	Admin = "ADMIN",
	DepartmentHead = "DEPARTMENT_HEAD",
	UnitHead = "UNIT_HEAD",
	Driver = "DRIVER",
	Farmpro = "FARMPRO",
	CaneMIS = "CANEMIS",
	SongSirm = "SONG_SIRM",
	Manager = "MANAGER",
	SubManager = "SUB_MANAGER",
	Commander = "COMMANDER",
	SubCommander = "SUB_COMMANDER",
	Accountant = "ACCOUNTANT",
	Maintenance = "MAINTENANCE",
}

export enum USERSTATUS {
	Working = "WORKING",
	Inactive = "INACTIVE",
	OnLeave = "ON_LEAVE",
	Cancelled = "CANCELLED",
	Rejected = "REJECTED",
}

export enum REQUESTORDERSTATUS {
	Created = "CREATED",
	PendingApproval = "PENDING_APPROVAL",
	PendingEdit = "PENDING_EDIT",
	Pending = "PENDING",
	InProgress = "IN_PROGRESS",
	PendingReview = "PENDING_REVIEW",
	PendingConfirm = "PENDING_CONFIRM",
	Completed = "COMPLETED",
	Rejected = "REJECTED",
	Cancelled = "CANCELLED",
}

export enum TASKORDERSTATUS {
	Created = "CREATED",
	Pending = "PENDING",
	InProgress = "IN_PROGRESS",
	OnHold = "ON_HOLD",
	Completed = "COMPLETED",
	Cancelled = "CANCELLED",
}
