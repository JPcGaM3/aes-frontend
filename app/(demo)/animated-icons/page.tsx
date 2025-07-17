"use client";

import React, { useState } from "react";

import { HourglassIcon, HourglassVideoIcon } from "@/utils/animated-icons";

export default function AnimatedIconDemo() {
	const [isLoading, setIsLoading] = useState(false);

	const handleStartLoading = () => {
		setIsLoading(true);
		// Simulate a loading process
		setTimeout(() => {
			setIsLoading(false);
		}, 3000);
	};

	return (
		<div className="container px-4 py-8 mx-auto">
			<h1 className="mb-8 text-3xl font-bold">
				Animated Hourglass Icon Demo
			</h1>

			{/* Basic Examples */}
			<section className="mb-8">
				<h2 className="mb-4 text-xl font-semibold">Basic Examples</h2>
				<div className="flex items-center gap-6">
					<div className="flex items-center gap-2">
						<HourglassIcon size={20} />
						<span>Small (20px)</span>
					</div>
					<div className="flex items-center gap-2">
						<HourglassIcon size={32} />
						<span>Medium (32px)</span>
					</div>
					<div className="flex items-center gap-2">
						<HourglassIcon size={48} />
						<span>Large (48px)</span>
					</div>
				</div>
			</section>

			{/* Video Format */}
			<section className="mb-8">
				<h2 className="mb-4 text-xl font-semibold">Video Format</h2>
				<div className="flex items-center gap-6">
					<div className="flex items-center gap-2">
						<HourglassVideoIcon size={20} />
						<span>Small Video</span>
					</div>
					<div className="flex items-center gap-2">
						<HourglassVideoIcon size={32} />
						<span>Medium Video</span>
					</div>
					<div className="flex items-center gap-2">
						<HourglassVideoIcon size={48} />
						<span>Large Video</span>
					</div>
				</div>
			</section>

			{/* Interactive Example */}
			<section className="mb-8">
				<h2 className="mb-4 text-xl font-semibold">
					Interactive Example
				</h2>
				<div className="space-y-4">
					<button
						className="flex items-center gap-2 px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 disabled:opacity-50"
						disabled={isLoading}
						onClick={handleStartLoading}
					>
						{isLoading && <HourglassIcon size={16} />}
						{isLoading ? "Loading..." : "Start Loading"}
					</button>

					{isLoading && (
						<div className="flex items-center gap-2 text-gray-600">
							<HourglassVideoIcon size={20} />
							<span>Processing your request...</span>
						</div>
					)}
				</div>
			</section>

			{/* Usage Examples */}
			<section className="mb-8">
				<h2 className="mb-4 text-xl font-semibold">Common Use Cases</h2>
				<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
					{/* Loading Card */}
					<div className="p-4 border rounded-lg">
						<h3 className="mb-2 font-medium">Loading Card</h3>
						<div className="flex items-center justify-center py-8">
							<div className="text-center">
								<HourglassIcon size={32} />
								<p className="mt-2 text-sm text-gray-600">
									Loading content...
								</p>
							</div>
						</div>
					</div>

					{/* Status Indicator */}
					<div className="p-4 border rounded-lg">
						<h3 className="mb-2 font-medium">Status Indicator</h3>
						<div className="space-y-2">
							<div className="flex items-center gap-2">
								<HourglassVideoIcon size={16} />
								<span className="text-sm">Processing...</span>
							</div>
							<div className="flex items-center gap-2">
								<HourglassIcon size={16} />
								<span className="text-sm">
									Waiting for response...
								</span>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Code Examples */}
			<section>
				<h2 className="mb-4 text-xl font-semibold">Usage Examples</h2>
				<div className="space-y-4">
					<div className="p-4 bg-gray-100 rounded">
						<h3 className="mb-2 font-medium">Import the icons:</h3>
						<code className="text-sm">
							{`import { HourglassIcon, HourglassVideoIcon } from "@/utils/icons";`}
						</code>
					</div>

					<div className="p-4 bg-gray-100 rounded">
						<h3 className="mb-2 font-medium">Basic usage:</h3>
						<code className="text-sm">
							{`<HourglassIcon size={24} />
<HourglassVideoIcon size={32} />`}
						</code>
					</div>

					<div className="p-4 bg-gray-100 rounded">
						<h3 className="mb-2 font-medium">
							With custom styling:
						</h3>
						<code className="text-sm">
							{`<HourglassIcon 
  size={20} 
  className="opacity-75 hover:opacity-100" 
/>`}
						</code>
					</div>
				</div>
			</section>
		</div>
	);
}
