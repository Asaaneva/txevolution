import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

export const Sidebar = ({ isOpen, setIsOpen }) => {
  const navigate = useNavigate();

  // Control de cierre de sesión seguro
  const handleLogout = () => {
    if (window.confirm("¿Estás segura de que deseas salir del sistema?")) {
      localStorage.removeItem("isAuthenticated");
      navigate("/");
    }
  };

  // 🎨 Estilos dinámicos usando NavLink (mantiene el diseño exacto de Tailwind UI)
  const obtenerEstiloEnlace = ({ isActive }) => `
    group flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md transition-all
    ${
      isActive
        ? "bg-gray-800 text-white font-semibold"
        : "text-gray-400 hover:bg-gray-800/40 hover:text-white"
    }
  `;

  return (
    <aside
      className={`
        bg-[linear-gradient(150deg,rgb(255,255,255),#662828,rgb(100,7,3),rgba(43,3,3,0.9))] fixed inset-y-0 left-0 z-50 
        flex w-64 flex-col justify-between h-screen 
        text-white border-r border-gray-800/60
        overflow-y-auto transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}
      style={{
        background:
          "linear-gradient(150deg, rgb(255, 255, 255), #662828, rgb(100, 7, 3), rgba(43, 3, 3, 0.9))",
      }}
    >
      {/* 🔝 SECCIÓN SUPERIOR: LOGO Y NAVEGACIÓN PRINCIPAL */}
      <div className="flex flex-col flex-1 px-4 py-6">
        {/* Cabecera de Marca */}
        <div className="flex items-center justify-between mb-7 px-2">
          <div className="flex items-center gap-2.5">
            {/* Isotipo geométrico minimalista */}
            <svg
              className="h-7 w-auto text-indigo-500"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
            <span className="text-sm font-bold tracking-wider uppercase font-sans text-gray-100">
              TXevolution
            </span>
          </div>

          {/* Botón de escape "✕" para Móviles */}
          <button
            onClick={() => setIsOpen(false)}
            className="md:hidden p-1 text-gray-400 hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Menú de Navegación */}
        <nav className="space-y-1">
          {/* 🔥 Enlace: Dashboard (Usa "end" para evitar iluminados fantasmas) */}
          <NavLink to="/dashboard" end className={obtenerEstiloEnlace}>
            {({ isActive }) => (
              <div className="flex items-center gap-3">
                <svg
                  className={`w-5 h-5 flex-shrink-0 transition-colors ${
                    isActive
                      ? "text-white"
                      : "text-gray-400 group-hover:text-white"
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1.5 1.5 0 001.5 1.5h3a1.5 1.5 0 001.5-1.5v-4a.5.5 0 01.5-.5h2a.5.5 0 01.5.5v4a1.5 1.5 0 001.5 1.5h3a1.5 1.5 0 001.5-1.5V10M9 21h6"
                  />
                </svg>
                <span>Dashboard</span>
              </div>
            )}
          </NavLink>

          {/* 🔥 Enlace: Gestionar Vitrina (Apunta a la ruta anidada correcta) */}
          <NavLink
            to="/dashboard/gestionar-vitrina"
            className={obtenerEstiloEnlace}
          >
            {({ isActive }) => (
              <>
                <div className="flex items-center gap-3">
                  <svg
                    className={`w-5 h-5 flex-shrink-0 transition-colors ${
                      isActive
                        ? "text-white"
                        : "text-gray-400 group-hover:text-white"
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                    />
                  </svg>
                  <span>Gestionar Vitrina</span>
                </div>

                <svg
                  className={`w-3.5 h-3.5 transition-colors ${
                    isActive
                      ? "text-gray-400"
                      : "text-gray-600 group-hover:text-gray-400"
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </>
            )}
          </NavLink>
        </nav>
      </div>

      {/* 🚪 SECCIÓN INFERIOR: BOTÓN DE DESCONEXIÓN */}
      <div className="p-4 border-t border-gray-800/60 bg-[#0f1523]">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-md transition-all active:scale-95 cursor-pointer"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          <span>Salir del Sistema</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
