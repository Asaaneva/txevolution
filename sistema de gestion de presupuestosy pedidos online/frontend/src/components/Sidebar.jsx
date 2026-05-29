import React from "react";

export const Sidebar = ({ isOpen, setIsOpen }) => {
  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 bg-slate-950 text-white transform transition-all duration-300 ease-in-out 
        md:sticky md:top-0 md:h-screen
        ${
          isOpen
            ? "w-64 translate-x-0"
            : "-translate-x-full md:translate-x-0 md:w-0 md:overflow-hidden"
        }`}
    >
      {/* Contenido del Sidebar */}
      <div className="p-6 flex flex-col h-full w-64">
        <div className="flex items-center justify-between mb-8">
          <span className="text-lg font-bold tracking-wider text-white">
            TXevolution
          </span>
          {/* Botón para cerrar solo visible en móviles */}
          <button
            onClick={() => setIsOpen(false)}
            className="md:hidden text-slate-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        <nav className="flex flex-col gap-2 flex-1">
          <a
            href="#"
            className="px-4 py-2.5 rounded-xl bg-slate-900 text-sm font-medium text-white"
          >
            📊 Panel Principal
          </a>
          <a
            href="#"
            className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:bg-slate-900 hover:text-white transition-all"
          >
            💼 Operaciones
          </a>
          <a
            href="#"
            className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:bg-slate-900 hover:text-white transition-all"
          >
            👤 Usuarios
          </a>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
