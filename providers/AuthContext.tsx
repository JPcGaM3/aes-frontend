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
}

interface AuthContextType {
  userContext: UserContextType;
  login: ({ params }: { params: LoginParams }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string>("");

  useEffect(() => {
    const loadUser = async () => {
      const storedUser = sessionStorage.getItem("authUser");
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          await setToken(parsed.token ?? "");
        } catch (e) {
          sessionStorage.removeItem("authUser");
        }
      }
    };

    loadUser();
  }, []);

  // Login API + set user context
  const login = async ({ params }: { params: LoginParams }) => {
    try {
      const result = await LoginUser(params);
      setToken(result.token ?? null);
    } catch (error) {
      throw error;
    }
  };

  // Logout + clear
  const logout = () => {
    setToken("");

    sessionStorage.removeItem("authUser");
  };

  const userContext: UserContextType = {
    token: token,
  };

  useEffect(() => {
    sessionStorage.setItem("authUser", JSON.stringify(userContext));
  }, [token]);

  return (
    <AuthContext.Provider value={{ userContext, login, logout }}>
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
