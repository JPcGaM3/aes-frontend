import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
	size?: number;
	color?: string;
	variant?: "fill" | "border";
};

export type ColorType =
	| "default"
	| "primary"
	| "secondary"
	| "success"
	| "warning"
	| "danger";
