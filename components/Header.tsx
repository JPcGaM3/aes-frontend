import React from "react";
import { clsx } from "clsx";
import { Divider } from "@heroui/react";

import { HeaderProps } from "@/interfaces/props";

export default function Header({
	title,
	subtitle,
	hasBorder = true,
	orientation = "vertical",
	className = "w-full",
	titleClassName = "text-3xl font-bold text-gray-900",
	subtitleClassName = "mt-1 text-md text-gray-600",
	headerContainerClassName,
	childrenContainerClassName = "gap-2",
	borderClassName = "mt-4 border-gray-200",
	children,
}: HeaderProps) {
	const hasChildren = React.Children.count(children) > 0;

	const headerContainerClasses = clsx(
		"flex w-full",
		{
			"flex-row justify-between items-center'":
				orientation === "horizontal",
			"flex-col justify-center": orientation === "vertical",
		},
		headerContainerClassName
	);

	const titleContainerClasses = clsx("flex flex-col", {
		"w-full text-start": orientation === "horizontal",
		"items-center text-center": orientation === "vertical",
	});

	const childrenContainerClasses = clsx(
		"flex flex-row items-center",
		{
			"justify-end": orientation === "horizontal" && hasChildren,
			"justify-center mt-4": orientation === "vertical" && hasChildren,
		},
		childrenContainerClassName
	);

	return (
		<header className={clsx("flex flex-col", className)}>
			<div className={headerContainerClasses}>
				<div className={titleContainerClasses}>
					<h2 className={clsx(titleClassName)}>{title}</h2>
					{subtitle && (
						<p className={clsx(subtitleClassName)}>{subtitle}</p>
					)}
				</div>

				{hasChildren && (
					<div className={childrenContainerClasses}>{children}</div>
				)}
			</div>

			{hasBorder && <Divider className={borderClassName} />}
		</header>
	);
}
