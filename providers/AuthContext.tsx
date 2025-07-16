"use client";

import React, {
	createContext,
	useContext,
	useState,
	useEffect,
	useCallback,
	useMemo,
	ReactNode,
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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [token, setToken] = useState<string>("");
	const [id, setId] = useState<number>(NaN);
	const [role, setRole] = useState<string[]>([]);
	const [ae_id, setae_id] = useState<number>(NaN);
	const [isReady, setIsReady] = useState<boolean>(false);

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

	useEffect(() => {
		const storedUser = sessionStorage.getItem("authUser");

		if (storedUser) {
			try {
				const parsed = JSON.parse(storedUser);

				setUserContext({
					token: parsed.token ?? "",
					id: parsed.id,
					role: parsed.role ?? [],
					ae_id: parsed.ae_id,
				});
			} catch {
				sessionStorage.removeItem("authUser");
			}
		}
		setIsReady(true);
	}, [setUserContext]);

	useEffect(() => {
		const isValid =
			userContext.token !== "" &&
			!isNaN(userContext.id) &&
			!isNaN(userContext.ae_id) &&
			userContext.role.length > 0;

		if (isValid) {
			sessionStorage.setItem("authUser", JSON.stringify(userContext));
		} else if (sessionStorage.getItem("authUser")) {
			sessionStorage.removeItem("authUser");
		}
	}, [userContext]);

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
				}
			} catch (error) {
				throw error;
			}
		},
		[setUserContext]
	);

	const logout = useCallback(() => {
		const newUserContext = {
			token: "",
			id: NaN,
			role: [],
			ae_id: NaN,
		};

		setUserContext(newUserContext);

		sessionStorage.removeItem("authUser");
	}, [setUserContext]);

	const providerValue = useMemo(
		() => ({ userContext, login, logout, setUserContext, isReady }),
		[userContext, login, logout, setUserContext, isReady]
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
