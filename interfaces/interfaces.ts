import {
  REQUESTORDERSTATUS,
  TASKORDERSTATUS,
  USERROLE,
  USERSTATUS,
} from "@/utils/enum";

interface User {
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

interface RequestOrder {
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

interface TaskOrder {
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

interface BaseInputConfig {
  name: string;
  label: string;
  labelPlacement?: "inside" | "outside" | "outside-left";
  placeholder?: string;
  description?: React.ReactNode;
  startContent?: React.ReactNode;
  endContent?: React.ReactNode;
  isRequired?: boolean;
  isInvalid?: boolean;
  errorMessage?: React.ReactNode;
  className?: string;
}

interface TextInputConfig extends BaseInputConfig {
  type: "text" | "email" | "password";
}

interface NumberInputConfig extends BaseInputConfig {
  type: "number";
  min?: number;
  max?: number;
}

interface DropdownOption {
  value: string;
  label: string;
}

interface DropdownInputConfig extends BaseInputConfig {
  type: "dropdown";
  options: DropdownOption[];
  selectionMode?: "single" | "multiple";
}

type InputConfig = TextInputConfig | NumberInputConfig | DropdownInputConfig;
type FormField = InputConfig | InputConfig[];

export type {
  User,
  RequestOrder,
  TaskOrder,
  BaseInputConfig,
  TextInputConfig,
  NumberInputConfig,
  DropdownOption,
  DropdownInputConfig,
  InputConfig,
  FormField,
};
