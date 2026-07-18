import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import AdminLogin from "../pages/AdminLogin";
import AdminDashboard from "../pages/AdminDashboard";
import { PortfolioPage } from "../pages/PortfolioPage";
import { Card } from "../components/ui/Card"; // Mantenemos tu Card original

// 🛡️ EL CENTINELA: Protector de rutas que lee el rol desde la memoria global
const RoleGuard = ({ allowedRoles, children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div className="text-center p-10 font-sans text-slate-500">Validando credenciales...</div>;
  if (!user) return <Navigate to="/" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        {/* Ruta Pública */}
        <Route path="/" element={<AdminLogin />} />

        {/* 🔒 Rutas Privadas Protegidas por Rol */}
        <Route 
          path="/dashboard" 
          element={
            <RoleGuard allowedRoles={["admin"]}>
              <AdminDashboard />
            </RoleGuard>
          }
        >
          {/* 📊 Tu subruta por defecto original (Historial de Operaciones) */}
          <Route
            index
            element={
              <>
                <section className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden animate-fadeIn p-6">
                  <h2 className="text-sm font-bold text-slate-900">
                    Historial de Operaciones
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Aquí se renderizará tu tabla de datos de TXevolution.
                  </p>
                </section>
              </>
            }
          />

          {/* 📁 Tu subruta del catálogo original */}
          <Route path="gestionar-vitrina" element={<PortfolioPage />} />
        </Route>

        {/* Comodín de redirección */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;



