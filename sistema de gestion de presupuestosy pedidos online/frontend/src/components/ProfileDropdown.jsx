// src/components/layout/ProfileDropdown.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export const ProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const userName = localStorage.getItem("userName") || "Vanessa Rodriguez";
  const userInitials = userName.substring(0, 2).toUpperCase();

  // 🚪 Lógica de Cierre de Sesión Blindada
  const handleLogout = (e) => {
    // Detenemos cualquier evento que intente cerrar el menú antes de tiempo
    e.preventDefault();
    e.stopPropagation();

    // Limpieza absoluta del almacenamiento
    localStorage.removeItem("token");
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userName");

    setIsOpen(false);

    // Redirección quirúrgica al Login
    navigate("/login");
  };

  // 🛡️ Manejador de clics externos refinado
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Botón del Avatar */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 focus:outline-none group select-none cursor-pointer"
        aria-expanded={isOpen}
      >
        <div
          className={`w-9 h-9 rounded-full bg-slate-950 text-white text-xs font-bold tracking-wider flex items-center justify-center border-2 transition-all duration-200 
          ${
            isOpen
              ? "border-slate-950 ring-4 ring-slate-100"
              : "border-transparent group-hover:border-slate-300"
          }`}
        >
          {userInitials}
        </div>
      </button>

      {/* Menú Desplegable */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl border border-slate-200/80 shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-200">
          {/* Info del Usuario */}
          <div className="px-4 py-2.5 border-b border-slate-100 select-none">
            <p className="text-xs font-bold text-slate-800 truncate">
              {userName}
            </p>
            <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider mt-0.5">
              Administrador
            </p>
          </div>

          {/* Opciones */}
          <div className="p-1 flex flex-col gap-0.5">
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                alert("Ir a mi perfil...");
              }}
              className="w-full text-left px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
            >
              👤 Mi Perfil
            </button>
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                alert("Ir a configuración...");
              }}
              className="w-full text-left px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
            >
              ⚙️ Configuración
            </button>
          </div>

          {/* Botón de Salida con detención de propagación */}
          <div className="p-1 border-t border-slate-100 mt-1">
            <button
              type="button"
              onClick={handleLogout}
              className="w-full text-left px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
            >
              🚪 Cerrar Sesión
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
