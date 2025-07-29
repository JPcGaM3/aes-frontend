import {
	Moon,
	SunDim,
	Search,
	User,
	Plus,
	EllipsisVertical,
	ChevronDown,
	ChevronUp,
	Eye,
	EyeClosed,
	ChevronsRight,
	ChevronsLeft,
	ChevronRight,
	ChevronLeft,
	ChevronsDown,
	ChevronsUp,
	Minus,
	X,
	Divide,
	Funnel,
	Menu,
	Info,
	SquarePen,
	Ban,
	Download,
	Upload,
	Trash2,
	Check,
	Timer,
	PlayCircle,
	Clock,
} from "lucide-react";

import { IconSvgProps } from "@/types";

export const DiscordIcon = (props: IconSvgProps) => {
	const {
		size = 24,
		strokeWidth = 1,
		variant = "fill",
		color = "currentColor",
		...rest
	} = props;

	return (
		<svg
			fill={variant === "fill" ? color : "none"}
			height={size}
			stroke={variant === "border" ? color : "none"}
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={strokeWidth}
			viewBox="0 0 24 24"
			width={size}
			{...rest}
		>
			<path d="M14.82 4.26a10.14 10.14 0 0 0-.53 1.1 14.66 14.66 0 0 0-4.58 0 10.14 10.14 0 0 0-.53-1.1 16 16 0 0 0-4.13 1.3 17.33 17.33 0 0 0-3 11.59 16.6 16.6 0 0 0 5.07 2.59A12.89 12.89 0 0 0 8.23 18a9.65 9.65 0 0 1-1.71-.83 3.39 3.39 0 0 0 .42-.33 11.66 11.66 0 0 0 10.12 0q.21.18.42.33a10.84 10.84 0 0 1-1.71.84 12.41 12.41 0 0 0 1.08 1.78 16.44 16.44 0 0 0 5.06-2.59 17.22 17.22 0 0 0-3-11.59 16.09 16.09 0 0 0-4.09-1.35zM8.68 14.81a1.94 1.94 0 0 1-1.8-2 1.93 1.93 0 0 1 1.8-2 1.93 1.93 0 0 1 1.8 2 1.93 1.93 0 0 1-1.8 2zm6.64 0a1.94 1.94 0 0 1-1.8-2 1.93 1.93 0 0 1 1.8-2 1.92 1.92 0 0 1 1.8 2 1.92 1.92 0 0 1-1.8 2z" />
		</svg>
	);
};

export const TwitterIcon = (props: IconSvgProps) => {
	const {
		size = 24,
		strokeWidth = 1,
		variant = "fill",
		color = "currentColor",
		...rest
	} = props;

	return (
		<svg
			fill={variant === "fill" ? color : "none"}
			height={size}
			stroke={variant === "border" ? color : "none"}
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={strokeWidth}
			viewBox="0 0 24 24"
			width={size}
			{...rest}
		>
			<path d="M19.633 7.997c.013.175.013.349.013.523 0 5.325-4.053 11.461-11.46 11.461-2.282 0-4.402-.661-6.186-1.809.324.037.636.05.973.05a8.07 8.07 0 0 0 5.001-1.721 4.036 4.036 0 0 1-3.767-2.793c.249.037.499.062.761.062.361 0 .724-.05 1.061-.137a4.027 4.027 0 0 1-3.23-3.953v-.05c.537.299 1.16.486 1.82.511a4.022 4.022 0 0 1-1.796-3.354c0-.748.199-1.434.548-2.032a11.457 11.457 0 0 0 8.306 4.215c-.062-.3-.1-.611-.1-.923a4.026 4.026 0 0 1 4.028-4.028c1.16 0 2.207.486 2.943 1.272a7.957 7.957 0 0 0 2.556-.973 4.02 4.02 0 0 1-1.771 2.22 8.073 8.073 0 0 0 2.319-.624 8.645 8.645 0 0 1-2.019 2.083z" />
		</svg>
	);
};

export const GithubIcon = (props: IconSvgProps) => {
	const {
		size = 24,
		strokeWidth = 1,
		variant = "fill",
		color = "currentColor",
		...rest
	} = props;

	return (
		<svg
			fill={variant === "fill" ? color : "none"}
			height={size}
			stroke={variant === "border" ? color : "none"}
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={strokeWidth}
			viewBox="0 0 24 24"
			width={size}
			{...rest}
		>
			<path d="M12.026 2c-5.509 0-9.974 4.465-9.974 9.974 0 4.406 2.857 8.145 6.821 9.465.499.09.679-.217.679-.481 0-.237-.008-.865-.011-1.696-2.775.602-3.361-1.338-3.361-1.338-.452-1.152-1.107-1.459-1.107-1.459-.905-.619.069-.605.069-.605 1.002.07 1.527 1.028 1.527 1.028.89 1.524 2.336 1.084 2.902.829.091-.645.351-1.085.635-1.334-2.214-.251-4.542-1.107-4.542-4.93 0-1.087.389-1.979 1.024-2.675-.101-.253-.446-1.268.099-2.64 0 0 .837-.269 2.742 1.021a9.582 9.582 0 0 1 2.496-.336 9.554 9.554 0 0 1 2.496.336c1.906-1.291 2.742-1.021 2.742-1.021.545 1.372.203 2.387.099 2.64.64.696 1.024 1.587 1.024 2.675 0 3.833-2.33 4.675-4.552 4.922.355.308.675.916.675 1.846 0 1.334-.012 2.41-.012 2.737 0 .267.178.577.687.479C19.146 20.115 22 16.379 22 11.974 22 6.465 17.535 2 12.026 2z" />
		</svg>
	);
};

export const MoonIcon = (props: IconSvgProps) => {
	const {
		size = 24,
		strokeWidth = 1,
		variant = "fill",
		color = "currentColor",
		...rest
	} = props;

	return (
		<Moon
			fill={variant === "fill" ? color : "none"}
			height={size}
			stroke={variant === "border" ? color : "none"}
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={strokeWidth}
			viewBox="0 0 24 24"
			width={size}
			{...rest}
		/>
	);
};

export const SunIcon = (props: IconSvgProps) => {
	const {
		size = 24,
		strokeWidth = 1.5,
		variant = "fill",
		color = "currentColor",
		...rest
	} = props;

	return (
		<SunDim
			fill={variant === "fill" ? color : "none"}
			height={size}
			stroke={color}
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={strokeWidth}
			viewBox="0 0 24 24"
			width={size}
			{...rest}
		/>
	);
};

export const SearchIcon = (props: IconSvgProps) => {
	const {
		size = 24,
		strokeWidth = 1.5,
		color = "currentColor",
		...rest
	} = props;

	return (
		<Search
			height={size}
			stroke={color}
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={strokeWidth}
			viewBox="0 0 24 24"
			width={size}
			{...rest}
		/>
	);
};

export const UserIcon = (props: IconSvgProps) => {
	const {
		size = 24,
		strokeWidth = 1,
		variant = "fill",
		color = "currentColor",
		...rest
	} = props;

	return (
		<User
			fill={variant === "fill" ? color : "none"}
			height={size}
			stroke={variant === "border" ? color : "none"}
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={strokeWidth}
			viewBox="0 0 24 24"
			width={size}
			{...rest}
		/>
	);
};

export const VerticalDotsIcon = (props: IconSvgProps) => {
	const {
		size = 24,
		strokeWidth = 2,
		variant = "fill",
		color = "currentColor",
		...rest
	} = props;

	return (
		<EllipsisVertical
			fill={variant === "fill" ? color : "none"}
			height={size}
			stroke={color}
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={strokeWidth}
			viewBox="0 0 24 24"
			width={size}
			{...rest}
		/>
	);
};

export const EyeIcon = (props: IconSvgProps) => {
	const {
		size = 24,
		strokeWidth = 2,
		color = "currentColor",
		...rest
	} = props;

	return (
		<Eye
			height={size}
			stroke={color}
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={strokeWidth}
			viewBox="0 0 24 24"
			width={size}
			{...rest}
		/>
	);
};

export const EyeCloseIcon = (props: IconSvgProps) => {
	const {
		size = 24,
		strokeWidth = 2,
		color = "currentColor",
		...rest
	} = props;

	return (
		<EyeClosed
			height={size}
			stroke={color}
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={strokeWidth}
			viewBox="0 0 24 24"
			width={size}
			{...rest}
		/>
	);
};

export const ChevronUpIcon = (props: IconSvgProps) => {
	const {
		size = 24,
		strokeWidth = 1.5,
		color = "currentColor",
		...rest
	} = props;

	return (
		<ChevronUp
			height={size}
			stroke={color}
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={strokeWidth}
			viewBox="0 0 24 24"
			width={size}
			{...rest}
		/>
	);
};

export const ChevronsUpIcon = (props: IconSvgProps) => {
	const {
		size = 24,
		strokeWidth = 1.5,
		color = "currentColor",
		...rest
	} = props;

	return (
		<ChevronsUp
			height={size}
			stroke={color}
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={strokeWidth}
			viewBox="0 0 24 24"
			width={size}
			{...rest}
		/>
	);
};

export const ChevronDownIcon = (props: IconSvgProps) => {
	const {
		size = 24,
		strokeWidth = 1.5,
		color = "currentColor",
		...rest
	} = props;

	return (
		<ChevronDown
			height={size}
			stroke={color}
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={strokeWidth}
			viewBox="0 0 24 24"
			width={size}
			{...rest}
		/>
	);
};

export const ChevronsDownIcon = (props: IconSvgProps) => {
	const {
		size = 24,
		strokeWidth = 1.5,
		color = "currentColor",
		...rest
	} = props;

	return (
		<ChevronsDown
			height={size}
			stroke={color}
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={strokeWidth}
			viewBox="0 0 24 24"
			width={size}
			{...rest}
		/>
	);
};

export const ChevronLeftIcon = (props: IconSvgProps) => {
	const {
		size = 24,
		strokeWidth = 1.5,
		color = "currentColor",
		...rest
	} = props;

	return (
		<ChevronLeft
			height={size}
			stroke={color}
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={strokeWidth}
			viewBox="0 0 24 24"
			width={size}
			{...rest}
		/>
	);
};

export const ChevronsLeftIcon = (props: IconSvgProps) => {
	const {
		size = 24,
		strokeWidth = 1.5,
		color = "currentColor",
		...rest
	} = props;

	return (
		<ChevronsLeft
			height={size}
			stroke={color}
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={strokeWidth}
			viewBox="0 0 24 24"
			width={size}
			{...rest}
		/>
	);
};

export const ChevronRightIcon = (props: IconSvgProps) => {
	const {
		size = 24,
		strokeWidth = 1.5,
		color = "currentColor",
		...rest
	} = props;

	return (
		<ChevronRight
			height={size}
			stroke={color}
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={strokeWidth}
			viewBox="0 0 24 24"
			width={size}
			{...rest}
		/>
	);
};

export const ChevronsRightIcon = (props: IconSvgProps) => {
	const {
		size = 24,
		strokeWidth = 1.5,
		color = "currentColor",
		...rest
	} = props;

	return (
		<ChevronsRight
			height={size}
			stroke={color}
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={strokeWidth}
			viewBox="0 0 24 24"
			width={size}
			{...rest}
		/>
	);
};

export const PlusIcon = (props: IconSvgProps) => {
	const {
		size = 24,
		strokeWidth = 1.5,
		color = "currentColor",
		...rest
	} = props;

	return (
		<Plus
			height={size}
			stroke={color}
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={strokeWidth}
			viewBox="0 0 24 24"
			width={size}
			{...rest}
		/>
	);
};

export const MinusIcon = (props: IconSvgProps) => {
	const {
		size = 24,
		strokeWidth = 1.5,
		color = "currentColor",
		...rest
	} = props;

	return (
		<Minus
			height={size}
			stroke={color}
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={strokeWidth}
			viewBox="0 0 24 24"
			width={size}
			{...rest}
		/>
	);
};

export const MultiplyIcon = (props: IconSvgProps) => {
	const {
		size = 24,
		strokeWidth = 1.5,
		color = "currentColor",
		...rest
	} = props;

	return (
		<X
			height={size}
			stroke={color}
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={strokeWidth}
			viewBox="0 0 24 24"
			width={size}
			{...rest}
		/>
	);
};

export const DivideIcon = (props: IconSvgProps) => {
	const {
		size = 24,
		strokeWidth = 1.5,
		color = "currentColor",
		...rest
	} = props;

	return (
		<Divide
			height={size}
			stroke={color}
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={strokeWidth}
			viewBox="0 0 24 24"
			width={size}
			{...rest}
		/>
	);
};

export const FilterIcon = (props: IconSvgProps) => {
	const {
		size = 24,
		strokeWidth = 1.5,
		variant = "fill",
		color = "currentColor",
		...rest
	} = props;

	return (
		<Funnel
			fill={variant === "fill" ? color : "none"}
			height={size}
			stroke={variant === "border" ? color : "none"}
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={strokeWidth}
			viewBox="0 0 24 24"
			width={size}
			{...rest}
		/>
	);
};

export const HamburgerIcon = (props: IconSvgProps) => {
	const {
		size = 24,
		strokeWidth = 1.5,
		color = "currentColor",
		...rest
	} = props;

	return (
		<Menu
			height={size}
			stroke={color}
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={strokeWidth}
			viewBox="0 0 24 24"
			width={size}
			{...rest}
		/>
	);
};

export const HomeIcon = (props: IconSvgProps) => {
	const {
		size = 24,
		strokeWidth = 1,
		variant = "fill",
		color = "currentColor",
		...rest
	} = props;

	return (
		<svg
			fill={variant === "fill" ? color : "none"}
			height={size}
			stroke={variant === "border" ? color : "none"}
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={strokeWidth}
			viewBox="0 0 24 24"
			width={size}
			{...rest}
		>
			<path d="M3 10.5L12 4l9 6.5V20a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1v-4h-4v4a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V10.5Z" />
		</svg>
	);
};

export const DocumentIcon = (props: IconSvgProps) => {
	const {
		size = 24,
		strokeWidth = 1.5,
		variant = "fill",
		color = "currentColor",
		...rest
	} = props;

	return (
		<svg
			fill={variant === "fill" ? color : "none"}
			height={size}
			stroke={variant === "border" ? color : "none"}
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={strokeWidth}
			viewBox="0 0 52 52"
			width={size}
			{...rest}
		>
			<rect
				fill="none"
				height="4.8"
				rx="1.6"
				width="27.2"
				x="12.4"
				y="26"
			/>
			<rect
				fill="none"
				height="4.8"
				rx="1.6"
				width="24"
				x="12.4"
				y="35.6"
			/>
			<g>
				<path d="m36.4 14.8h8.48a1.09 1.09 0 0 0 1.12-1.12 1 1 0 0 0 -.32-.8l-10.56-10.56a1 1 0 0 0 -.8-.32 1.09 1.09 0 0 0 -1.12 1.12v8.48a3.21 3.21 0 0 0 3.2 3.2z" />
				<path d="m44.4 19.6h-11.2a4.81 4.81 0 0 1 -4.8-4.8v-11.2a1.6 1.6 0 0 0 -1.6-1.6h-16a4.81 4.81 0 0 0 -4.8 4.8v38.4a4.81 4.81 0 0 0 4.8 4.8h30.4a4.81 4.81 0 0 0 4.8-4.8v-24a1.6 1.6 0 0 0 -1.6-1.6zm-32-1.6a1.62 1.62 0 0 1 1.6-1.55h6.55a1.56 1.56 0 0 1 1.57 1.55v1.59a1.63 1.63 0 0 1 -1.59 1.58h-6.53a1.55 1.55 0 0 1 -1.58-1.58zm24 20.77a1.6 1.6 0 0 1 -1.6 1.6h-20.8a1.6 1.6 0 0 1 -1.6-1.6v-1.57a1.6 1.6 0 0 1 1.6-1.6h20.8a1.6 1.6 0 0 1 1.6 1.6zm3.2-9.6a1.6 1.6 0 0 1 -1.6 1.63h-24a1.6 1.6 0 0 1 -1.6-1.6v-1.6a1.6 1.6 0 0 1 1.6-1.6h24a1.6 1.6 0 0 1 1.6 1.6z" />
			</g>
		</svg>
	);
};

export const CheckFillIcon = (props: IconSvgProps) => {
	const {
		size = 24,
		strokeWidth = 1.5,
		color = "currentColor",
		...rest
	} = props;

	return (
		<svg
			fill={color}
			height={size}
			stroke="none"
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={strokeWidth}
			viewBox="0 0 24 24"
			width={size}
			{...rest}
		>
			<path
				clipRule="evenodd"
				d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12ZM16.0303 8.96967C16.3232 9.26256 16.3232 9.73744 16.0303 10.0303L11.0303 15.0303C10.7374 15.3232 10.2626 15.3232 9.96967 15.0303L7.96967 13.0303C7.67678 12.7374 7.67678 12.2626 7.96967 11.9697C8.26256 11.6768 8.73744 11.6768 9.03033 11.9697L10.5 13.4393L12.7348 11.2045L14.9697 8.96967C15.2626 8.67678 15.7374 8.67678 16.0303 8.96967Z"
				fillRule="evenodd"
			/>
		</svg>
	);
};

export const SettingIcon = (props: IconSvgProps) => {
	const {
		size = 24,
		strokeWidth = 1.5,
		variant = "fill",
		color = "currentColor",
		...rest
	} = props;

	return (
		<svg
			fill={variant === "fill" ? color : "none"}
			height={size}
			stroke={variant === "border" ? color : "none"}
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={strokeWidth}
			viewBox="0 0 24 24"
			width={size}
			{...rest}
		>
			<path d="M20.1 9.2214C18.29 9.2214 17.55 7.9414 18.45 6.3714C18.97 5.4614 18.66 4.3014 17.75 3.7814L16.02 2.7914C15.23 2.3214 14.21 2.6014 13.74 3.3914L13.63 3.5814C12.73 5.1514 11.25 5.1514 10.34 3.5814L10.23 3.3914C9.78 2.6014 8.76 2.3214 7.97 2.7914L6.24 3.7814C5.33 4.3014 5.02 5.4714 5.54 6.3814C6.45 7.9414 5.71 9.2214 3.9 9.2214C2.86 9.2214 2 10.0714 2 11.1214V12.8814C2 13.9214 2.85 14.7814 3.9 14.7814C5.71 14.7814 6.45 16.0614 5.54 17.6314C5.02 18.5414 5.33 19.7014 6.24 20.2214L7.97 21.2114C8.76 21.6814 9.78 21.4014 10.25 20.6114L10.36 20.4214C11.26 18.8514 12.74 18.8514 13.65 20.4214L13.76 20.6114C14.23 21.4014 15.25 21.6814 16.04 21.2114L17.77 20.2214C18.68 19.7014 18.99 18.5314 18.47 17.6314C17.56 16.0614 18.3 14.7814 20.11 14.7814C21.15 14.7814 22.01 13.9314 22.01 12.8814V11.1214C22 10.0814 21.15 9.2214 20.1 9.2214ZM12 15.2514C10.21 15.2514 8.75 13.7914 8.75 12.0014C8.75 10.2114 10.21 8.7514 12 8.7514C13.79 8.7514 15.25 10.2114 15.25 12.0014C15.25 13.7914 13.79 15.2514 12 15.2514Z" />
		</svg>
	);
};

export const InfoIcon = (props: IconSvgProps) => {
	const {
		size = 24,
		strokeWidth = 1.5,
		color = "currentColor",
		...rest
	} = props;

	return (
		<Info
			height={size}
			stroke={color}
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={strokeWidth}
			viewBox="0 0 24 24"
			width={size}
			{...rest}
		/>
	);
};

export const StartIcon = (props: IconSvgProps) => {
	const {
		size = 24,
		strokeWidth = 1.5,
		color = "currentColor",
		...rest
	} = props;

	return (
		<PlayCircle
			height={size}
			stroke={color}
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={strokeWidth}
			viewBox="0 0 24 24"
			width={size}
			{...rest}
		/>
	);
};
export const EditIcon = (props: IconSvgProps) => {
	const {
		size = 24,
		strokeWidth = 1.5,
		color = "currentColor",
		...rest
	} = props;

	return (
		<SquarePen
			height={size}
			stroke={color}
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={strokeWidth}
			viewBox="0 0 24 24"
			width={size}
			{...rest}
		/>
	);
};

export const RejectIcon = (props: IconSvgProps) => {
	const {
		size = 24,
		strokeWidth = 1.5,
		color = "currentColor",
		...rest
	} = props;

	return (
		<Ban
			height={size}
			stroke={color}
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={strokeWidth}
			viewBox="0 0 24 24"
			width={size}
			{...rest}
		/>
	);
};

export const DownloadIcon = (props: IconSvgProps) => {
	const {
		size = 24,
		strokeWidth = 1.5,
		color = "currentColor",
		...rest
	} = props;

	return (
		<Download
			height={size}
			stroke={color}
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={strokeWidth}
			viewBox="0 0 24 24"
			width={size}
			{...rest}
		/>
	);
};

export const UploadIcon = (props: IconSvgProps) => {
	const {
		size = 24,
		strokeWidth = 1.5,
		color = "currentColor",
		...rest
	} = props;

	return (
		<Upload
			height={size}
			stroke={color}
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={strokeWidth}
			viewBox="0 0 24 24"
			width={size}
			{...rest}
		/>
	);
};

export const UploadFileIcon = (props: IconSvgProps) => {
	const { fill, size = 24, width, height, ...rest } = props;

	return (
		<svg
			height={size || height}
			viewBox="0 0 24 24"
			width={size || width}
			{...rest}
		>
			<path
				d="M14,19a5,5,0,0,1,4-4.9h0V5a1,1,0,0,0-.29-.71l-2-2A1,1,0,0,0,15,2H4A2,2,0,0,0,2,4V20a2,2,0,0,0,2,2H15A5,5,0,0,1,14,19Z"
				fill={fill || "#2563eb"}
			/>
			<path
				d="M19,22a1,1,0,0,1-1-1V20H17a1,1,0,0,1,0-2h1V17a1,1,0,0,1,2,0v1h1a1,1,0,0,1,0,2H20v1A1,1,0,0,1,19,22ZM15,4a1,1,0,0,0,1,1h2a1,1,0,0,0-.28-.71l-2-2A1,1,0,0,0,15,2Zm-2,9a1,1,0,0,0-1-1H6a1,1,0,0,0,0,2h6A1,1,0,0,0,13,13Zm2-4a1,1,0,0,0-1-1H6a1,1,0,0,0,0,2h8A1,1,0,0,0,15,9Z"
				fill={fill || "#38bdf8"}
			/>
		</svg>
	);
};

export const AddIcon = (props: IconSvgProps) => {
	const {
		size = 24,
		strokeWidth = 1,
		variant = "fill",
		color = "currentColor",
		...rest
	} = props;

	return (
		<svg
			fill={variant === "fill" ? color : "none"}
			height={size}
			stroke={variant === "border" ? color : "none"}
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={strokeWidth}
			viewBox="0 0 24 24"
			width={size}
			{...rest}
		>
			<path
				clipRule="evenodd"
				d="M12 22C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12C2 7.28595 2 4.92893 3.46447 3.46447C4.92893 2 7.28595 2 12 2C16.714 2 19.0711 2 20.5355 3.46447C22 4.92893 22 7.28595 22 12C22 16.714 22 19.0711 20.5355 20.5355C19.0711 22 16.714 22 12 22ZM12 8.25C12.4142 8.25 12.75 8.58579 12.75 9V11.25H15C15.4142 11.25 15.75 11.5858 15.75 12C15.75 12.4142 15.4142 12.75 15 12.75H12.75L12.75 15C12.75 15.4142 12.4142 15.75 12 15.75C11.5858 15.75 11.25 15.4142 11.25 15V12.75H9C8.58579 12.75 8.25 12.4142 8.25 12C8.25 11.5858 8.58579 11.25 9 11.25H11.25L11.25 9C11.25 8.58579 11.5858 8.25 12 8.25Z"
				fillRule="evenodd"
			/>
		</svg>
	);
};

export const RemoveIcon = (props: IconSvgProps) => {
	const {
		size = 24,
		strokeWidth = 1.5,
		color = "currentColor",
		...rest
	} = props;

	return (
		<Trash2
			height={size}
			stroke={color}
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={strokeWidth}
			viewBox="0 0 24 24"
			width={size}
			{...rest}
		/>
	);
};

export const CancelIcon = (props: IconSvgProps) => {
	const {
		size = 24,
		strokeWidth = 1.5,
		color = "currentColor",
		...rest
	} = props;

	return (
		<X
			height={size}
			stroke={color}
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={strokeWidth}
			viewBox="0 0 24 24"
			width={size}
			{...rest}
		/>
	);
};

export const CheckIcon = (props: IconSvgProps) => {
	const {
		size = 24,
		strokeWidth = 1.5,
		color = "currentColor",
		...rest
	} = props;

	return (
		<Check
			height={size}
			stroke={color}
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={strokeWidth}
			viewBox="0 0 24 24"
			width={size}
			{...rest}
		/>
	);
};

export const TimerIcon = (props: IconSvgProps) => {
	const {
		size = 24,
		strokeWidth = 1.5,
		color = "currentColor",
		...rest
	} = props;

	return (
		<Timer
			height={size}
			stroke={color}
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={strokeWidth}
			viewBox="0 0 24 24"
			width={size}
			{...rest}
		/>
	);
};

export const ClockIcon = (props: IconSvgProps) => {
	const {
		size = 24,
		strokeWidth = 2,
		color = "currentColor",
		...rest
	} = props;

	return (
		<Clock
			height={size}
			stroke={color}
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={strokeWidth}
			viewBox="0 0 24 24"
			width={size}
			{...rest}
		/>
	);
};
