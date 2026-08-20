import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
    const userName = localStorage.getItem("userName");

    if (token && isAuthenticated) {
      setUser({ name: userName, role: "admin" });
    }
    setLoading(false);
  }, []);

  // 🌟 Esta función es la que despierta al enrutador al hacer login
  const login = (serverData) => {
    setUser({
      name: serverData?.user_name || "Administrador",
      role: "admin", // El string exacto que tu allowedRoles=["admin"] necesita validar
    });
    setLoading(false); // 👈 CRUCIAL: Apaga el loading para que el Centinela te deje pasar de inmediato
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
