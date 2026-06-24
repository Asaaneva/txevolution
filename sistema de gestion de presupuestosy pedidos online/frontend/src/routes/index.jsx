import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import AdminLogin from "../pages/AdminLogin";
import AdminDashboard from "../pages/AdminDashboard";
import { PortfolioPage } from "../pages/PortfolioPage"; // 🔥 Tu página de siempre (con el código modular adentro)
import { Card } from "../components/ui/Card"; // Para las métricas en línea

export const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        {/* Ruta Pública */}
        <Route path="/" element={<AdminLogin />} />

        {/* 🔒 Rutas Privadas Anidadas */}
        <Route path="/dashboard" element={<AdminDashboard />}>
          {/* 📊 Subruta por defecto: Renderizamos las métricas directamente aquí 
              para que no tengas que crear el archivo InicioAdmin.jsx */}
          <Route
            index
            element={
              <>
                <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 animate-fadeIn">
                  <Card className="hover:border-slate-300 transition-all duration-200">
                    <div className="flex flex-col gap-2">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        Proyectos Activos
                      </span>
                      <div className="flex items-baseline justify-between">
                        <span className="text-3xl font-bold text-slate-900 tracking-tight">
                          12
                        </span>
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100">
                          +2 este mes
                        </span>
                      </div>
                    </div>
                  </Card>
                </section>

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

          {/* 📁 Subruta del catálogo: Reutiliza tu PortfolioPage antigua */}
          <Route path="gestionar-vitrina" element={<PortfolioPage />} />
        </Route>

        {/* Comodín */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
