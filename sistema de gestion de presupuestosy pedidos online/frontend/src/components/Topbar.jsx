import React from "react";
import ProfileDropdown from "./ProfileDropdown";

export const Topbar = ({ user, toggleSidebar }) => {
  const userName = localStorage.getItem("userName") || "Usuario";
  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-30 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        {/* 🍔 BOTÓN DISPARADOR: Funciona en escritorio y móvil */}
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
          title="Alternar Menú"
        >
          ☰
        </button>

        <span className="text-xs font-semibold text-slate-400 tracking-medium">
          Ruta / <span className="text-slate-600 font-bold">Dashboard</span>
        </span>
      </div>

      {/* Bloque del perfil del usuario (Derecha) */}
      <div className="flex items-center gap-4">
        {/* Aquí puedes meter notificaciones más adelante si deseas */}

        {/* 👈 Inyectamos el dropdown modular e interactivo */}
        <ProfileDropdown />
      </div>
    </header>
  );
};

export default Topbar;
