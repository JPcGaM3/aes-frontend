import React from "react";

import {
	HourglassAnimatedIcon,
	HourglassIcon,
	HourglassVideoIcon,
} from "@/utils/animated-icons";

/**
 * Example usage of the HourglassAnimatedIcon component
 */
export default function AnimatedIconExample() {
	return (
		<div className="p-8 space-y-8">
			<h1 className="mb-6 text-2xl font-bold">
				Hourglass Animated Icon Examples
			</h1>

			{/* Basic GIF usage */}
			<div className="space-y-4">
				<h2 className="text-lg font-semibold">Basic GIF Format</h2>
				<div className="flex items-center gap-4">
					<HourglassIcon size={24} />
					<HourglassIcon size={32} />
					<HourglassIcon size={48} />
				</div>
			</div>

			{/* MP4 format */}
			<div className="space-y-4">
				<h2 className="text-lg font-semibold">MP4 Video Format</h2>
				<div className="flex items-center gap-4">
					<HourglassVideoIcon size={24} />
					<HourglassVideoIcon size={32} />
					<HourglassVideoIcon size={48} />
				</div>
			</div>

			{/* Custom animated icon with different props */}
			<div className="space-y-4">
				<h2 className="text-lg font-semibold">Custom Configuration</h2>
				<div className="flex items-center gap-4">
					<HourglassAnimatedIcon
						autoplay={true}
						format="gif"
						loop={true}
						size={32}
					/>
					<HourglassAnimatedIcon
						autoplay={true}
						format="mp4"
						loop={false}
						size={32}
					/>
				</div>
			</div>

			{/* With custom styling */}
			<div className="space-y-4">
				<h2 className="text-lg font-semibold">With Custom Styling</h2>
				<div className="flex items-center gap-4">
					<HourglassIcon
						className="transition-opacity opacity-75 hover:opacity-100"
						size={40}
					/>
					<HourglassVideoIcon
						className="p-2 border-2 border-gray-300 rounded-full"
						size={40}
					/>
				</div>
			</div>

			{/* Loading states example */}
			<div className="space-y-4">
				<h2 className="text-lg font-semibold">Loading States</h2>
				<div className="flex items-center gap-4">
					<div className="flex items-center gap-2">
						<HourglassIcon size={20} />
						<span>Loading...</span>
					</div>
					<div className="flex items-center gap-2">
						<HourglassVideoIcon size={20} />
						<span>Processing...</span>
					</div>
				</div>
			</div>

			{/* Usage in buttons */}
			<div className="space-y-4">
				<h2 className="text-lg font-semibold">In Buttons</h2>
				<div className="flex gap-4">
					<button className="flex items-center gap-2 px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600">
						<HourglassIcon size={16} />
						Loading
					</button>
					<button className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300">
						<HourglassVideoIcon size={16} />
						Please wait
					</button>
				</div>
			</div>
		</div>
	);
}

// Usage examples as individual components
export const LoadingSpinner = ({ size = 20 }: { size?: number }) => (
	<HourglassIcon size={size} />
);

export const ProcessingIndicator = ({ size = 24 }: { size?: number }) => (
	<HourglassVideoIcon size={size} />
);

export const CustomLoader = ({
	size = 32,
	format = "gif" as const,
	className = "",
}: {
	size?: number;
	format?: "gif" | "mp4";
	className?: string;
}) => (
	<HourglassAnimatedIcon className={className} format={format} size={size} />
);
