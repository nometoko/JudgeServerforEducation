// AuthContext.tsx
import React, { createContext, useContext, useState, ReactNode } from "react";

interface AuthContextProps {
  authUserName: string | null;
  authJoinedDate: string | null;
  authUserExp: string | null;
  setAuthInfo: (info: { name: string; joinedDate: string; exp: string }) => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authUserName, setAuthUserName] = useState<string | null>(null);
  const [authJoinedDate, setAuthJoinedDate] = useState<string | null>(null);
  const [authUserExp, setAuthUserExp] = useState<string | null>(null);

  const setAuthInfo = (info: { name: string; joinedDate: string; exp: string }) => {
    setAuthUserName(info.name);
    setAuthJoinedDate(info.joinedDate);
    setAuthUserExp(info.exp);
  };

  return (
    <AuthContext.Provider value={{ authUserName, authJoinedDate, authUserExp, setAuthInfo }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
