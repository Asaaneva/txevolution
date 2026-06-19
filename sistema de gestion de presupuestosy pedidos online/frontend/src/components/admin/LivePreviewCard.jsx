// src/components/admin/LivePreviewCard.jsx
import React from "react";

export const LivePreviewCard = ({ datos }) => {
  const { 
    destino, nombre, modelo, descripcion, fotoUrl, 
    tipoArticuloIndex, subcategoriaIndex, tipoArticuloCat, publico, subcategoriaUso 
  } = datos;

  const categoria = tipoArticuloIndex || tipoArticuloCat || "";
  const subcategoria = subcategoriaIndex || subcategoriaUso || publico || "";

  return (
    <div className="group w-full max-w-[340px] bg-white border border-stone-200 rounded-xl overflow-hidden shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-300">
      
      {/* Contenedor de la Imagen */}
      <div className="relative w-full h-[240px] bg-stone-50 overflow-hidden flex items-center justify-center border-b border-stone-200">
        {fotoUrl ? (
          <img 
            src={fotoUrl} 
            alt="Preview" 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="text-stone-400 text-xs font-medium">
            📷 Sin imagen seleccionada
          </div>
        )}
        
        {destino && (
          <span className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm text-stone-800 text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm border border-stone-100">
            {destino === "index" ? "🏠 Portada" : destino === "categorias" ? "📂 Categoría" : "📦 Producto"}
          </span>
        )}
      </div>

      {/* Cuerpo de Información */}
      <div className="p-4.5 flex flex-col gap-2">
        {(categoria || subcategoria) && (
          <div className="flex flex-wrap gap-1.5 mb-1">
            {categoria && (
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-100/70">
                {categoria}
              </span>
            )}
            {subcategoria && (
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-stone-100 text-stone-700 border border-stone-200/60">
                {subcategoria}
              </span>
            )}
          </div>
        )}

        <h4 className="text-base font-bold text-stone-900 leading-tight">
          {nombre || "Nombre del Artículo"}
        </h4>
        <p className="font-mono text-xs text-amber-600 font-semibold">
          {modelo ? `Mod. ${modelo}` : "Código de Modelo"}
        </p>
        <p className="text-xs text-stone-500 leading-relaxed line-clamp-3 mt-1">
          {descripcion || "Aquí se mostrará la descripción detallada que escribas en el formulario..."}
        </p>
      </div>

    </div>
  );
};