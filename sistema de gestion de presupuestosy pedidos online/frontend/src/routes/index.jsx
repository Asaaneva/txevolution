// Tu archivo de rutas actual con la nueva incorporación
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AdminLogin from "../pages/AdminLogin";
import AdminDashboard from "../pages/AdminDashboard";
import PortfolioPage from "../pages/PortfolioPage"; // 👈 1. Importamos la nueva página

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
  return isAuthenticated ? children : <Navigate to="/" replace />;
};

const PublicRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
  return !isAuthenticated ? children : <Navigate to="/dashboard" replace />;
};

export const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        {/* Ruta Pública */}
        <Route path="/" element={<PublicRoute><AdminLogin /></PublicRoute>} />

        {/* 🔒 Rutas Privadas Protegidas */}
        <Route path="/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
        
        {/* 👈 2. Añadimos el Portafolio bajo el mismo guardián */}
        <Route path="/portfolio" element={<ProtectedRoute><PortfolioPage /></ProtectedRoute>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;

