import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("trimurl_token") || "");
  const [userEmail, setUserEmail] = useState(() => localStorage.getItem("trimurl_email") || "");

  const login = (newToken, email) => {
    localStorage.setItem("trimurl_token", newToken);
    localStorage.setItem("trimurl_email", email);
    setToken(newToken);
    setUserEmail(email);
  };

  const logout = () => {
    localStorage.removeItem("trimurl_token");
    localStorage.removeItem("trimurl_email");
    setToken("");
    setUserEmail("");
  };

  return (
    <AuthContext.Provider value={{ token, userEmail, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
