// src/components/Footer.jsx
import React from "react";

export const Footer = () => {
  return (
    <footer className="w-full py-5 px-6 border-t border-slate-200/50 bg-white/40 mt-auto">
      <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] font-medium text-slate-400 tracking-wide select-none">
        {/* Copyright */}
        <div>
          &copy; {new Date().getFullYear()}{" "}
          <span className="font-bold text-slate-600">TXevolution</span>. Todos
          los derechos reservados.
        </div>

        {/* Versión e Indicador Industrial */}
        <div className="flex items-center gap-4">
          <span className="hover:text-slate-600 transition-colors cursor-help">
            Términos de Seguridad
          </span>
          <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono font-bold">
            v1.0.0-stable
          </span>
        </div>
      </div>
    </footer>
  );
};
