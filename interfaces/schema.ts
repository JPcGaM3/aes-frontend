import { USERROLE, USERSTATUS, REQUESTORDERSTATUS, TASKORDERSTATUS } from "@/utils/enum";

export interface UserProfileResponse {
  success: boolean;
  message: string;
  data: {
    profile: UserProfile;
    user_result: User;
  };
}

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  employeeName: {
    th?: string;
    en?: string;
  };
  splitNameTH?: {
    foa?: string;
    FNameTH?: string;
    LNameTH?: string;
  };
  department?: {
    id?: string;
    name?: {
      th?: string;
      en?: string;
    };
  };
  position?: {
    id?: string;
    name?: {
      th?: string;
      en?: string;
    };
  };
  attorney?: {
    id?: string;
    name?: string;
  };
  level?: {
    id?: string;
    name?: string;
  };
  company?: {
    id?: string;
    name?: string;
  };
  plant?: {
    id?: string;
    name?: string;
  };
  approver?: {
    id?: string;
    username?: string;
  };
}

export interface User {
  id: number;
  phone?: string;
  unit?: number;
  ae_id?: number;
  role: USERROLE[];
  status: USERSTATUS;
  active?: boolean;
  created_at?: string | Date;
  updated_at?: string | Date;
  created_by: number;
  updated_by: number;
  username?: string;
  email?: string;
  fullname?: string;
  employee_id?: string;
  ae_area?: AeArea;
  requestorders?: RequestOrder[];
  taskorders?: TaskOrder[];
  user_operation_area?: UserOperationArea[];
  user_role?: UserRole[];
}

export interface Car {
  id: number;
  car_number?: string;
  asset?: string;
  asset_class?: number;
  asset_description?: string;
  name?: string;
  year?: number;
  capitalized_on?: string | Date;
  service_life?: number;
  cost_center?: string;
  note?: string;
  hp?: number;
  acquis_val?: number;
  accum_dep?: number;
  curr_bk_val?: number;
  active?: boolean;
  ae_id?: number;
  created_at?: string | Date;
  updated_at?: string | Date;
  created_by: number;
  updated_by: number;
  ae_area?: AeArea;
  taskorders?: TaskOrder[];
}

export interface Activity {
  id: number;
  name: string;
  created_at?: string | Date;
  updated_at?: string | Date;
  created_by: number;
  updated_by: number;
  activity_number: number;
  tool_types?: ToolType[];
  taskorders?: TaskOrder[];
}

export interface ToolType {
  id: number;
  activity_id: number;
  price_ct_fm?: number;
  price_ct_rdc?: number;
  price_ne1_fm?: number;
  price_ne1_res?: number;
  price_suffix?: string;
  tool_type_name: string;
  tool_type_number?: number;
  created_at?: string | Date;
  updated_at?: string | Date;
  created_by: number;
  updated_by: number;
  activities?: Activity;
  tools?: Tool[];
  taskorders?: TaskOrder[];
}

export interface Tool {
  id: number;
  name?: string;
  asset?: string;
  year?: number;
  capitalized_on?: string | Date;
  status: USERSTATUS;
  created_at?: string | Date;
  updated_at?: string | Date;
  created_by: number;
  updated_by: number;
  ae_id?: number;
  tool_type_id?: number;
  taskorders?: TaskOrder[];
  ae_area?: AeArea;
  tool_type?: ToolType;
}

export interface AeArea {
  id: number;
  name?: string;
  created_at?: string | Date;
  updated_at?: string | Date;
  created_by: number;
  updated_by: number;
  operation_area?: OperationArea[];
  tools?: Tool[];
  users?: User[];
  cars?: Car[];
  requestorders?: RequestOrder[];
}

export interface OperationArea {
  id: number;
  operation_area?: string;
  area_number?: number;
  created_at?: string | Date;
  updated_at?: string | Date;
  created_by: number;
  updated_by: number;
  ae_id?: number;
  customer_type_id: number;
  company_farm?: CompanyFarm[];
  ae_area?: AeArea;
  customer_type?: CustomerType;
  user_operation_area?: UserOperationArea[];
  requestorders?: RequestOrder[];
  customer_requestorders?: RequestOrder[];
}

export interface CompanyFarm {
  id: number;
  area_number: number;
  zone?: string;
  farm_name?: string;
  created_at?: string | Date;
  updated_at?: string | Date;
  created_by: number;
  updated_by: number;
  operation_area?: OperationArea;
  requestorders?: RequestOrder[];
}

export interface CustomerType {
  id: number;
  name?: string;
  created_at?: string | Date;
  updated_at?: string | Date;
  created_by: number;
  updated_by: number;
  operation_area?: OperationArea[];
  requestorders?: RequestOrder[];
}

export interface RequestOrder {
  id: number;
  work_order_number: string;
  run_number?: string;
  phone?: string;
  customer_type_id?: number;
  customer_operation_area_id?: number;
  operation_area_id?: number;
  quota_number?: string;
  company_farm_id?: number;
  zone?: string;
  farmer_name?: string;
  land_number?: number;
  ap_month?: string;
  ap_year?: number;
  ae_id?: number;
  target_area?: number;
  actual_area?: number;
  active?: boolean;
  evidence?: number[];
  sale?: number;
  status?: REQUESTORDERSTATUS;
  supervisor_name?: string;
  supervisor_id?: number;
  location_xy?: string;
  location_id?: number;
  unit_head_id?: number;
  comment?: string;
  created_at?: string | Date;
  updated_at?: string | Date;
  created_by: number;
  updated_by: number;
  customer_type?: CustomerType;
  operation_area?: OperationArea;
  customer_operation_area?: OperationArea;
  company_farm?: CompanyFarm;
  ae_area?: AeArea;
  locations?: Location;
  users?: User;
  taskorders?: TaskOrder[];
  bills?: Bill[];
}

export interface TaskOrder {
  id: number;
  request_order_id?: number;
  activities_id?: number;
  tool_types_id?: number;
  car_id?: number;
  tool_id?: number;
  assigned_user_id?: number;
  target_area?: number;
  actual_area?: number;
  price?: number;
  ap_date?: string | Date;
  oil_slip?: string;
  oil_start_mile?: number;
  start_mile?: number;
  end_mile?: number;
  oil_start?: number;
  oil_end?: number;
  car_start_hour?: string;
  car_end_hour?: string;
  start_timer?: string;
  end_timer?: string;
  status?: TASKORDERSTATUS;
  comment?: string;
  active?: boolean;
  created_at?: string | Date;
  updated_at?: string | Date;
  created_by: number;
  updated_by: number;
  users?: User;
  cars?: Car;
  requestorders?: RequestOrder;
  activities?: Activity;
  tools?: Tool;
  tool_type?: ToolType;
}

export interface Bill {
  id: number;
  target_price?: number;
  actual_price?: number;
  status?: REQUESTORDERSTATUS;
  request_order_id?: number;
  created_at?: string | Date;
  updated_at?: string | Date;
  created_by: number;
  updated_by: number;
  requestorders?: RequestOrder;
}

export interface UserOperationArea {
  id: number;
  user_id?: number;
  operation_area_id?: number;
  active?: boolean;
  created_at?: string | Date;
  updated_at?: string | Date;
  created_by: number;
  updated_by: number;
  users?: User;
  operation_area?: OperationArea;
}

export interface UserRole {
  id: number;
  user_id?: number;
  role_id?: number;
  created_at?: string | Date;
  updated_at?: string | Date;
  created_by: number;
  updated_by: number;
  user?: User;
  role?: Role;
}

export interface Role {
  id: number;
  name?: string;
  description?: string;
  active?: boolean;
  created_at?: string | Date;
  updated_at?: string | Date;
  created_by: number;
  updated_by: number;
  permissions?: RolePermission[];
  userRoles?: UserRole[];
}

export interface RolePermission {
  id: number;
  role_id?: number;
  permission_id?: number;
  created_at?: string | Date;
  updated_at?: string | Date;
  created_by: number;
  updated_by: number;
  role?: Role;
  permission?: Permission;
}

export interface Permission {
  id: number;
  resource?: string;
  action?: string;
  description?: string;
  active?: boolean;
  created_at?: string | Date;
  updated_at?: string | Date;
  created_by: number;
  updated_by: number;
  rolePermissions?: RolePermission[];
}

export interface Location {
  id: number;
  location_name?: string;
  land_number?: number;
  location_xy: string;
  is_new_location?: boolean;
  created_at?: string | Date;
  updated_at?: string | Date;
  created_by: number;
  updated_by: number;
  requestorders?: RequestOrder[];
}

export interface Attachment {
  id: number;
  file_name?: string;
  file_path?: string;
  file_type?: string;
  file_data?: any;
  created_at?: string | Date;
  updated_at?: string | Date;
  created_by: number;
  updated_by: number;
}
