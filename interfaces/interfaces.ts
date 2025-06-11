import {
  REQUESTORDERSTATUS,
  TASKORDERSTATUS,
  USERROLE,
  USERSTATUS,
} from "@/utils/enum";

export interface User {
  id: number;
  quota_number?: string;
  fullname: string;
  email: string;
  phone: string;
  unit: number;
  zone: string;
  ae: string;
  role: USERROLE;
  leader_id?: number;
  status?: USERSTATUS | string;
  active: boolean;
  created_at: Date;
  updated_at: Date;
  created_by: number;
  updated_by: number;
}

export interface RequestOrder {
  id: number;
  customer_type: string;
  affiliation: string;
  quota_number?: string;
  farm_name?: string;
  land_number?: number;
  activity_describe: string;
  tool_describe: string;
  ap_month_year: string;
  supervisor_fullname?: string;
  unit: number;
  zone: number;
  ae: string;
  target_area?: number;
  actual_area?: number;
  on_live: boolean;
  evidence?: string;
  sale?: number;
  status?: REQUESTORDERSTATUS | string;
  supervisor_id?: number;
  location_id?: number;
  comment?: string;
  created_at: Date;
  updated_at: Date;
  created_by: number;
  updated_by: number;
}

export interface TaskOrder {
  id: number;
  area_number: string;
  area_target?: number;
  area_actual?: number;
  price?: number;
  comment?: string;
  ap_date: Date;
  oil_slip?: string;
  oil_start_mile?: number;
  start_mile?: number;
  end_mile?: number;
  oil_start?: number;
  oil_end?: number;
  car_start_hour: string;
  car_end_hour: string;
  start_timer: string;
  end_timer: string;
  status?: TASKORDERSTATUS | string;
  request_order_id: number;
  car_id: number;
  tool_id: number;
  assigned_user_id: number;
  created_at: Date;
  updated_at: Date;
  created_by: number;
  updated_by: number;
}
