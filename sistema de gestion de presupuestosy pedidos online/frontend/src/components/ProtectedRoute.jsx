// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";

export const ProtectedRoute = () => {
  // Verificamos si el usuario realmente pasó por el Login exitosamente
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";

  if (!isAuthenticated) {
    // 🚷 Si no está autenticado, lo redirige al login reemplazando el historial
    return <Navigate to="/login" replace />;
  }

  // 🔓 Si está autenticado, renderiza las pantallas internas (Dashboard, Ventas, etc.)
  return <Outlet />;
};

export default ProtectedRoute;
