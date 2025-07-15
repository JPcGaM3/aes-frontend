import * as React from "react";
import {
	EllipsisVertical,
	Eye,
	EyeClosed,
	Moon,
	Plus,
	Search,
	SunDim,
	User,
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

export const ChevronDownIcon = (props: IconSvgProps) => {
	const {
		size = 24,
		strokeWidth = 1,
		variant = "fill",
		color = "currentColor",
		...rest
	} = props;

	return (
		<ChevronDownIcon
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

export const ChevronUpIcon = (props: IconSvgProps) => {
	const {
		size = 24,
		strokeWidth = 1,
		variant = "fill",
		color = "currentColor",
		...rest
	} = props;

	return (
		<ChevronUpIcon
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

export const EyeIcon = (props: IconSvgProps) => {
	const { size = 24, strokeWidth = 2, color = "currentColor", ...rest } = props;

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
	const { size = 24, strokeWidth = 2, color = "currentColor", ...rest } = props;

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

export const ChevronsRight = (props: IconSvgProps) => {
	const {
		size = 24,
		strokeWidth = 1,
		variant = "fill",
		color = "currentColor",
		...rest
	} = props;

	return (
		<ChevronsRight
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

export const FilterIcon = (props: IconSvgProps) => {
	const { fill, size = 24, width, height, strokeWidth, ...rest } = props;

	return (
		<svg
			fill={fill || "currentColor"}
			height={size || height}
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={strokeWidth || "none"}
			viewBox="0 0 24 24"
			width={size || width}
			{...rest}
		>
			<path
				d="M4.95301 2.25C4.96862 2.25 4.98429 2.25 5.00001 2.25L19.047 2.25C19.7139 2.24997 20.2841 2.24994 20.7398 2.30742C21.2231 2.36839 21.6902 2.50529 22.0738 2.86524C22.4643 3.23154 22.6194 3.68856 22.6875 4.16405C22.7501 4.60084 22.7501 5.14397 22.75 5.76358L22.75 6.54012C22.75 7.02863 22.75 7.45095 22.7136 7.80311C22.6743 8.18206 22.5885 8.5376 22.3825 8.87893C22.1781 9.2177 21.9028 9.4636 21.5854 9.68404C21.2865 9.8917 20.9045 10.1067 20.4553 10.3596L17.5129 12.0159C16.8431 12.393 16.6099 12.5288 16.4542 12.6639C16.0966 12.9744 15.8918 13.3188 15.7956 13.7504C15.7545 13.9349 15.75 14.1672 15.75 14.8729L15.75 17.605C15.7501 18.5062 15.7501 19.2714 15.6574 19.8596C15.5587 20.4851 15.3298 21.0849 14.7298 21.4602C14.1434 21.827 13.4975 21.7933 12.8698 21.6442C12.2653 21.5007 11.5203 21.2094 10.6264 20.8599L10.5395 20.826C10.1208 20.6623 9.75411 20.519 9.46385 20.3691C9.1519 20.208 8.8622 20.0076 8.64055 19.6957C8.41641 19.3803 8.32655 19.042 8.28648 18.6963C8.24994 18.381 8.24997 18.0026 8.25 17.5806L8.25 14.8729C8.25 14.1672 8.24555 13.9349 8.20442 13.7504C8.1082 13.3188 7.90342 12.9744 7.54584 12.6639C7.39014 12.5288 7.15692 12.393 6.48714 12.0159L3.54471 10.3596C3.09549 10.1067 2.71353 9.8917 2.41458 9.68404C2.09724 9.4636 1.82191 9.2177 1.61747 8.87893C1.41148 8.5376 1.32571 8.18206 1.28645 7.80311C1.24996 7.45094 1.24998 7.02863 1.25 6.54012L1.25001 5.81466C1.25001 5.79757 1.25 5.78054 1.25 5.76357C1.24996 5.14396 1.24991 4.60084 1.31251 4.16405C1.38064 3.68856 1.53576 3.23154 1.92618 2.86524C2.30983 2.50529 2.77695 2.36839 3.26024 2.30742C3.71592 2.24994 4.28607 2.24997 4.95301 2.25ZM3.44796 3.79563C3.1143 3.83772 3.0082 3.90691 2.95251 3.95916C2.90359 4.00505 2.83904 4.08585 2.79734 4.37683C2.75181 4.69454 2.75001 5.12868 2.75001 5.81466V6.50448C2.75001 7.03869 2.75093 7.38278 2.77846 7.64854C2.8041 7.89605 2.84813 8.01507 2.90174 8.10391C2.9569 8.19532 3.0485 8.298 3.27034 8.45209C3.50406 8.61444 3.82336 8.79508 4.30993 9.06899L7.22296 10.7088C7.25024 10.7242 7.2771 10.7393 7.30357 10.7542C7.86227 11.0685 8.24278 11.2826 8.5292 11.5312C9.12056 12.0446 9.49997 12.6682 9.66847 13.424C9.75036 13.7913 9.75022 14.2031 9.75002 14.7845C9.75002 14.8135 9.75 14.843 9.75 14.8729V17.5424C9.75 18.0146 9.75117 18.305 9.77651 18.5236C9.79942 18.7213 9.83552 18.7878 9.8633 18.8269C9.89359 18.8695 9.95357 18.9338 10.152 19.0363C10.3644 19.146 10.6571 19.2614 11.1192 19.442C12.0802 19.8177 12.7266 20.0685 13.2164 20.1848C13.695 20.2985 13.8527 20.2396 13.9343 20.1885C14.0023 20.146 14.1073 20.0597 14.1757 19.626C14.2478 19.1686 14.25 18.5234 14.25 17.5424V14.8729C14.25 14.843 14.25 14.8135 14.25 14.7845C14.2498 14.2031 14.2496 13.7913 14.3315 13.424C14.5 12.6682 14.8794 12.0446 15.4708 11.5312C15.7572 11.2826 16.1377 11.0685 16.6964 10.7542C16.7229 10.7393 16.7498 10.7242 16.7771 10.7088L19.6901 9.06899C20.1767 8.79508 20.496 8.61444 20.7297 8.45209C20.9515 8.298 21.0431 8.19532 21.0983 8.10391C21.1519 8.01507 21.1959 7.89605 21.2215 7.64854C21.2491 7.38278 21.25 7.03869 21.25 6.50448V5.81466C21.25 5.12868 21.2482 4.69454 21.2027 4.37683C21.161 4.08585 21.0964 4.00505 21.0475 3.95916C20.9918 3.90691 20.8857 3.83772 20.5521 3.79563C20.2015 3.75141 19.727 3.75 19 3.75H5.00001C4.27297 3.75 3.79854 3.75141 3.44796 3.79563Z"
				xmlns="http://www.w3.org/2000/svg"
			/>
		</svg>
	);
};

export const HamburgerIcon = (props: IconSvgProps) => {
	const { fill, size = 24, width, height, strokeWidth, ...rest } = props;

	return (
		<svg
			height={size || height}
			stroke={fill || "currentColor"}
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={strokeWidth || 2}
			viewBox="0 0 24 24"
			width={size || width}
			{...rest}
		>
			<path d="M4 18L20 18" />
			<path d="M4 12L20 12" />
			<path d="M4 6L20 6" />
		</svg>
	);
};

export const HomeIcon = (props: IconSvgProps) => {
	const { fill, size = 24, width, height, strokeWidth, ...rest } = props;

	return (
		<svg
			fill={fill || "currentColor"}
			height={size || height}
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={strokeWidth || "none"}
			viewBox="0 0 24 24"
			width={size || width}
			{...rest}
		>
			<path d="M3 10.5L12 4l9 6.5V20a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1v-4h-4v4a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V10.5Z" />
		</svg>
	);
};

export const DocumentIcon = (props: IconSvgProps) => {
	const { fill, size = 24, width, height, strokeWidth, ...rest } = props;

	return (
		<svg
			height={size || height}
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={strokeWidth || "none"}
			viewBox="0 0 52 52"
			width={size || width}
			{...rest}
		>
			<rect fill="none" height="4.8" rx="1.6" width="27.2" x="12.4" y="26" />
			<rect fill="none" height="4.8" rx="1.6" width="24" x="12.4" y="35.6" />
			<g>
				<path
					d="m36.4 14.8h8.48a1.09 1.09 0 0 0 1.12-1.12 1 1 0 0 0 -.32-.8l-10.56-10.56a1 1 0 0 0 -.8-.32 1.09 1.09 0 0 0 -1.12 1.12v8.48a3.21 3.21 0 0 0 3.2 3.2z"
					fill={fill || "currentColor"}
				/>
				<path
					d="m44.4 19.6h-11.2a4.81 4.81 0 0 1 -4.8-4.8v-11.2a1.6 1.6 0 0 0 -1.6-1.6h-16a4.81 4.81 0 0 0 -4.8 4.8v38.4a4.81 4.81 0 0 0 4.8 4.8h30.4a4.81 4.81 0 0 0 4.8-4.8v-24a1.6 1.6 0 0 0 -1.6-1.6zm-32-1.6a1.62 1.62 0 0 1 1.6-1.55h6.55a1.56 1.56 0 0 1 1.57 1.55v1.59a1.63 1.63 0 0 1 -1.59 1.58h-6.53a1.55 1.55 0 0 1 -1.58-1.58zm24 20.77a1.6 1.6 0 0 1 -1.6 1.6h-20.8a1.6 1.6 0 0 1 -1.6-1.6v-1.57a1.6 1.6 0 0 1 1.6-1.6h20.8a1.6 1.6 0 0 1 1.6 1.6zm3.2-9.6a1.6 1.6 0 0 1 -1.6 1.63h-24a1.6 1.6 0 0 1 -1.6-1.6v-1.6a1.6 1.6 0 0 1 1.6-1.6h24a1.6 1.6 0 0 1 1.6 1.6z"
					fill={fill || "currentColor"}
				/>
			</g>
		</svg>
	);
};

export const CardIcon = (props: IconSvgProps) => {
	const { fill, size = 24, width, height, strokeWidth, ...rest } = props;

	return (
		<svg
			height={size || height}
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={strokeWidth || "none"}
			viewBox="0 0 24 24"
			width={size || width}
			{...rest}
		>
			<path
				d="M14 4H10C6.22876 4 4.34315 4 3.17157 5.17157C2.32803 6.01511 2.09185 7.22882 2.02572 9.25H21.9743C21.9082 7.22882 21.672 6.01511 20.8284 5.17157C19.6569 4 17.7712 4 14 4Z"
				fill={fill || "currentColor"}
			/>
			<path
				d="M10 20H14C17.7712 20 19.6569 20 20.8284 18.8284C22 17.6569 22 15.7712 22 12C22 11.5581 22 11.142 21.9981 10.75H2.00189C2 11.142 2 11.5581 2 12C2 15.7712 2 17.6569 3.17157 18.8284C4.34315 20 6.22876 20 10 20Z"
				fill={fill || "currentColor"}
			/>
		</svg>
	);
};

export const DrawerIcon = (props: IconSvgProps) => {
	const { fill, size = 24, width, height, strokeWidth, ...rest } = props;

	return (
		<svg
			height={size || height}
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={strokeWidth || "none"}
			viewBox="0 0 24 24"
			width={size || width}
			{...rest}
		>
			<path
				d="M21.6939 10.8776C21.5918 9.8572 20.8776 8.93884 19.9592 8.63271C19.9592 8.32659 19.9592 7.91843 19.8571 7.51027C19.7551 6.48986 18.9388 5.57149 17.9184 5.36741C17.9184 5.16333 17.9184 4.8572 17.8163 4.55108C17.7143 3.22455 16.5918 2.20414 15.2653 2.1021C14.3469 2.1021 13.0204 2.00006 12 2.00006C10.9796 2.00006 9.65306 2.1021 8.73469 2.1021C7.40816 2.20414 6.28572 3.22455 6.18367 4.55108C6.18367 4.8572 6.18367 5.06129 6.08163 5.36741C5.06122 5.67353 4.2449 6.48986 4.14286 7.51027C4.14286 7.91843 4.04082 8.32659 4.04082 8.63271C3.12245 8.93884 2.5102 9.8572 2.30612 10.8776C2.20408 12.1021 2 13.7348 2 15.0613C2 16.3878 2.20408 18.0205 2.30612 19.245C2.40816 20.5715 3.53061 21.5919 4.85714 21.6939C6.89796 21.796 9.7551 22.0001 12 22.0001C14.2449 22.0001 17.102 21.796 19.1429 21.6939C20.4694 21.5919 21.5918 20.5715 21.6939 19.245C21.7959 18.0205 22 16.3878 22 15.0613C22 13.7348 21.7959 12.1021 21.6939 10.8776ZM8.83674 3.73476C9.7551 3.73476 10.9796 3.63271 12 3.63271C13.0204 3.63271 14.2449 3.73476 15.1633 3.73476C15.7755 3.73476 16.1837 4.24496 16.2857 4.75516C16.2857 4.95925 16.2857 5.06129 16.2857 5.26537C14.9592 5.26537 13.3265 5.16333 12 5.16333C10.6735 5.16333 9.04082 5.16333 7.71429 5.26537C7.71429 5.06129 7.71429 4.95925 7.71429 4.75516C7.81633 4.14292 8.22449 3.73476 8.83674 3.73476ZM14.0408 15.8776H9.95918C9.55102 15.8776 9.14286 15.5715 9.14286 15.0613C9.14286 14.5511 9.44898 14.245 9.95918 14.245H14.0408C14.449 14.245 14.8571 14.5511 14.8571 15.0613C14.8571 15.5715 14.449 15.8776 14.0408 15.8776ZM12 8.12251C10.0612 8.12251 7.61225 8.22455 5.67347 8.32659C5.67347 8.12251 5.67347 7.91843 5.77551 7.61231C5.87755 7.1021 6.28571 6.69394 6.89796 6.69394C8.42857 6.5919 10.4694 6.5919 12.102 6.5919C13.7347 6.5919 15.7755 6.69394 17.3061 6.69394C17.9184 6.69394 18.3265 7.1021 18.4286 7.61231C18.4286 7.81639 18.5306 8.12251 18.5306 8.32659C16.3878 8.32659 13.9388 8.12251 12 8.12251Z"
				fill={fill || "currentColor"}
			/>
		</svg>
	);
};

export const LoginIcon = (props: IconSvgProps) => {
	const { fill, size = 24, width, height, strokeWidth, ...rest } = props;

	return (
		<svg
			height={size || height}
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={strokeWidth || "none"}
			viewBox="0 0 24 24"
			width={size || width}
			{...rest}
		>
			<path
				d="M16.7071 14.2929C17.0976 14.6834 17.0976 15.3166 16.7071 15.7071C16.3166 16.0976 15.6834 16.0976 15.2929 15.7071L12.3799 12.7941C12.3649 12.7791 12.3503 12.7637 12.3363 12.748C12.13 12.5648 12 12.2976 12 12C12 11.7024 12.13 11.4352 12.3363 11.252C12.3503 11.2363 12.3649 11.2209 12.3799 11.2059L15.2929 8.29289C15.6834 7.90237 16.3166 7.90237 16.7071 8.29289C17.0976 8.68342 17.0976 9.31658 16.7071 9.70711L15.4142 11H21C21.5523 11 22 11.4477 22 12C22 12.5523 21.5523 13 21 13H15.4142L16.7071 14.2929Z"
				fill={fill || "currentColor"}
			/>
			<path
				d="M5 2C3.34315 2 2 3.34315 2 5V19C2 20.6569 3.34315 22 5 22H14.5C15.8807 22 17 20.8807 17 19.5V16.7326C16.2351 17.1747 15.2401 17.0686 14.5858 16.4142L11.6728 13.5012C11.658 13.4865 11.6435 13.4715 11.6292 13.4563C11.2431 13.0928 11 12.5742 11 12C11 11.4258 11.2431 10.9072 11.6292 10.5437C11.6435 10.5285 11.658 10.5135 11.6728 10.4988L14.5858 7.58579C15.2402 6.93142 16.2351 6.82529 17 7.26738V4.5C17 3.11929 15.8807 2 14.5 2H5Z"
				fill={fill || "currentColor"}
			/>
			<path
				d="M5 2C3.34315 2 2 3.34315 2 5V19C2 20.6569 3.34315 22 5 22H14.5C15.8807 22 17 20.8807 17 19.5V16.7326C16.2351 17.1747 15.2401 17.0686 14.5858 16.4142L11.6728 13.5012C11.658 13.4865 11.6435 13.4715 11.6292 13.4563C11.2431 13.0928 11 12.5742 11 12C11 11.4258 11.2431 10.9072 11.6292 10.5437C11.6435 10.5285 11.658 10.5135 11.6728 10.4988L14.5858 7.58579C15.2402 6.93142 16.2351 6.82529 17 7.26738V4.5C17 3.11929 15.8807 2 14.5 2H5Z"
				fill={fill || "currentColor"}
			/>
		</svg>
	);
};

export const RequestIcon = (props: IconSvgProps) => {
	const { fill, size = 24, width, height, strokeWidth, ...rest } = props;

	return (
		<svg
			height={size || height}
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={strokeWidth || "none"}
			viewBox="0 0 24 24"
			width={size || width}
			{...rest}
		>
			<path
				clipRule="evenodd"
				d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12ZM16.0303 8.96967C16.3232 9.26256 16.3232 9.73744 16.0303 10.0303L11.0303 15.0303C10.7374 15.3232 10.2626 15.3232 9.96967 15.0303L7.96967 13.0303C7.67678 12.7374 7.67678 12.2626 7.96967 11.9697C8.26256 11.6768 8.73744 11.6768 9.03033 11.9697L10.5 13.4393L12.7348 11.2045L14.9697 8.96967C15.2626 8.67678 15.7374 8.67678 16.0303 8.96967Z"
				fill={fill || "currentColor"}
				fillRule="evenodd"
			/>
		</svg>
	);
};

export const InfoIcon = (props: IconSvgProps) => {
	const { fill, size = 24, width, height, strokeWidth, ...rest } = props;

	return (
		<svg
			fill="none"
			height={size || height}
			viewBox="0 0 24 24"
			width={size || width}
			{...rest}
		>
			<path
				d="M12 17V11"
				stroke={fill || "currentColor"}
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth={strokeWidth || 1.5}
			/>
			<circle
				cx="1"
				cy="1"
				fill={fill || "currentColor"}
				r="1"
				transform="matrix(1 0 0 -1 11 9)"
			/>
			<path
				d="M2 12C2 7.28595 2 4.92893 3.46447 3.46447C4.92893 2 7.28595 2 12 2C16.714 2 19.0711 2 20.5355 3.46447C22 4.92893 22 7.28595 22 12C22 16.714 22 19.0711 20.5355 20.5355C19.0711 22 16.714 22 12 22C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12Z"
				stroke={fill || "currentColor"}
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth={strokeWidth || 1.5}
			/>
		</svg>
	);
};

export const EditIcon = (props: IconSvgProps) => {
	const { fill, size = 24, width, height, strokeWidth, ...rest } = props;

	return (
		<svg
			fill="none"
			height={size || height}
			viewBox="0 0 24 24"
			width={size || width}
			{...rest}
		>
			<path
				d="M21.2799 6.40005L11.7399 15.94C10.7899 16.89 7.96987 17.33 7.33987 16.7C6.70987 16.07 7.13987 13.25 8.08987 12.3L17.6399 2.75002C17.8754 2.49308 18.1605 2.28654 18.4781 2.14284C18.7956 1.99914 19.139 1.92124 19.4875 1.9139C19.8359 1.90657 20.1823 1.96991 20.5056 2.10012C20.8289 2.23033 21.1225 2.42473 21.3686 2.67153C21.6147 2.91833 21.8083 3.21243 21.9376 3.53609C22.0669 3.85976 22.1294 4.20626 22.1211 4.55471C22.1128 4.90316 22.0339 5.24635 21.8894 5.5635C21.7448 5.88065 21.5375 6.16524 21.2799 6.40005V6.40005Z"
				stroke={fill || "currentColor"}
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth={strokeWidth || 1.5}
			/>
			<path
				d="M11 4H6C4.93913 4 3.92178 4.42142 3.17163 5.17157C2.42149 5.92172 2 6.93913 2 8V18C2 19.0609 2.42149 20.0783 3.17163 20.8284C3.92178 21.5786 4.93913 22 6 22H17C19.21 22 20 20.2 20 18V13"
				stroke={fill || "currentColor"}
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth={strokeWidth || 1.5}
			/>
		</svg>
	);
};

export const RejectIcon = (props: IconSvgProps) => {
	const { fill, size = 24, width, height, strokeWidth, ...rest } = props;

	return (
		<svg
			fill="none"
			height={size || height}
			stroke={fill || "currentColor"}
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={strokeWidth || 2}
			viewBox="0 0 32 32"
			width={size || width}
			{...rest}
		>
			<circle cx="16" cy="16" r="13" />
			<line x1="13.2" x2="18.8" y1="13.2" y2="18.8" />
			<line x1="13.2" x2="18.8" y1="18.8" y2="13.2" />
		</svg>
	);
};

export const DownloadIcon = (props: IconSvgProps) => {
	const { fill, size = 24, width, height, strokeWidth, ...rest } = props;

	return (
		<svg
			fill="none"
			height={size || height}
			stroke={fill || "currentColor"}
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={strokeWidth || 2}
			viewBox="0 0 24 24"
			width={size || width}
			{...rest}
		>
			<path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
		</svg>
	);
};

export const UploadFileIcon = (props: IconSvgProps) => {
	const { fill, size = 24, width, height, strokeWidth, ...rest } = props;

	return (
		<svg
			height={size || height}
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={strokeWidth || 2}
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

export const DeleteIcon = (props: IconSvgProps) => {
	const { fill, size = 24, width, height, strokeWidth, ...rest } = props;

	return (
		<svg
			fill="none"
			height={size || height}
			stroke={fill || "currentColor"}
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={strokeWidth || 2}
			viewBox="0 0 24 24"
			width={size || width}
			{...rest}
		>
			<path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
		</svg>
	);
};

export const SettingIcon = (props: IconSvgProps) => {
	const { fill, size = 24, width, height, strokeWidth, ...rest } = props;

	return (
		<svg
			height={size || height}
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={strokeWidth || 2}
			viewBox="0 0 24 24"
			width={size || width}
			{...rest}
		>
			<path
				d="M20.1 9.2214C18.29 9.2214 17.55 7.9414 18.45 6.3714C18.97 5.4614 18.66 4.3014 17.75 3.7814L16.02 2.7914C15.23 2.3214 14.21 2.6014 13.74 3.3914L13.63 3.5814C12.73 5.1514 11.25 5.1514 10.34 3.5814L10.23 3.3914C9.78 2.6014 8.76 2.3214 7.97 2.7914L6.24 3.7814C5.33 4.3014 5.02 5.4714 5.54 6.3814C6.45 7.9414 5.71 9.2214 3.9 9.2214C2.86 9.2214 2 10.0714 2 11.1214V12.8814C2 13.9214 2.85 14.7814 3.9 14.7814C5.71 14.7814 6.45 16.0614 5.54 17.6314C5.02 18.5414 5.33 19.7014 6.24 20.2214L7.97 21.2114C8.76 21.6814 9.78 21.4014 10.25 20.6114L10.36 20.4214C11.26 18.8514 12.74 18.8514 13.65 20.4214L13.76 20.6114C14.23 21.4014 15.25 21.6814 16.04 21.2114L17.77 20.2214C18.68 19.7014 18.99 18.5314 18.47 17.6314C17.56 16.0614 18.3 14.7814 20.11 14.7814C21.15 14.7814 22.01 13.9314 22.01 12.8814V11.1214C22 10.0814 21.15 9.2214 20.1 9.2214ZM12 15.2514C10.21 15.2514 8.75 13.7914 8.75 12.0014C8.75 10.2114 10.21 8.7514 12 8.7514C13.79 8.7514 15.25 10.2114 15.25 12.0014C15.25 13.7914 13.79 15.2514 12 15.2514Z"
				fill={fill || "currentColor"}
			/>
		</svg>
	);
};

export const AddIcon = (props: IconSvgProps) => {
	const { fill, size = 24, width, height, strokeWidth, ...rest } = props;

	return (
		<svg
			height={size || height}
			viewBox="0 0 24 24"
			width={size || width}
			{...rest}
		>
			<g id="Complete">
				<g data-name="add" id="add-2">
					<g>
						<line
							stroke={fill || "currentColor"}
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={strokeWidth || 2}
							x1="12"
							x2="12"
							y1="19"
							y2="5"
						/>

						<line
							stroke={fill || "currentColor"}
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={strokeWidth || 2}
							x1="5"
							x2="19"
							y1="12"
							y2="12"
						/>
					</g>
				</g>
			</g>
		</svg>
	);
};

export const MinusIcon = (props: IconSvgProps) => {
	const { fill, size = 24, width, height, strokeWidth, ...rest } = props;

	return (
		<svg
			height={size || height}
			viewBox="0 0 24 24"
			width={size || width}
			{...rest}
		>
			<g id="Complete">
				<g data-name="add" id="add-2">
					<g>
						<line
							stroke={fill || "currentColor"}
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={strokeWidth || 2}
							x1="5"
							x2="19"
							y1="12"
							y2="12"
						/>
					</g>
				</g>
			</g>
		</svg>
	);
};

export const CancelIcon = (props: IconSvgProps) => {
	const { fill, size = 24, width, height, strokeWidth, ...rest } = props;

	return (
		<svg
			height={size || height}
			viewBox="0 0 24 24"
			width={size || width}
			{...rest}
		>
			<path
				d="M19 5L5 19M5.00001 5L19 19"
				stroke={fill || "currentColor"}
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth={strokeWidth || 2}
			/>
		</svg>
	);
};

export const CheckIcon = (props: IconSvgProps) => {
	const { fill, size = 18, width, height, strokeWidth, ...rest } = props;

	return (
		<svg
			fill="none"
			height={size || height}
			viewBox="0 0 48 48"
			width={size || width}
			{...rest}
		>
			<path
				d="M10 24L20 34L40 14"
				stroke={fill || "currentColor"}
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth={strokeWidth || 3}
			/>
		</svg>
	);
};
