export enum USERROLE {
	Admin = "ADMIN",
	DepartmentHead = "DEPARTMENT_HEAD",
	UnitHead = "UNIT_HEAD",
	Driver = "DRIVER",
	Farmpro = "FARMPRO",
	CaneMIS = "CANEMIS",
	SongSirm = "SONG_SIRM",
}

export enum USERSTATUS {
	Working = "WORKING",
	Inactive = "INACTIVE",
	OnLeave = "ON_LEAVE",
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
}

export enum TASKORDERSTATUS {
	Created = "CREATED",
	Pending = "PENDING",
	InProgress = "IN_PROGRESS",
	OnHold = "ON_HOLD",
	Completed = "COMPLETED",
}
