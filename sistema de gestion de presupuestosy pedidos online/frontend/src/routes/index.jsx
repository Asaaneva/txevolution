import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AdminLogin from "../pages/AdminLogin";
import AdminDashboard from "../pages/AdminDashboard";

// 🔒 Guardián Privado: Si no está logueado, al Login
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
  return isAuthenticated ? children : <Navigate to="/" replace />;
};

// 🔓 Guardián Público: Si YA está logueado, no lo dejes ver el Login, mándalo al Dashboard
const PublicRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
  return !isAuthenticated ? children : <Navigate to="/dashboard" replace />;
};

export const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        {/* Ruta Pública Protegida de accesos redundantes */}
        <Route 
          path="/" 
          element={
            <PublicRoute>
              <AdminLogin />
            </PublicRoute>
          } 
        />

        {/* Ruta Privada */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* 🛑 Comodín: Cualquier ruta rota redirige a la raíz */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
