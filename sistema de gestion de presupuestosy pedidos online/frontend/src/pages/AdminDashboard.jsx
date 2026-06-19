import React, { useState } from "react";
import { Outlet } from "react-router-dom"; // 🔥 El motor de intercambio de vistas
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar"; // 📊 Tu Topbar original recuperado

export const AdminDashboard = () => {
  // Estado para abrir/cerrar el Sidebar en pantallas de teléfonos
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Objeto de usuario para tu Topbar corporativo
  const currentUser = {
    name: "Vanessa Rodriguez",
    email: "vanessa@txevolution.com",
    initials: "VR",
  };

  return (
    <div className="w-full min-h-screen bg-slate-50/60 flex font-sans antialiased text-slate-800 overflow-hidden relative">
      {/* Fondo oscuro (Backdrop) que se activa al abrir el menú en móviles */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 z-40 md:hidden transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* 🧭 Menú lateral estable */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* Contenedor del contenido principal (Topbar + Vistas) */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* 🔝 Tu barra superior con los datos del usuario e interactividad */}
        <Topbar
          user={currentUser}
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />

        {/* 🚀 ESPACIO DINÁMICO DE TRABAJO */}
        {/* El 'overflow-y-auto' aquí evita que el formulario de la vitrina rompa el layout */}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto min-w-0 w-full mx-auto">
          <div className="max-w-6xl mx-auto w-full">
            {/* 🎯 Aquí React Router inyectará de forma fluida tus métricas 
                o el formulario de PortfolioPage según el menú seleccionado */}
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
