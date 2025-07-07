"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
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
  login: ({ ...props }: LoginProps ) => Promise<void>;
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
  }, []);

  const userContext: UserContextType = {
    token,
    id,
    role,
    ae_id,
  };

  useEffect(() => {
    const isValid =
      token !== "" && !isNaN(id) && !isNaN(ae_id) && role.length > 0;

    if (isValid) {
      sessionStorage.setItem("authUser", JSON.stringify(userContext));
    }
  }, [token, id, ae_id, role]);

  const setUserContext = (context: Partial<UserContextType>) => {
    if (context.token !== undefined) setToken(context.token);
    if (context.id !== undefined) setId(context.id);
    if (context.role !== undefined) setRole(context.role);
    if (context.ae_id !== undefined) setae_id(context.ae_id);
  };

  const login = async ({ ...props } : LoginProps) => {
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
      ae_id: NaN,
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
