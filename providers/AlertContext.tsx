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

interface AlertItem extends AlertComponentProps {
	id: string;
	isClosing?: boolean;
}

interface AlertContextType {
	showAlert: (
		alert: Omit<AlertComponentProps, "isVisible" | "handleClose">
	) => void;
	hideAlert: (id: string) => void;
	hideAllAlerts: () => void;
	alertCount: number;
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
	const [alerts, setAlerts] = useState<AlertItem[]>([]);

	const showAlert = useCallback(
		(alert: Omit<AlertComponentProps, "isVisible" | "handleClose">) => {
			const id = `alert-${Date.now()}-${Math.random()}`;
			const newAlert: AlertItem = {
				...alert,
				id,
				handleClose: () => hideAlert(id),
			};

			setAlerts((prev) => [newAlert, ...prev]);
		},
		[]
	);

	const hideAlert = useCallback((id: string) => {
		setAlerts((prev) => prev.filter((alert) => alert.id !== id));
	}, []);

	const hideAllAlerts = useCallback(() => {
		setAlerts((prev) =>
			prev.map((alert) => ({
				...alert,
				isClosing: true,
			}))
		);

		setTimeout(() => {
			setAlerts([]);
		}, 300);
	}, []);

	const alertCount = alerts.length;

	const visibleAlerts = alerts.slice(0, 3);

	return (
		<AlertContext.Provider
			value={{ showAlert, hideAlert, hideAllAlerts, alertCount }}
		>
			{children}
			{visibleAlerts.map((alert, index) => (
				<AlertComponent
					key={alert.id}
					{...alert}
					handleClose={() => hideAlert(alert.id)}
					hideAllAlerts={hideAllAlerts}
					stackIndex={index}
					totalAlerts={alertCount}
				/>
			))}
		</AlertContext.Provider>
	);
};
