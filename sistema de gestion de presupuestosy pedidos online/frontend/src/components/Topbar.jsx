import React from "react";

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
      {/* Visualización del Perfil en la esquina derecha */}
      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-xs font-bold text-slate-800">{userName}</p>
          <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">
            Admin
          </p>
        </div>
        {/* Avatar Geométrico */}
        <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold uppercase">
          {userName.substring(0, 2)}
        </div>
      </div>
    </header>
  );
};

export default Topbar;
