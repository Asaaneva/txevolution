// src/components/Footer.jsx
import React from "react";

export const Footer = () => {
  return (
    <footer className="w-full bg-[linear-gradient(109deg,rgba(255,255,255,0.7),rgba(60,18,16,0.7),rgba(88,23,23,0.7))] border-t border-red-500/80 shadow-[0_4px_20px_rgba(239,68,68,0.4)]  backdrop-blur-md py-6 text-center">
     <img
            src="/logo(3).webp"
            className="logo m-r w-16 h-12 object-contain"
            alt="Logo"
          />
     <div className="max-w-[1400px] mx-auto flex items-center text-center w-full">
        <div className="flex items-center gap-2.5">

          

          <div>
            &copy; {new Date().getFullYear()} {" "}
            <span className="font-bold text-slate-600">TXevolution</span>. Todos
            los derechos reservados.
          </div>
        </div>

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
