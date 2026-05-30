import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  // Verificamos si existe el token de autenticación en el navegador
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";

  if (!isAuthenticated) {
    // Si no está autenticado, lo redirige al login de inmediato
    return <Navigate to="/" replace />;
  }

  // Si está autenticado, renderiza el componente hijo (el Dashboard)
  return children;
};

export default ProtectedRoute;
