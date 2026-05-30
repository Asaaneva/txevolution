// src/components/Header.jsx
import React from "react";

export const Header = () => {
  return (
    <header className="w-full bg-white/70 backdrop-blur-md border-b border-slate-200/60 sticky top-0 z-50 px-6 py-4 transition-all duration-300">
      <div className="max-w-[1400px] mx-auto flex items-center justify-between w-full">
        {/* Isotipo de la Marca */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-slate-950 flex items-center justify-center text-white font-black text-sm tracking-wider select-none shadow-sm">
            TX
          </div>
          <span className="text-sm font-bold text-slate-900 tracking-tight select-none">
            TXevolution
          </span>
        </div>

        {/* Indicador sutil de Estado de Red / Entorno */}
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider select-none">
            Sistema Activo
          </span>
        </div>
      </div>
    </header>
  );
};
