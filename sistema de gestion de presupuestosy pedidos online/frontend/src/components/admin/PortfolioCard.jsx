// src/components/portfolio/PortfolioCard.jsx
import React from "react";
import Button from "../ui/Button";

export const PortfolioCard = ({ proyecto, onEdit, onDelete }) => {
  return (
    <div className="group relative p-4 bg-white border border-stone-200 rounded-xl flex items-center justify-between gap-5 transition-all duration-300 ease-out hover:border-amber-900/60 hover:shadow-md hover:scale-[1.01] transform-gpu will-change-transform">
      
      {/* Contenido Izquierdo: Imagen + Textos explicativos */}
      <div className="flex items-center gap-4 min-w-0">
        
        {/* Contenedor de Imagen con Efecto Zoom Dinámico e Interno */}
        <div className="w-16 h-16 rounded-lg bg-stone-100 overflow-hidden border border-stone-200/60 shrink-0 relative">
          {proyecto.imagen_url ? (
            <img 
              src={proyecto.imagen_url} 
              alt={proyecto.titulo} 
              className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110 transform-gpu"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xs text-stone-400">💼</div>
          )}
        </div>

        {/* Detalles e Identificadores del Modelo */}
        <div className="min-w-0 space-y-0.5">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="px-1.5 py-0.5 bg-stone-100 group-hover:bg-amber-50 group-hover:text-amber-900 text-[8px] uppercase font-black text-stone-500 rounded-sm transition-colors duration-300">
              {proyecto.categoria_principal}
            </span>
            <span className="text-[9px] text-stone-400 font-bold uppercase tracking-tight">
              / {proyecto.subcategoria}
            </span>
            {proyecto.genero && (
              <span className="text-[9px] text-stone-400 font-medium">
                • Linea {proyecto.genero}
              </span>
            )}
          </div>
          
          <h4 className="text-xs font-bold text-stone-800 transition-colors duration-300 group-hover:text-stone-900 truncate">
            {proyecto.titulo}
          </h4>
          
          <p className="text-[11px] text-stone-400 group-hover:text-stone-500 transition-colors duration-300 truncate max-w-xs leading-relaxed">
            {proyecto.descripcion || "Sin especificaciones asignadas."}
          </p>
        </div>
      </div>

      {/* Contenido Derecho: Precio + Bloque de Acciones */}
      <div className="flex items-center gap-3 shrink-0">
        <span className="text-xs font-bold text-stone-800 bg-stone-50 group-hover:bg-amber-50/40 px-2 py-1 rounded-md transition-colors duration-300">
          {proyecto.precio || "Consultar"}
        </span>
        
        <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity duration-300">
          
          {/* 🟫 REUTILIZACIÓN PREMIUM: Tu botón con los mismos colores de marca e idéntico comportamiento */}
          <Button
            type="button"
            variant="artesanal"
            onClick={() => onEdit(proyecto)}
            className="px-2.5 py-1.5 text-[10px] !tracking-wide normal-case"
          >
            Editar
          </Button>

          {/* Botón Destructivo de Eliminación */}
          <button
            onClick={() => onDelete(proyecto.id)}
            className="p-1.5 bg-white border border-stone-200 hover:border-red-200 hover:bg-red-50 text-stone-400 hover:text-red-600 rounded-lg text-[10px] cursor-pointer transition-all duration-200 active:scale-90"
            title="Eliminar registro"
          >
            ✕
          </button>
        </div>
      </div>

    </div>
  );
};

export default PortfolioCard;