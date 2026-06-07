// src/components/Header.jsx
import React from "react";

export const Header = () => {
  return (
      <header
        className="w-full bg-[linear-gradient(109deg,rgba(255,255,255,0.7),rgba(60,18,16,0.7),rgba(88,23,23,0.7))] backdrop-blur-md top-0 z-50 px-6 py-4 transition-all duration-300 border-b border-red-500/80 shadow-[0_4px_20px_rgba(239,68,68,0.4)] "
        
      >
        <div className="max-w-[1400px] mx-auto flex items-center justify-between w-full">
          <div className="flex items-center gap-2.5">

          <img
                src="/logo(3).webp"
                className="logo mb-6 w-16 h-12 object-contain"
                alt="Logo"
              />
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
