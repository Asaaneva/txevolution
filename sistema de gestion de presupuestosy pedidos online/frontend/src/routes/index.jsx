import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom"; // 👈 Quitamos BrowserRouter / Router
import { AuthContext } from "../context/AuthContext";
import AdminLogin from "../pages/AdminLogin";
import AdminDashboard from "../pages/AdminDashboard";
import { PortfolioPage } from "../pages/PortfolioPage";

// 🛡️ EL CENTINELA: Protector de rutas síncrono
const RoleGuard = ({ allowedRoles, children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading)
    return (
      <div className="p-10 text-center font-sans text-slate-500">
        Validando credenciales...
      </div>
    );
  if (!user) return <Navigate to="/" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export const AppRoutes = () => {
  return (
    // 🌟 REGLA DE ORO: Solo usamos <Routes>, quitamos la etiqueta <Router> de aquí
    <Routes>
      {/* Ruta Pública */}
      <Route path="/" element={<AdminLogin />} />

      {/* 🔒 Rutas Privadas Protegidas y Anidadas */}
      <Route
        path="/dashboard"
        element={
          <RoleGuard allowedRoles={["admin"]}>
            <AdminDashboard />
          </RoleGuard>
        }
      >
        {/* 📊 Subruta por defecto original (Historial de Operaciones) */}
        <Route
          index
          element={
            <div className="p-6 space-y-6">
              <section className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 animate-fadeIn">
                <h2 className="text-sm font-bold text-slate-900">
                  Historial de Operaciones
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Aquí se renderizará tu tabla de datos de TXevolution.
                </p>
              </section>
            </div>
          }
        />

        {/* 📁 Subruta del catálogo */}
        <Route path="gestionar-vitrina" element={<PortfolioPage />} />
      </Route>

      {/* Comodín de redirección global */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
