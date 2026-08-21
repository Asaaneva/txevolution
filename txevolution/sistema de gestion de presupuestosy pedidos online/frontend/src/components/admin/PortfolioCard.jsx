import React from "react";

export const PortfolioCard = ({ proyecto, onEdit, onDelete }) => {
  const {
    id,
    titulo,
    categoria_principal,
    subcategoria,
    modelo_tipo,
    genero,
    precio,
    descripcion,
    imagen_url,
  } = proyecto;

  return (
    <div className="w-full bg-white border border-stone-200/80 rounded-2xl shadow-sm overflow-hidden flex flex-col sm:flex-row transition-all duration-200 hover:border-stone-300 group">
      {/* Contenedor de la Imagen / Miniatura */}
      <div className="w-full sm:w-40 h-40 bg-stone-100 relative overflow-hidden flex-shrink-0">
        {imagen_url ? (
          <img
            src={imagen_url}
            alt={titulo}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-stone-300 text-xs">
            📦 Sin imagen
          </div>
        )}
        
        {/* Badge de Categoria Principal Flotante */}
        <span className="absolute top-2 left-2 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-stone-900/80 backdrop-blur-sm text-stone-100 rounded-md">
          {categoria_principal}
        </span>
      </div>

      {/* Contenido Técnico e Informativo */}
      <div className="flex-1 p-4 flex flex-col justify-between gap-3">
        <div>
          {/* Fila superior: Subcategorías y Atributos Estéticos */}
          <div className="flex flex-wrap items-center gap-1.5 text-[10px] text-stone-400 font-bold uppercase tracking-wider mb-1">
            {subcategoria && <span>{subcategoria}</span>}
            {modelo_tipo && (
              <>
                <span className="text-stone-300">•</span>
                <span className="text-stone-500">{modelo_tipo}</span>
              </>
            )}
            {genero && (
              <>
                <span className="text-stone-300">•</span>
                <span className="text-amber-700/80">{genero}</span>
              </>
            )}
          </div>

          {/* Título del Proyecto y Precio */}
          <div className="flex items-baseline justify-between gap-2">
            <h4 className="text-sm font-bold text-stone-900 tracking-tight group-hover:text-amber-900 transition-colors">
              {titulo}
            </h4>
            {precio && (
              <span className="text-xs font-bold px-2 py-0.5 bg-stone-50 text-stone-700 border border-stone-200/60 rounded-lg whitespace-nowrap">
                {precio}
              </span>
            )}
          </div>

          {/* Descripción de Materiales o Ingeniería */}
          <p className="text-xs text-stone-500 mt-1.5 line-clamp-2 leading-relaxed">
            {descripcion}
          </p>
        </div>

        {/* Botonera de Acciones Administrativas */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100/70">
          <button
            onClick={() => onEdit(proyecto)}
            className="px-3 py-1 text-[11px] font-bold text-stone-600 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-lg transition-all active:scale-95 cursor-pointer flex items-center gap-1"
          >
            ✏️ Editar
          </button>
          
          <button
            onClick={() => onDelete(id)}
            className="px-3 py-1 text-[11px] font-bold text-rose-600 bg-rose-50/40 hover:bg-rose-50 border border-rose-100 rounded-lg transition-all active:scale-95 cursor-pointer flex items-center gap-1"
          >
            🗑️ Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};

export default PortfolioCard;