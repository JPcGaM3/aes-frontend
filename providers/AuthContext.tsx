"use client";

import React, {
	createContext,
	useContext,
	useState,
	useEffect,
	useCallback,
	useMemo,
	ReactNode,
	useRef,
} from "react";

import { LoginProps, LoginUser } from "@/libs/userAPI";

interface UserContextType {
	token: string;
	id: number;
	role: string[];
	ae_id: number;
}

interface AuthContextType {
	userContext: UserContextType;
	login: ({ ...props }: LoginProps) => Promise<void>;
	logout: () => void;
	setUserContext: (context: Partial<UserContextType>) => void;
	isReady: boolean;
	sessionTimeLeft: number;
	isSessionExpired: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [token, setToken] = useState<string>("");
	const [id, setId] = useState<number>(NaN);
	const [role, setRole] = useState<string[]>([]);
	const [ae_id, setae_id] = useState<number>(NaN);
	const [isReady, setIsReady] = useState<boolean>(false);
	const [sessionTimeLeft, setSessionTimeLeft] = useState<number>(0);
	const [isSessionExpired, setIsSessionExpired] = useState<boolean>(false);
	const timerRef = useRef<NodeJS.Timeout | null>(null);
	const sessionDuration = 59 * 60 + 59;

	const userContext: UserContextType = useMemo(
		() => ({
			token,
			id,
			role,
			ae_id,
		}),
		[token, id, role, ae_id]
	);

	const setUserContext = useCallback((context: Partial<UserContextType>) => {
		if (context.token !== undefined) setToken(context.token);
		if (context.id !== undefined) setId(context.id);
		if (context.role !== undefined) setRole(context.role);
		if (context.ae_id !== undefined) setae_id(context.ae_id);
	}, []);

	const calculateTimeLeft = useCallback((expirationTime: number): number => {
		const currentTime = Date.now();
		const timeLeft = Math.max(
			0,
			Math.floor((expirationTime - currentTime) / 1000)
		);

		return timeLeft;
	}, []);

	const startSessionTimer = useCallback(
		(expirationTime?: number) => {
			if (timerRef.current) {
				clearInterval(timerRef.current);
			}

			const expTime =
				expirationTime || Date.now() + sessionDuration * 1000;

			sessionStorage.setItem("sessionExpireTime", expTime.toString());

			const updateTimer = () => {
				const timeLeft = calculateTimeLeft(expTime);

				setSessionTimeLeft(timeLeft);

				if (timeLeft <= 0) {
					setIsSessionExpired(true);
					sessionStorage.removeItem("authUser");
					sessionStorage.removeItem("sessionExpireTime");
					if (timerRef.current) {
						clearInterval(timerRef.current);
						timerRef.current = null;
					}
				}
			};

			// Initial update
			updateTimer();
			setIsSessionExpired(false);

			timerRef.current = setInterval(updateTimer, 1000);
		},
		[sessionDuration, calculateTimeLeft]
	);

	const stopSessionTimer = useCallback(() => {
		if (timerRef.current) {
			clearInterval(timerRef.current);
			timerRef.current = null;
		}
		setSessionTimeLeft(0);
		setIsSessionExpired(false);
		sessionStorage.removeItem("sessionExpireTime");
	}, []);

	useEffect(() => {
		const storedUser = sessionStorage.getItem("authUser");
		const storedExpireTime = sessionStorage.getItem("sessionExpireTime");

		if (storedUser && storedExpireTime) {
			try {
				const parsed = JSON.parse(storedUser);
				const expirationTime = parseInt(storedExpireTime);
				const currentTime = Date.now();

				if (currentTime < expirationTime) {
					setUserContext({
						token: parsed.token ?? "",
						id: parsed.id,
						role: parsed.role ?? [],
						ae_id: parsed.ae_id,
					});

					startSessionTimer(expirationTime);
				} else {
					sessionStorage.removeItem("authUser");
					sessionStorage.removeItem("sessionExpireTime");
					setIsSessionExpired(true);
				}
			} catch {
				sessionStorage.removeItem("authUser");
				sessionStorage.removeItem("sessionExpireTime");
			}
		}
		setIsReady(true);
	}, [setUserContext, startSessionTimer]);

	useEffect(() => {
		const isValid =
			userContext.token !== "" &&
			!isNaN(userContext.id) &&
			!isNaN(userContext.ae_id) &&
			userContext.role.length > 0;

		if (isValid && !isSessionExpired) {
			sessionStorage.setItem("authUser", JSON.stringify(userContext));
		}
	}, [userContext, isSessionExpired]);

	const login = useCallback(
		async ({ ...props }: LoginProps) => {
			try {
				const result = await LoginUser(props);

				if (result) {
					const newUserContext = {
						token: result.token ?? "",
						id: result.id,
						role: result.role,
						ae_id: props.params.ae_id ?? NaN,
					};

					setUserContext(newUserContext);
					sessionStorage.setItem(
						"authUser",
						JSON.stringify(newUserContext)
					);

					startSessionTimer();
				}
			} catch (error) {
				throw error;
			}
		},
		[setUserContext, startSessionTimer]
	);

	const logout = useCallback(() => {
		const newUserContext = {
			token: "",
			id: NaN,
			role: [],
			ae_id: NaN,
		};

		setUserContext(newUserContext);
		stopSessionTimer();

		sessionStorage.removeItem("authUser");
		sessionStorage.removeItem("sessionExpireTime");
	}, [setUserContext, stopSessionTimer]);

	useEffect(() => {
		return () => {
			if (timerRef.current) {
				clearInterval(timerRef.current);
			}
		};
	}, []);

	const providerValue = useMemo(
		() => ({
			userContext,
			login,
			logout,
			setUserContext,
			isReady,
			sessionTimeLeft,
			isSessionExpired,
		}),
		[
			userContext,
			login,
			logout,
			setUserContext,
			isReady,
			sessionTimeLeft,
			isSessionExpired,
		]
	);

	return (
		<AuthContext.Provider value={providerValue}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	const context = useContext(AuthContext);

	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}

	return context;
};
