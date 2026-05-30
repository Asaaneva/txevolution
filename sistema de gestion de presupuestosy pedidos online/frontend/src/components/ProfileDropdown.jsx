// src/components/layout/ProfileDropdown.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export const ProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Recuperamos el nombre real guardado en el Login
  const userName = localStorage.getItem("userName") || "Vanessa Rodriguez";
  const userInitials = userName.substring(0, 2).toUpperCase();

  // 🚪 Lógica implacable de Cierre de Sesión
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userName");
    navigate("/login"); // Redirección instantánea al Login pública
  };

  // 🛡️ Efecto para cerrar el menú si el usuario hace clic afuera de él
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
      {/* Botón del Avatar Interactivable */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 focus:outline-none group select-none"
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

      {/* 🗺️ Menú Desplegable Flotante */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl border border-slate-200/80 shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-200">
          {/* Encabezado del Menú (Información del Usuario) */}
          <div className="px-4 py-2.5 border-b border-slate-100">
            <p className="text-xs font-bold text-slate-800 truncate">
              {userName}
            </p>
            <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider mt-0.5">
              Administrador
            </p>
          </div>

          {/* Opciones del Menú */}
          <div className="p-1 flex flex-col gap-0.5">
            <button
              onClick={() => {
                setIsOpen(false);
                alert("Ir a mi perfil...");
              }}
              className="w-full text-left px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-colors flex items-center gap-2"
            >
              👤 Mi Perfil
            </button>
            <button
              onClick={() => {
                setIsOpen(false);
                alert("Ir a configuración...");
              }}
              className="w-full text-left px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-colors flex items-center gap-2"
            >
              ⚙️ Configuración
            </button>
          </div>

          {/* Botón de Salida Destacado */}
          <div className="p-1 border-t border-slate-100 mt-1">
            <button
              onClick={handleLogout}
              className="w-full text-left px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors flex items-center gap-2"
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
