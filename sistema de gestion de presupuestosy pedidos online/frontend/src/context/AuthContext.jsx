import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Inicia en true para revisar el LocalStorage

  useEffect(() => {
    const token = localStorage.getItem('token');
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    const userName = localStorage.getItem('userName');
    
    if (token && isAuthenticated) {
      setUser({
        name: userName,
        role: "admin" // El rol exacto que tu enrutador espera leer
      });
    }
    setLoading(false); // 👈 1. Apaga la carga inicial al revisar el navegador
  }, []);

  // 🌟 2. LA INCORPORACIÓN CRUCIAL: Esta es la función que despierta a tu enrutador
  const login = (userData) => {
    setUser({
      name: userData?.user_name || localStorage.getItem('userName') || "Administrador",
      role: "admin" 
    });
    
    setLoading(false); // 👈 3. CRUCIAL: Obliga al RoleGuard a desbloquear el Dashboard de inmediato
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

