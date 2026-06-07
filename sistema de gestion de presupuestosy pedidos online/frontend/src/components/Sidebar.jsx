import React from "react";
import { Link, useLocation } from "react-router-dom";

export const Sidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  // 🎨 Tu degradado y tipografía corporativa exactos
  const customSidebarStyle = {
    fontFamily: '"Google Sans", roboto, "Noto Sans Myanmar UI", "Noto Sans Khmer", arial, sans-serif',
    background: 'rgb(255, 254, 254)',
    borderRight: '1px solid rgba(0, 0, 0, 0.12)',
    
  };

  return (
    <>
      {/* 🌫️ Fondo oscuro para móviles (Cierra el menú al hacer clic fuera) */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-40 md:hidden transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* 📊 Contenedor Principal del Sidebar */}
      <aside 
        style={customSidebarStyle}
        className={`fixed top-0 bottom-0 left-0 w-64 p-4 flex flex-col justify-between z-50 transition-transform duration-300 ease-in-out  h-screen ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col gap-1">
          
          {/* Encabezado: Marca + Botón de Cierre con HOVER SUAVE */}
          <div className=" mb-6 flex items-center justify-between  pb-5"style={{borderBottom:"1px solid rgba(125, 10, 10, 0.2)"}} >
            <div className="flex items-center gap-2">
     
                <img
                      src="/logo(3).webp"
                      className="logo mb-6 w-3 h-5 object-contain"
                      style={{height:"50px"}}
                      alt="Logo"
                    />
            </div>
            
            {/* ✕ BOTÓN DE CIERRE UNIVERSAL REFACTORIZADO */}
            <button 
              type="button"
              onClick={(e) => {
                e.stopPropagation(); // Evita que el evento altere otras capas
                setIsOpen(false);   // 👈 Tu función exacta solicitada
              }}

              title="Cerrar menú"
              className="w-9 h-9 flex items-center justify-center text-red-950 text-normal hover:text-red-600 hover:bg-red-50 rounded-xl text-sm font-bold cursor-pointer transition-all duration-300 ease-in-out hover:scale-110 active:scale-95"
              style={{
                border: "1px solid rgba(148, 8, 8, 0.37)",
                backgroundColor: "rgba(255, 255, 255, 0.63)",
                fontSize: "18px",
                fontWeight: "600",
                color: "rgb(70, 15, 15)"
              }}
            >
              ✕
            </button>
          </div>

          {/* Menú de Opciones */}
          <nav className="space-y-1 flex flex-col gap-3">
            <Link
              to="/dashboard"
              onClick={() => window.innerWidth < 768 && setIsOpen(false)} 
              className={`px-4 py-2.5 rounded-xl text-xs   transition-all duration-200 flex items-center gap-2.5 cursor-pointer ${
                isActive("/dashboard")
                  ? "bg-[#642121] border border-red-500 text-white  backdrop-blur-md shadow-xs border border-red-800/80"
                  : "text-stone-700 hover:text-white hover:bg-white/10"
              }`}style={{fontFamily:"Sans,Arial,sans-serif", fontWeight:"400", fontSize:"16px"}}
              
            >
              <span className="text-sm" >📊</span> 
              <span >Panel Principal</span>
            </Link>

            <Link
              to="/portfolio"
              onClick={() => window.innerWidth < 768 && setIsOpen(false)} 
              className={`px-4 py-2.5 rounded-xl text-xs font-normal transition-all duration-200 flex items-center gap-2.5 cursor-pointer ${
                isActive("/portfolio")
                  ? "bg-[#642121] text-white backdrop-blur-md shadow-xs border border-white/10"
                  : "text-stone-700  hover:text-white hover:bg-white/10"
              }`}style={{fontFamily:"Sans,Arial,sans-serif", fontWeight:"400", fontSize:"16px"}}
            >
              <span className="text-sm">💼</span> 
              <span>Cargar Portafolio</span>
            </Link>
          </nav>
        </div>

        {/* Pie del Sidebar */}
        <div className="p-3 bg-black/20 border border-white/5 rounded-xl flex items-center justify-between backdrop-blur-xs">
          <div className="flex flex-col">
            <span className="text-[9px] text-slate-400 uppercase tracking-wider font-black">Nivel de Acceso</span>
            <span className="text-xs font-semibold text-white/90">Administrador</span>
          </div>
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        </div>
      </aside>
    </>
  );
};

export default Sidebar;