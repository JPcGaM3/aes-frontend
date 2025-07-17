"use client";

import clsx from "clsx";
import { useState } from "react";
import { Button } from "@heroui/button";

import { fontMono } from "@/config/fonts";

export default function TestErrorPage() {
	const [shouldError, setShouldError] = useState(false);
	const [shouldReferenceError, setShouldReferenceError] = useState(false);

	if (shouldError) {
		throw new Error(
			"This is a test error to demonstrate the error page!, This is a test error to demonstrate the error page!, This is a test error to demonstrate the error page!, This is a test error to demonstrate the error page!"
		);
	}

	if (shouldReferenceError) {
		// @ts-ignore - intentionally causing an error
		nonExistentFunction();
	}

	const triggerError = () => {
		setShouldError(true);
	};

	const triggerReferenceError = () => {
		setShouldReferenceError(true);
	};

	const triggerAsyncError = () => {
		setTimeout(() => {
			throw new Error(
				"Async error - this won't be caught by error boundary"
			);
		}, 100);
	};

	return (
		<div
			className={clsx(
				"flex flex-col items-center justify-center max-w-xl p-8 space-y-8 font-mono tracking-tight",
				fontMono.variable
			)}
		>
			<h1 className="mb-6 text-5xl font-bold">Test Error Page</h1>

			<div className="space-y-4">
				<Button
					className="w-full"
					color="danger"
					radius="sm"
					onPress={triggerError}
				>
					Trigger Custom Error (Render)
				</Button>

				<Button
					className="w-full"
					color="danger"
					radius="sm"
					variant="flat"
					onPress={triggerReferenceError}
				>
					Trigger Reference Error (Render)
				</Button>

				<Button
					className="w-full"
					color="danger"
					radius="sm"
					variant="bordered"
					onPress={triggerAsyncError}
				>
					Trigger Async Error (Won&apos;t be caught)
				</Button>
			</div>
		</div>
	);
}
