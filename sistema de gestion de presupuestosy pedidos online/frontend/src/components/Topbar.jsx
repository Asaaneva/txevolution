import React from "react";

export const Topbar = ({ user, toggleSidebar }) => {
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
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex flex-col text-right">
          <span className="text-xs font-bold text-slate-800">{user.name}</span>
          <span className="text-[10px] text-slate-400 font-medium">
            {user.email}
          </span>
        </div>
        <div className="w-8 h-8 rounded-xl bg-slate-100 border border-slate-200/60 flex items-center justify-center text-xs font-bold text-slate-600 shadow-sm">
          {user.initials}
        </div>
      </div>
    </header>
  );
};

export default Topbar;
