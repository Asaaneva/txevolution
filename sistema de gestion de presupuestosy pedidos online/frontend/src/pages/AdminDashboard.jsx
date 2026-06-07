import React, { useState } from "react";
import Sidebar from "../components/Sidebar"; // Asegúrate de quitar las llaves si es export default
import Topbar from "../components/Topbar";
import { Card } from "../components/ui/Card";

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
  // 🧭 ESTADO CLAVE: Controla si el menú está abierto o cerrado
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const currentUser = {
    name: "Vanessa Rodriguez",
    email: "vanessa@txevolution.com",
    initials: "VR",
  };

  return (
    <div className="min-h-screen bg-[#f4f4f4] flex font-sans antialiased text-slate-800 relative overflow-x-hidden">
      {/* 1. Fondo oscuro/Backdrop para cerrar el menú en móviles */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 z-40 md:hidden transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* 2. El Sidebar: Le pasamos el estado y la función para cerrarlo */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* 3. Contenedor del contenido principal */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* El Topbar: Le pasamos la función para alternar (abrir/cerrar) */}
        <Topbar
          user={currentUser}
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />

        <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-[1400px] w-full mx-auto flex flex-col gap-8">
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <MetricCard
              title="Proyectos Activos"
              value="12"
              change="+2 este mes"
            />
          </section>

          <section className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="p-6">
              <h2 className="text-sm font-bold text-slate-900">
                Historial de Operaciones
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Aquí se renderizará tu tabla de datos de TXevolution.
              </p>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
