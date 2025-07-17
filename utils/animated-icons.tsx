import React from "react";
import Lottie from "lottie-react";
import Image from "next/image";

export interface AnimatedIconProps {
	/**
	 * Size of the icon
	 * @default 24
	 */
	size?: number;
	/**
	 * Color of the icon
	 * @default "currentColor"
	 */
	color?: string;
	/**
	 * The animation format to use
	 * @default "gif"
	 */
	format?: "gif" | "mp4" | "lottie";
	/**
	 * Whether the animation should loop
	 * @default true
	 */
	loop?: boolean;
	/**
	 * Whether the animation should autoplay
	 * @default true
	 */
	autoplay?: boolean;
	/**
	 * Speed of the animation (1 = normal speed)
	 * @default 1
	 */
	speed?: number;
	/**
	 * Custom animation data for Lottie format
	 */
	animationData?: any;
	/**
	 * Additional CSS classes
	 */
	className?: string;
	/**
	 * Additional inline styles
	 */
	style?: React.CSSProperties;
}

export const HourglassAnimatedIcon: React.FC<AnimatedIconProps> = ({
	size = 24,
	color = "currentColor",
	format = "gif",
	loop = true,
	autoplay = true,
	speed: _speed = 1,
	animationData,
	className = "",
	style = {},
}) => {
	const baseStyle: React.CSSProperties = {
		width: size,
		height: size,
		display: "inline-block",
		verticalAlign: "middle",
		...style,
	};

	// If using Lottie format with animation data
	if (format === "lottie" && animationData) {
		return (
			<div className={className} style={baseStyle}>
				<Lottie
					animationData={animationData}
					autoplay={autoplay}
					loop={loop}
					style={{
						width: "100%",
						height: "100%",
						filter:
							color !== "currentColor"
								? `hue-rotate(${color})`
								: undefined,
					}}
				/>
			</div>
		);
	}

	// For GIF format
	if (format === "gif") {
		return (
			<Image
				unoptimized
				alt="Loading..."
				className={className}
				height={typeof size === "number" ? size : 24}
				src="/gif/Hourglass Animated Icon.gif"
				style={{
					...baseStyle,
					filter:
						color !== "currentColor"
							? `hue-rotate(${color})`
							: undefined,
				}}
				width={typeof size === "number" ? size : 24}
			/>
		);
	}

	// For MP4 format
	if (format === "mp4") {
		return (
			<video
				muted
				autoPlay={autoplay}
				className={className}
				loop={loop}
				src="/video/Hourglass Animated Icon.mp4"
				style={{
					...baseStyle,
					filter:
						color !== "currentColor"
							? `hue-rotate(${color})`
							: undefined,
				}}
			>
				Your browser does not support the video tag.
			</video>
		);
	}

	// Fallback to GIF if format is not recognized
	return (
		<Image
			unoptimized
			alt="Loading..."
			className={className}
			height={typeof size === "number" ? size : 24}
			src="/gif/Hourglass Animated Icon.gif"
			style={{
				...baseStyle,
				filter:
					color !== "currentColor"
						? `hue-rotate(${color})`
						: undefined,
			}}
			width={typeof size === "number" ? size : 24}
		/>
	);
};

/**
 * Simple hourglass icon using GIF format
 */
export const HourglassIcon: React.FC<Omit<AnimatedIconProps, "format">> = (
	props
) => {
	return <HourglassAnimatedIcon {...props} format="gif" />;
};

/**
 * Hourglass icon using MP4 format for better quality
 */
export const HourglassVideoIcon: React.FC<Omit<AnimatedIconProps, "format">> = (
	props
) => {
	return <HourglassAnimatedIcon {...props} format="mp4" />;
};

/**
 * Hourglass icon using Lottie format (requires animationData prop)
 */
export const HourglassLottieIcon: React.FC<AnimatedIconProps> = (props) => {
	return <HourglassAnimatedIcon {...props} format="lottie" />;
};
