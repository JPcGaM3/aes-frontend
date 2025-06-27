import { ColorType, IconSvgProps } from "@/types";
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
  work_order_number?: string;
  phone?: string;
  customer_type_id?: number;
  customer_type_name?: string;
  operation_area_id?: number;
  quota_number?: string;
  company_farm_id?: number;
  zone?: string;
  farmer_name?: string;
  land_number?: number;
  ap_month?: string;
  ap_year?: number | string;
  ae_id?: number;
  ae_name?: string;
  target_area?: number;
  actual_area?: number;
  active?: boolean;
  evidence?: number[];
  sale?: number;
  status?: REQUESTORDERSTATUS | string;
  supervisor_name?: string;
  supervisor_id?: number;
  location_xy?: string;
  location_id?: number;
  activities?: string;
  tool_types?: string;
  unit_head_id?: number;
  comment?: string;
  created_at?: Date | string;
  updated_at?: Date | string;
  created_by: number;
  updated_by: number;
}

interface TaskOrder {
  id: number;
  request_order_id?: number;
  activity_id?: number;
  activity_name?: string;
  tool_type_id?: number;
  tool_type_name?: string;
  car_id?: number;
  tool_id?: number;
  assigned_user_id?: number;
  target_area?: number;
  actual_area?: number;
  price?: number;
  ap_date?: Date | string;
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
  status?: TASKORDERSTATUS | string;
  comment?: string;
  active?: boolean;
  created_at?: Date | string;
  updated_at?: Date | string;
  created_by: number;
  updated_by: number;
}

interface Activity {
  id: number;
  name: string;
  tool_types?: string[];
}

interface BaseInputConfig {
  name: string;
  label?: string;
  translator?: Record<string, string>;
  labelPlacement?: "inside" | "outside" | "outside-left";
  hasPlaceholder?: boolean;
  placeholder?: string | number | boolean;
  description?: React.ReactNode;
  startContent?: React.ReactNode;
  endContent?: React.ReactNode;
  isRequired?: boolean;
  isInvalid?: boolean;
  errorMessage?: React.ReactNode;
  className?: string;
}

interface TextInputConfig extends BaseInputConfig {
  type: "text" | "email" | "password" | "textarea";
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

interface DateInputConfig extends BaseInputConfig {
  type: "date";
}

interface DateRangeInputConfig extends BaseInputConfig {
  type: "date-range";
}

type InputConfig =
  | TextInputConfig
  | NumberInputConfig
  | DropdownInputConfig
  | DateInputConfig
  | DateRangeInputConfig;
type FormField = InputConfig | InputConfig[];

interface StatusConfig {
  colorMap: Record<string, ColorType>;
  translation?: Record<string, string>;
}

interface FieldConfig {
  key: string;
  label?: string;
  formatter?: (value: any) => string;
  className?: string;
  labelTranslator?: Record<string, string>;
  valueTranslator?: Record<string, string>;
}

interface ActionConfig {
  key: string;
  label?: string;
  icon?: React.ReactNode;
  className?: string;
  onClick?: (item: any) => void;
}

interface CardComponentProps<T> {
  items: T[];
  statusConfig?: StatusConfig;
  headerFields?: FieldConfig[];
  bodyFields: FieldConfig[];
  actions?: ActionConfig[];
  isActionsPage?: boolean;
  cardClassName?: string;
}

interface FilterConfig {
  status?: string;
  ae?: string;
}

interface UploadedFile {
  name: string;
  size: number;
  type: string;
  file: File;
}

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
  StatusConfig,
  FieldConfig,
  ActionConfig,
  CardComponentProps,
  FilterConfig,
  UploadedFile,
  Activity,
};
