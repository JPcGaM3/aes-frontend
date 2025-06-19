import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

import LoginUser from "@/libs/userAPI";

interface User {
  id: string | null;
  role: string | null;
  token: string | null;
}

interface AuthContextType {
  user: User;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User>({
    id: null,
    role: null,
    token: null,
  });

  // Load user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("authUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Save user to localStorage
  useEffect(() => {
    localStorage.setItem("authUser", JSON.stringify(user));
  }, [user]);

  // Login API + set user context
  const login = async (username: string, password: string) => {
    try {
      const result = await LoginUser(username, password);
      console.log("Login successful : ", result);

      setUser({
        id: result.id || null,
        role: result.role || null,
        token: result.data.token || null,
      });
    } catch (error) {
      throw error;
    }
  };

  // Logout + clear
  const logout = () => {
    setUser({ id: null, role: null, token: null });
    localStorage.removeItem("authUser");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
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
