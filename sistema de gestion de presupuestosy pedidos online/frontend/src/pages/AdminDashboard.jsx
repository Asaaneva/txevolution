import React, { useState } from "react";
import { Sidebar } from "../components/Sidebar";
import { Topbar } from "../components/Topbar";

// Importamos las UI reutilizables
import { Card } from "../components/ui/Card";

// Un subcomponente micro que solo se usa aquí se puede quedar
const MetricCard = ({ title, value, change }) => (
  <Card className="hover:border-slate-300 transition-all duration-200">
    <div className="flex flex-col gap-2">
      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
        {title}
      </span>
      <div className="flex items-baseline justify-between">
        <span className="text-3xl font-bold text-slate-900 tracking-tight">
          {value}
        </span>
        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100">
          {change}
        </span>
      </div>
    </div>
  </Card>
);

export const AdminDashboard = () => {
  const currentUser = {
    name: "Vanessa Rodriguez",
    email: "vanessa@txevolution.com",
    initials: "VR",
  };
  const [dataRows] = useState([
    {
      id: "TX-901",
      client: "Distribuidora Alfa",
      type: "Presupuesto",
      date: "28 Mayo, 2026",
      amount: "$450.00",
      status: "Aprobado",
    },
  ]);

  return (
    <div className="min-h-screen bg-slate-50/60 flex font-sans antialiased text-slate-800">
      {/* El Sidebar independiente */}
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        {/* El Topbar/Header independiente */}
        <Topbar user={currentUser} />

        {/* El Main content */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-[1400px] w-full mx-auto flex flex-col gap-8">
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <MetricCard
              title="Proyectos Activos"
              value="12"
              change="+2 este mes"
            />
          </section>

          <section className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            {/* Aquí va tu tabla principal de datos */}
            <div className="p-6">
              <h2 className="text-sm font-bold text-slate-900">
                Historial de Operaciones
              </h2>
              {/* Estructura de la tabla... */}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};
export default AdminDashboard;
