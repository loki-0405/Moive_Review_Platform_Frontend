// src/context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext<{ isAuthenticated: boolean }>({ isAuthenticated: false });

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
