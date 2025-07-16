"use client";

import React, {
	createContext,
	useContext,
	useState,
	useCallback,
	ReactNode,
} from "react";

import { AlertComponentProps } from "@/interfaces/props";
import AlertComponent from "@/components/AlertComponent";

interface AlertContextType {
	showAlert: (
		alert: Omit<AlertComponentProps, "isVisible" | "handleClose">
	) => void;
	hideAlert: () => void;
	isVisible: boolean;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const useAlert = (): AlertContextType => {
	const context = useContext(AlertContext);

	if (!context) {
		throw new Error("useAlert must be used within an AlertProvider");
	}

	return context;
};

interface AlertProviderProps {
	children: ReactNode;
}

export const AlertProvider: React.FC<AlertProviderProps> = ({ children }) => {
	const [alertConfig, setAlertConfig] = useState<AlertComponentProps | null>(
		null
	);

	const showAlert = useCallback(
		(alert: Omit<AlertComponentProps, "isVisible" | "handleClose">) => {
			setAlertConfig({
				...alert,
				isVisible: true,
				handleClose: () => setAlertConfig(null),
			});
		},
		[]
	);

	const hideAlert = useCallback(() => {
		setAlertConfig(null);
	}, []);

	const isVisible = alertConfig?.isVisible || false;

	return (
		<AlertContext.Provider value={{ showAlert, hideAlert, isVisible }}>
			{children}
			{alertConfig && (
				<AlertComponent
					{...alertConfig}
					handleClose={hideAlert}
					isVisible={isVisible}
				/>
			)}
		</AlertContext.Provider>
	);
};
