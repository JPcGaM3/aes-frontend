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

	const startSessionTimer = useCallback(() => {
		if (timerRef.current) {
			clearInterval(timerRef.current);
		}

		setSessionTimeLeft(sessionDuration);
		setIsSessionExpired(false);

		timerRef.current = setInterval(() => {
			setSessionTimeLeft((prev) => {
				if (prev <= 1) {
					setIsSessionExpired(true);
					if (timerRef.current) {
						clearInterval(timerRef.current);
					}

					return 0;
				}

				return prev - 1;
			});
		}, 1000);
	}, [sessionDuration]);

	const stopSessionTimer = useCallback(() => {
		if (timerRef.current) {
			clearInterval(timerRef.current);
			timerRef.current = null;
		}
		setSessionTimeLeft(0);
		setIsSessionExpired(false);
	}, []);

	useEffect(() => {
		const storedUser = sessionStorage.getItem("authUser");
		const storedLoginTime = sessionStorage.getItem("loginTime");

		if (storedUser && storedLoginTime) {
			try {
				const parsed = JSON.parse(storedUser);
				const loginTime = parseInt(storedLoginTime);
				const currentTime = Date.now();
				const elapsed = Math.floor((currentTime - loginTime) / 1000);

				if (elapsed < sessionDuration) {
					setUserContext({
						token: parsed.token ?? "",
						id: parsed.id,
						role: parsed.role ?? [],
						ae_id: parsed.ae_id,
					});

					const remainingTime = sessionDuration - elapsed;

					setSessionTimeLeft(remainingTime);

					timerRef.current = setInterval(() => {
						setSessionTimeLeft((prev) => {
							if (prev <= 1) {
								setIsSessionExpired(true);

								sessionStorage.removeItem("authUser");
								sessionStorage.removeItem("loginTime");
								if (timerRef.current) {
									clearInterval(timerRef.current);
									timerRef.current = null;
								}

								return 0;
							}

							return prev - 1;
						});
					}, 1000);
				} else {
					sessionStorage.removeItem("authUser");
					sessionStorage.removeItem("loginTime");
					setIsSessionExpired(true);
				}
			} catch {
				sessionStorage.removeItem("authUser");
				sessionStorage.removeItem("loginTime");
			}
		}
		setIsReady(true);
	}, [setUserContext, sessionDuration]);

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
					sessionStorage.setItem("loginTime", Date.now().toString());
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
		sessionStorage.removeItem("loginTime");
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
