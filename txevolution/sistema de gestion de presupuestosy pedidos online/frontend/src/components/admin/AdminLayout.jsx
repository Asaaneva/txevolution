// src/components/layouts/AdminDashboard.jsx
import React from "react";
import { Topbar } from "../Topbar";
import { Sidebar } from "../Sidebar";

export const AdminDashboard = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-stone-100/40 font-sans">
      {/* BARRA SUPERIOR */}
      <Topbar />

      {/* CUERPO: Navegación lateral + Contenido dinámico */}
      <div className="flex flex-1 pt-[60px]">
        {" "}
        {/* Altura de compensación del Topbar */}
        {/* MENÚ LATERAL */}
        <Sidebar />
        {/* ÁREA DE TRABAJO (Workspace) */}
        <main className="flex-1 p-4 md:p-6 ml-0 md:ml-64 transition-all duration-300 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
