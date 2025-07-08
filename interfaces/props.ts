import type {
	FieldSection,
	InputConfig,
	UploadedFile,
	StatusConfig,
	FieldConfig,
	ActionConfig,
	FormSection,
} from "@/interfaces/interfaces";

import type { PressEvent } from "@react-types/shared";
import type { ColorType } from "../types";
import type { ClassValue } from "clsx";
import type { RequestOrder, TaskOrder } from "@/interfaces/schema";
import type { SwitchProps } from "@heroui/switch";
import { extend } from "dayjs";

export interface AlertComponentProps {
	title: string;
	description: string;
	isVisible?: boolean;
	handleClose?: () => void;
	variant?: "solid" | "bordered" | "flat" | "faded";
	size?: "compact" | "expanded" | "full";
	placement?: "top" | "bottom";
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

export interface FieldValueDisplayerProps {
	className?: string;
	sections: FieldSection[];
}

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
	sections: FormSection[];
	onValueChange?: (name: string, value: any) => void;
	values?: any;
	isCompact?: boolean;
}

export interface InputRendererProps {
	value?: any;
	type:
		| "text"
		| "email"
		| "textarea"
		| "password"
		| "dropdown"
		| "date"
		| "date-range"
		| "number";
	commonProps: any;
	onValueChange?: (name: string, value: any) => void;
}

export interface FormComponentProps
	extends HeaderProps,
		FormFieldsProps,
		FormButtonsProps {
	hasHeader?: boolean;
	className?: string;
	children?: React.ReactNode;
	onCancel?: () => void;
	onSubmit?: (values: any) => void;
	onChange?: (values: any) => void;
}

export interface FilterModalProps extends FormComponentProps {
	isOpen: boolean;
	onClose: () => void;
}

export interface HeaderProps {
	// Text Props
	title?: string;
	subtitle?: string;

	// Boolean Props
	hasBorder?: boolean;

	// Style Props
	orientation?: "horizontal" | "vertical";

	// Class Props
	className?: ClassValue;
	titleClassName?: ClassValue;
	subtitleClassName?: ClassValue;
	headerContainerClassName?: ClassValue;
	childrenContainerClassName?: ClassValue;
	borderClassName?: string;

	// Children Props
	children?: React.ReactNode;
}

export interface AccordionComponentProps {
	requestOrder: RequestOrder;
	taskOrders?: TaskOrder[];
}

export interface UploadComponentProps {
	maxFiles?: number;
	isUploading?: boolean;
	uploadedFiles: UploadedFile[];
	setUploadedFiles: React.Dispatch<React.SetStateAction<UploadedFile[]>>;
	onDownloadTemplate?: () => void;
	onSubmit?: () => void;
	onCancel?: () => void;
}

export interface CardComponentProps<T> {
	items: T[];
	statusConfig?: StatusConfig;
	headerFields?: FieldConfig[];
	bodyFields: FieldConfig[];
	actions?: ActionConfig[];
	isActionsPage?: boolean;
	cardClassName?: string;
}

export interface ThemeSwitchProps {
	className?: string;
	classNames?: SwitchProps["classNames"];
}
