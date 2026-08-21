// src/components/admin/LivePreviewCard.jsx
import React from "react";

export const LivePreviewCard = ({ datos }) => {
  if (!datos) return null;

  const { 
    destino, 
    nombre, 
    modelo,         // Coincide con tu hook (VALORES_INICIALES)
    descripcion,    // Coincide con tu hook
    fotoUrl, 
    tipoArticuloCat, 
    subcategoriaUso 
  } = datos;

  return (
    <div className="group w-full max-w-[340px] bg-white border border-stone-200 rounded-xl overflow-hidden shadow-sm">
      
      {/* Contenedor de la Imagen */}
      <div className="relative w-full h-[240px] bg-stone-50 overflow-hidden flex items-center justify-center border-b border-stone-200">
        {fotoUrl ? (
          <img src={fotoUrl} alt="Preview" className="w-full h-full object-cover" />
        ) : (
          <div className="text-stone-400 text-xs font-medium">📷 Sin imagen</div>
        )}
        
        {destino && (
          <span className="absolute top-3 right-3 bg-white/95 text-stone-800 text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm border border-stone-100 uppercase">
            {destino === "index" ? "🏠 Portada" : destino === "categoria" ? "📂 Categoría" : "📦 Producto"}
          </span>
        )}
      </div>

      {/* Cuerpo de Información */}
      <div className="p-4.5 flex flex-col gap-2">
        {(tipoArticuloCat || subcategoriaUso) && (
          <div className="flex flex-wrap gap-1.5 mb-1">
            {tipoArticuloCat && (
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-100">
                {tipoArticuloCat}
              </span>
            )}
            {subcategoriaUso && (
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-stone-100 text-stone-700 border border-stone-200">
                {subcategoriaUso}
              </span>
            )}
          </div>
        )}

        {/* SI NO HAY NOMBRE, MUESTRA UN TEXTO TEMPORAL EN VEZ DE BLOQUEARSE */}
        <h4 className="text-base font-bold text-stone-900 leading-tight">
          {nombre || "Artículo sin nombre (Index)"}
        </h4>
        
        <p className="font-mono text-xs text-amber-600 font-semibold">
          {modelo ? `Mod. ${modelo}` : "Sin código de modelo"}
        </p>
        <p className="text-xs text-stone-500 leading-relaxed line-clamp-3 mt-1">
          {descripcion || "Sin descripción proporcionada..."}
        </p>
      </div>
    </div>
  );
};