import { ClassValue } from "clsx";
import { ColorType } from "@/types";

export interface BaseInputConfig {
  name: string;
  label?: string;
  hasLabel?: boolean;
  labelPlacement?: "inside" | "outside" | "outside-left";
  translator?: Record<string, string>;
  placeholder?: string | number | boolean;
  hasPlaceholder?: boolean;
  size?: "sm" | "md" | "lg";
  description?: React.ReactNode;
  startContent?: React.ReactNode;
  endContent?: React.ReactNode;
  isRequired?: boolean;
  isInvalid?: boolean;
  errorMessage?: React.ReactNode;
  className?: string;
}

export interface TextInputConfig extends BaseInputConfig {
  type: "text" | "email" | "password" | "textarea";
}

export interface NumberInputConfig extends BaseInputConfig {
  type: "number";
  min?: number;
  max?: number;
}

export interface DropdownOption {
  value: string | number;
  label: string;
}

export interface DropdownInputConfig extends BaseInputConfig {
  type: "dropdown";
  options: DropdownOption[];
  selectionMode?: "single" | "multiple";
}

export interface DateInputConfig extends BaseInputConfig {
  type: "date";
}

export interface DateRangeInputConfig extends BaseInputConfig {
  type: "date-range";
}

type InputConfig =
  | TextInputConfig
  | NumberInputConfig
  | DropdownInputConfig
  | DateInputConfig
  | DateRangeInputConfig;
export type { InputConfig };

export type FormField = InputConfig | InputConfig[];

export interface StatusConfig {
  colorMap: Record<string, ColorType>;
  translation?: Record<string, string>;
}

export interface FieldConfig {
  key: string;
  label?: string;
  formatter?: (value: any) => string;
  className?: string;
  labelTranslator?: Record<string, string>;
  valueTranslator?: Record<string, string>;
  valueFunction?: (item: any) => string;
  valueClassName?: ClassValue;
}

export interface ActionConfig {
  key: string;
  label?: string;
  icon?: React.ReactNode;
  className?: string;
  onClick?: (item: any) => void;
}

export interface FilterConfig {
  status?: string;
  ae?: string;
}

export interface UploadedFile {
  name: string;
  size: number;
  type: string;
  file: File;
}

export interface TableHeader {
  label: string;
  keyword: string;
}

export interface FieldValue {
  label: string;
  value: React.ReactNode;
  highlight?: boolean;
  className?: string;
}

export interface FieldSection {
  title?: string;
  fields: FieldValue[];
}