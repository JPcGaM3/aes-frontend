"use client";

import React, {
	createContext,
	useContext,
	useEffect,
	useState,
	useRef,
} from "react";
import { Spinner } from "@heroui/react";

import { ColorType } from "@/types";

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
						background: "rgba(0,0,0,0.4)",
						zIndex: 9999,
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
					}}
				>
					<div
						style={{
							background: "#fff",
							borderRadius: "1rem",
							padding: "2rem 3rem",
							boxShadow: "0 4px 24px rgba(0,0,0,0.15)",
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
						}}
					>
						<Spinner
							classNames={{ label: "text-foreground mt-4" }}
							color={colors[colorIndex] as ColorType}
							label="กำลังโหลด..."
							size="lg"
							variant="wave"
						/>
					</div>
				</div>
			)}
			{children}
		</LoadingContext.Provider>
	);
};
