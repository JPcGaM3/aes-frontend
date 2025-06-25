import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

import LoginUser from "@/libs/userAPI";

interface UserContextType {
  id: number | null;
  ae_id: number | null;
  role: Array<string> | null;
  token: string | null;
}

interface AuthContextType {
  userContext: UserContextType;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [id, setId] = useState<number | null>(null);
  const [ae_id, setAeId] = useState<number | null>(null);
  const [role, setRole] = useState<Array<string> | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = sessionStorage.getItem("authUser");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);

        setId(parsed.id ?? null);
        setAeId(parsed.ae_id ?? null);
        setRole(parsed.role ?? null);
        setToken(parsed.token ?? null);
      } catch (e) {
        sessionStorage.removeItem("authUser");
      }
    }
  }, []);

  // Login API + set user context
  const login = async (username: string, password: string) => {
    try {
      const result = await LoginUser(username, password);

      setId(result.data.user_result.id || null);
      setAeId(result.data.user_result.ae_area.id || null);
      setRole(result.data.user_result.role || null);
      setToken(result.data.token || null);
    } catch (error) {
      throw error;
    }
  };

  // Logout + clear
  const logout = () => {
    setId(null);
    setAeId(null);
    setRole(null);
    setToken(null);

    sessionStorage.removeItem("authUser");
  };

  const userContext: UserContextType = {
    id: id,
    ae_id: ae_id,
    role: role,
    token: token,
  };

  useEffect(() => {
    sessionStorage.setItem("authUser", JSON.stringify(userContext));
  }, [id, ae_id, role, token]);

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
