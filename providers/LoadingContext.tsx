"use client";

import React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { Spinner } from "@heroui/react";
import clsx from "clsx";

import { ColorType } from "@/types";
import { fontMono } from "@/config/fonts";

interface LoadingContextType {
	isLoading: boolean;
	setIsLoading: (loading: boolean) => void;
}

const LoadingContext = createContext<LoadingContextType>({
	isLoading: false,
	setIsLoading: () => {},
});

export const useLoading = () => useContext(LoadingContext);

export const LoadingProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [colorIndex, setColorIndex] = useState<number>(0);

	const colors = ["primary", "secondary", "success", "warning", "danger"];

	useEffect(() => {
		if (!isLoading) return;

		const intervalId = setInterval(() => {
			setColorIndex((prevIndex) => (prevIndex + 1) % colors.length);
		}, 300);

		return () => clearInterval(intervalId);
	}, [isLoading]);

	return (
		<LoadingContext.Provider value={{ isLoading, setIsLoading }}>
			{isLoading && (
				<div
					style={{
						position: "fixed",
						top: 0,
						left: 0,
						width: "100vw",
						height: "100vh",
						background: "rgba(0,0,0,0.5)",
						backdropFilter: "blur(4px)",
						zIndex: 9999,
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
					}}
				>
					<div
						style={{
							background: "rgba(255,255,255,0.85)",
							borderRadius: "0.5rem",
							padding: "2rem 2.5rem",
							boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
							justifyContent: "center",
							gap: "1.5rem",
							minWidth: "120px",
						}}
					>
						<div
							style={{
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
							}}
						>
							<Spinner
								classNames={{
									wrapper: "w-16 h-16 gap-3 translate-y-1/2",
									dots: "w-3 h-3",
								}}
								color={
									colors[colorIndex as number] as ColorType
								}
								size="lg"
								variant="wave"
							/>
						</div>

						<p
							className={clsx(
								"font-mono text-md font-medium tracking-wide text-foreground opacity-60",
								fontMono.variable
							)}
						>
							Loading...
						</p>
					</div>
				</div>
			)}
			{children}
		</LoadingContext.Provider>
	);
};
