"use client";

import React, {
	createContext,
	useContext,
	useEffect,
	useState,
	useRef,
} from "react";
import { Spinner } from "@heroui/react";
import clsx from "clsx";

import { ColorType } from "@/types";
import { fontMono } from "@/config/fonts";

interface LoadingContextType {
	isLoading: boolean;
	showLoading: (delay?: number) => void;
	hideLoading: () => void;
}

const LoadingContext = createContext<LoadingContextType>({
	isLoading: false,
	showLoading: () => {},
	hideLoading: () => {},
});

export const useLoading = () => useContext(LoadingContext);

export const LoadingProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isDebouncing, setIsDebouncing] = useState<boolean>(false);
	const [colorIndex, setColorIndex] = useState<number>(0);

	const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
	const colorIntervalRef = useRef<NodeJS.Timeout | null>(null);

	const colors: ColorType[] = [
		"primary",
		"secondary",
		"success",
		"warning",
		"danger",
	];

	const showLoading = (delay: number = 300) => {
		if (debounceTimerRef.current) {
			clearTimeout(debounceTimerRef.current);
			debounceTimerRef.current = null;
		}

		setIsDebouncing(true);
		debounceTimerRef.current = setTimeout(() => {
			setIsLoading(true);
			setIsDebouncing(false);
		}, delay);
	};

	const hideLoading = () => {
		if (debounceTimerRef.current) {
			clearTimeout(debounceTimerRef.current);
			debounceTimerRef.current = null;
		}
		setIsLoading(false);
		setIsDebouncing(false);
	};

	useEffect(() => {
		if (isLoading) {
			if (colorIntervalRef.current) {
				clearInterval(colorIntervalRef.current);
			}
			colorIntervalRef.current = setInterval(() => {
				setColorIndex((prevIndex) => (prevIndex + 1) % colors.length);
			}, 300);
		} else {
			if (colorIntervalRef.current) {
				clearInterval(colorIntervalRef.current);
				colorIntervalRef.current = null;
			}
			setColorIndex(0);
		}

		return () => {
			if (colorIntervalRef.current) {
				clearInterval(colorIntervalRef.current);
			}
		};
	}, [isLoading, colors.length]);

	useEffect(() => {
		return () => {
			if (debounceTimerRef.current) {
				clearTimeout(debounceTimerRef.current);
			}
		};
	}, []);

	return (
		<LoadingContext.Provider
			value={{ isLoading, showLoading, hideLoading }}
		>
			{(isLoading || isDebouncing) && (
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
							background: "rgba(255,255,255,1)",
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
