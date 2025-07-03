export interface AlertComponentProps {
  title: string;
  description: string;
  isVisible?: boolean;
  handleClose?: () => void;
  variant?: "solid" | "bordered" | "flat" | "faded";
  color?:
    | "default"
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "danger";
}

export interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

export interface DrawerComponentProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl";
  placement?: "left" | "right" | "top" | "bottom";
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

import type { FieldSection } from "@/interfaces/interfaces";
export interface FieldValueDisplayerProps {
  className?: string;
  sections: FieldSection[];
}

import type { FormField } from "@/interfaces/interfaces";
export interface FilterModalProps {
  isOpen: boolean;
  title: string;
  subtitle?: string;
  fields: FormField[];
  submitLabel?: string;
  cancelLabel?: string;
  onClose?: () => void;
  onSubmit: (e: React.FormEvent) => void;
  initialValues?: Record<string, any>;
}

import type { PressEvent } from "@react-types/shared";
import type { ColorType } from "../types";
export interface FormButtonsProps {
  onSubmit?: (e: PressEvent) => void;
  onCancel?: (e: PressEvent) => void;
  hasBorder?: boolean;
  submitLabel?: string;
  cancelLabel?: string;
  submitColor?: ColorType;
  cancelColor?: ColorType;
  isSubmitting?: boolean;
  isCanceling?: boolean;
  className?: string;
}

export interface FormFieldsProps {
  fields: FormField[];
  values?: Record<string, any>;
  onValueChange?: (name: string, value: any) => void;
}

import { InputConfig } from "@/interfaces/interfaces";
export interface InputRendererProps {
  inputConfig: InputConfig;
  onValueChange?: (name: string, value: any) => void;
  value?: any;
}

export interface FormComponentProps {
  hasHeader?: boolean;
  title?: string;
  subtitle?: string;
  fields: FormField[];
  submitLabel?: string;
  cancelLabel?: string;
  isSubmitting?: boolean;
  isCanceling?: boolean;
  initialValues?: Record<string, any>;
  className?: string;
  subtitleClassName?: ClassValue;
  children?: React.ReactNode;
  onCancel?: () => void;
  onSubmit?: (values: any) => void;
  onChange?: (values: any) => void;
}

import type { ClassValue } from "clsx";
export interface HeaderProps {
  title: string;
  subtitle?: string;
  hasBorder?: boolean;
  className?: ClassValue;
  titleClassName?: ClassValue;
  subtitleClassName?: ClassValue;
  children?: React.ReactNode;
}

import type { RequestOrder, TaskOrder } from "@/interfaces/schema";
export interface AccordionComponentProps {
  requestOrder: RequestOrder;
  taskOrders?: TaskOrder[];
}

import type { UploadedFile } from "@/interfaces/interfaces";
export interface UploadComponentProps {
  maxFiles?: number;
  isUploading?: boolean;
  uploadedFiles: UploadedFile[];
  setUploadedFiles: React.Dispatch<React.SetStateAction<UploadedFile[]>>;
  onDownloadTemplate?: () => void;
  onSubmit?: () => void;
  onCancel?: () => void;
}

import type {
  StatusConfig,
  FieldConfig,
  ActionConfig,
} from "@/interfaces/interfaces";
export interface CardComponentProps<T> {
  items: T[];
  statusConfig?: StatusConfig;
  headerFields?: FieldConfig[];
  bodyFields: FieldConfig[];
  actions?: ActionConfig[];
  isActionsPage?: boolean;
  cardClassName?: string;
}

import type { SwitchProps } from "@heroui/switch";
export interface ThemeSwitchProps {
  className?: string;
  classNames?: SwitchProps["classNames"];
}
