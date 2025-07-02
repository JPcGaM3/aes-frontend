import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

import { LoginParams, LoginUser } from "@/libs/userAPI";

interface UserContextType {
  token: string;
  operationAreaId: number;
}

interface AuthContextType {
  userContext: UserContextType;
  login: ({
    params,
    operationAreaId,
  }: {
    params: LoginParams;
    operationAreaId: number;
  }) => Promise<void>;
  logout: () => void;
  setUserContext: (context: Partial<UserContextType>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string>("");
  const [operationAreaId, setOperationAreaId] = useState<number>(0);

  useEffect(() => {
    const loadUser = async () => {
      const storedUser = sessionStorage.getItem("authUser");
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          await setToken(parsed.token ?? "");
          await setOperationAreaId(parsed.operationAreaId ?? 0);
        } catch (e) {
          sessionStorage.removeItem("authUser");
        }
      }
    };

    loadUser();
  }, []);

  // Login API + set user context
  const login = async ({
    params,
    operationAreaId,
  }: {
    params: LoginParams;
    operationAreaId: number;
  }) => {
    try {
      const result = await LoginUser(params);
      setToken(result.token ?? null);
      setOperationAreaId(operationAreaId);
    } catch (error) {
      throw error;
    }
  };

  // Logout + clear
  const logout = () => {
    setToken("");
    setOperationAreaId(0);

    sessionStorage.removeItem("authUser");
  };

  const setUserContext = (context: Partial<UserContextType>) => {
    if (context.token !== undefined) setToken(context.token);
    if (context.operationAreaId !== undefined)
      setOperationAreaId(context.operationAreaId);
  };

  const userContext: UserContextType = {
    token: token,
    operationAreaId: operationAreaId,
  };

  useEffect(() => {
    sessionStorage.setItem("authUser", JSON.stringify(userContext));
  }, [token, operationAreaId]);

  return (
    <AuthContext.Provider value={{ userContext, login, logout, setUserContext }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
