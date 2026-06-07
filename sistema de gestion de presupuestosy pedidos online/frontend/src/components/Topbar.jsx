import React from "react";
import ProfileDropdown from "./ProfileDropdown";

export const Topbar = ({ user, toggleSidebar }) => {
  const userName = localStorage.getItem("userName") || "Usuario";
  return (
    <header className=" bg-[#642121] backdrop-blur-md border-b border-white/10 sticky top-0 z-30 px-6 py-4 flex items-center justify-between"style={{border:"1px solid rgba(221, 221, 221, 0.64)",fontSize:"14px", fontWeight:"500"}}>
      <div className="flex items-center gap-4">
        {/* 🍔 BOTÓN DISPARADOR: Funciona en escritorio y móvil */}
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-xl border border-white hover:bg-[#fbfbfb] text-white transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#fbfbfb] md:hidden transition-colors duration-300 ease-in-out hover:bg-scale-110 active:scale-95"
          title="Alternar Menú"
        >
          ☰
        </button>

        <span className="text-base font-normal font-sans text-white tracking-medium">
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
