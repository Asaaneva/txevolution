import React from "react";

export const Sidebar = () => {
  return (
    <aside className="w-64 bg-slate-950 text-slate-200 flex flex-col justify-between p-6 hidden md:flex border-r border-slate-800">
      <div className="flex flex-col gap-8">
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center font-bold text-white text-sm shadow-md">
            TX
          </div>
          <span className="font-bold tracking-tight text-lg text-white">TXevolution</span>
        </div>

        <nav className="flex flex-col gap-1.5">
          <a href="#panel" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-900 text-white font-medium text-sm transition-all border border-slate-800">
            📊 Panel Principal
          </a>
          <a href="#operaciones" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-slate-900 hover:text-slate-200 font-medium text-sm transition-all">
            💼 Operaciones
          </a>
          <a href="#usuarios" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-slate-900 hover:text-slate-200 font-medium text-sm transition-all">
            👥 Usuarios
          </a>
        </nav>
      </div>

      <button className="w-full py-2.5 px-4 rounded-xl bg-red-500/5 hover:bg-red-500/10 text-red-400 font-medium text-sm transition-all text-left flex items-center gap-3 border border-red-500/10">
        🚪 Cerrar Sesión
      </button>
    </aside>
  );
};

export default Sidebar;