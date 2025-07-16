import { ClassValue } from "clsx";

import { ColorType } from "@/types";

export interface BaseInputConfig {
	/** Field name (used as key in values object) */
	name: string;
	/** Dot-separated path for nested value, e.g. "user.address.city" */
	path?: string;
	/** Optional default value for the field */
	defaultValue?: any;
	/** Pass extra props to the input component */
	props?: Record<string, any>;

	/** Label configuration */
	hasLabel?: boolean;
	/** Custom label for the field (overrides name/translation) */
	label?: string;
	hasPlaceholder?: boolean;
	labelTranslator?: Record<string, string>;
	labelPlacement?: "inside" | "outside" | "outside-left";

	/** Common input properties */
	isReadOnly?: boolean;
	isRequired?: boolean;
	size?: "sm" | "md" | "lg";
	className?: ClassValue;
}

export interface TextInputConfig extends BaseInputConfig {
	type: "text" | "email" | "password";
}

export interface TextAreaInputConfig extends BaseInputConfig {
	type: "textarea";
	minRows?: number;
	maxRows?: number;
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
	| TextAreaInputConfig
	| NumberInputConfig
	| DropdownInputConfig
	| DateInputConfig
	| DateRangeInputConfig;
export type { InputConfig };

export type FormField = InputConfig | InputConfig[];

export type FormSection = {
	title?: string;
	fields: FormField[];
};

export interface StatusConfig {
	colorMap: Record<string, ColorType>;
	translation?: Record<string, string>;
}

export interface FieldConfig {
	key: string;
	path?: string;
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
	name: string;
	labelTranslator?: Record<string, string>;
	value: React.ReactNode;
	translator?: Record<string, string>;
	highlight?: boolean;
	className?: string;
}

export interface FieldSection {
	title?: string;
	fields: FieldValue[];
}
