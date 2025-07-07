"use client";

import React, {
	createContext,
	useContext,
	useState,
	useEffect,
	ReactNode,
} from "react";

import { LoginParams, LoginUser } from "@/libs/userAPI";

interface UserContextType {
	operationAreaId: string;
	token: string;
	id: number;
	role: string[];
	aeAreaId: number;
}

interface AuthContextType {
	userContext: UserContextType;
	login: ({ params }: { params: LoginParams }) => Promise<void>;
	logout: () => void;
	setUserContext: (context: Partial<UserContextType>) => void;
	isReady: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [token, setToken] = useState<string>("");
	const [id, setId] = useState<number>(NaN);
	const [role, setRole] = useState<string[]>([]);
	const [aeAreaId, setAeAreaId] = useState<number>(NaN);
	const [isReady, setIsReady] = useState<boolean>(false);

	useEffect(() => {
		const storedUser = sessionStorage.getItem("authUser");
		if (storedUser) {
			try {
				const parsed = JSON.parse(storedUser);
				setUserContext({
					token: parsed.token ?? "",
					id: parsed.id,
					role: parsed.role ?? [],
					aeAreaId: parsed.aeAreaId,
				});
			} catch {
				sessionStorage.removeItem("authUser");
			}
		}
		setIsReady(true);
	}, []);

	const userContext: UserContextType = {
		token,
		id,
		role,
		aeAreaId,
		operationAreaId: "RDC0",
	};

	useEffect(() => {
		const isValid =
			token !== "" && !isNaN(id) && !isNaN(aeAreaId) && role.length > 0;

		if (isValid) {
			sessionStorage.setItem("authUser", JSON.stringify(userContext));
		}
	}, [token, id, aeAreaId, role]);

	const setUserContext = (context: Partial<UserContextType>) => {
		if (context.token !== undefined) setToken(context.token);
		if (context.id !== undefined) setId(context.id);
		if (context.role !== undefined) setRole(context.role);
		if (context.aeAreaId !== undefined) setAeAreaId(context.aeAreaId);
	};

	const login = async ({ params }: { params: LoginParams }) => {
		try {
			const result = await LoginUser(params);

			if (result) {
				const newUserContext = {
					token: result.token ?? "",
					id: result.id,
					role: result.role,
					aeAreaId: params.ae_area_id ?? NaN,
				};

				setUserContext(newUserContext);
				sessionStorage.setItem("authUser", JSON.stringify(newUserContext));
			}
		} catch (error) {
			throw error;
		}
	};

	const logout = () => {
		const newUserContext = {
			token: "",
			id: NaN,
			role: [],
			aeAreaId: NaN,
		};

		setUserContext(newUserContext);
		sessionStorage.removeItem("authUser");
	};

	return (
		<AuthContext.Provider
			value={{ userContext, login, logout, setUserContext, isReady }}
		>
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
