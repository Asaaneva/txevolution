import React, { useState } from "react";

export const PortfolioRow = ({ proyecto, onEliminar, onGuardarCambios }) => {
  if (!proyecto) return null;

  const [editando, setEditando] = useState(false);
  const [valores, setValores] = useState({ ...proyecto });

  const manejarCambioCelda = (campo, valor) => {
    setValores((prev) => ({ ...prev, [campo]: valor }));
  };

  const manejarCambioFoto = (e) => {
    const archivo = e.target.files[0];
    if (archivo) {
      manejarCambioCelda("archivoFisico", archivo);
      manejarCambioCelda("fotoUrl", URL.createObjectURL(archivo));
    }
  };

  // En PortfolioRow.jsx
  const ejecutarGuardadoLocal = async () => {
    try {
      // Forzamos a que use el ID del proyecto original que vino de la base de datos
      const idCorrecto = proyecto.id;

      if (!idCorrecto) {
        console.error("❌ El objeto proyecto no tiene un ID válido:", proyecto);
        alert("Error: No se detecta el ID de este artículo.");
        return;
      }

      await onGuardarCambios(idCorrecto, valores);
      setEditando(false);
    } catch (error) {
      console.error(error);
    }
  };

  const ejecutarEliminacionLocal = (e) => {
    e.stopPropagation(); // Evita que la fila entre en modo edición al hacer clic en eliminar
    onEliminar(proyecto.id);
  };

  // VISTA MODO EDICIÓN EN LÍNEA
  if (editando) {
    return (
      <tr className="bg-stone-50/60 border-l-2 border-indigo-500 transition-colors">
        <td className="p-3.5" onClick={(e) => e.stopPropagation()}>
          <label className="cursor-pointer block relative group">
            <img
              src={valores.fotoUrl || "📷"}
              alt="Preview"
              className="w-10 h-10 object-cover rounded-md border border-stone-200"
            />
            <input
              type="file"
              accept="image/*"
              onChange={manejarCambioFoto}
              className="hidden"
            />
          </label>
        </td>
        <td className="p-3.5 space-y-1" onClick={(e) => e.stopPropagation()}>
          <input
            type="text"
            value={valores.nombre}
            onChange={(e) => manejarCambioCelda("nombre", e.target.value)}
            className="w-full px-2 py-1 text-xs border border-stone-300 rounded font-bold text-stone-900"
          />
          <select
            value={valores.destino}
            onChange={(e) => manejarCambioCelda("destino", e.target.value)}
            className="w-full px-1 py-0.5 text-[11px] border border-stone-300 rounded bg-white font-bold uppercase"
          >
            <option value="index">Index</option>
            <option value="categoria">Categoría</option>
            <option value="producto">Producto</option>
          </select>
        </td>
        <td className="p-3.5 space-y-1" onClick={(e) => e.stopPropagation()}>
          <input
            type="text"
            value={valores.modelo}
            placeholder="Modelo"
            onChange={(e) => manejarCambioCelda("modelo", e.target.value)}
            className="w-full px-2 py-1 text-xs font-mono border border-stone-300 rounded"
          />
          <input
            type="text"
            value={valores.genero}
            placeholder="Género"
            onChange={(e) => manejarCambioCelda("genero", e.target.value)}
            className="w-full px-2 py-1 text-[10px] border border-stone-300 rounded"
          />
        </td>
        <td className="p-3.5" onClick={(e) => e.stopPropagation()}>
          <select
            value={valores.tipoArticuloCat}
            onChange={(e) =>
              manejarCambioCelda("tipoArticuloCat", e.target.value)
            }
            className="w-full px-2 py-1 text-xs border border-stone-300 rounded bg-white font-medium"
          >
            <option value="cuero">cuero</option>
            <option value="tapiceria">tapiceria</option>
          </select>
        </td>
        <td className="p-3.5 space-y-1" onClick={(e) => e.stopPropagation()}>
          <input
            type="text"
            value={valores.subcategoriaUso}
            onChange={(e) =>
              manejarCambioCelda("subcategoriaUso", e.target.value)
            }
            className="w-full px-2 py-1 text-xs border border-stone-300 rounded text-stone-800"
          />
          <input
            type="text"
            value={valores.clasificacionCalzado}
            placeholder="Clasificación"
            onChange={(e) =>
              manejarCambioCelda("clasificacionCalzado", e.target.value)
            }
            className="w-full px-2 py-1 text-[10px] border border-stone-300 rounded text-indigo-600 font-bold"
          />
        </td>
        <td className="p-3.5 text-center" onClick={(e) => e.stopPropagation()}>
          <div className="flex justify-center gap-2">
            <button
              type="button"
              onClick={ejecutarGuardadoLocal}
              className="px-2.5 py-1 text-xs font-semibold text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors"
            >
              Guardar
            </button>
            <button
              type="button"
              onClick={() => {
                setValores({ ...proyecto });
                setEditando(false);
              }}
              className="px-2.5 py-1 text-xs font-semibold text-stone-500 hover:bg-stone-100 rounded-md transition-colors"
            >
              Cancelar
            </button>
          </div>
        </td>
      </tr>
    );
  }

  // VISTA MODO LECTURA ORIGINAL
  return (
    <tr
      onClick={() => setEditando(true)}
      className="hover:bg-stone-50/40 transition-colors cursor-pointer"
    >
      <td className="p-3.5">
        {proyecto.fotoUrl ? (
          <img
            src={proyecto.fotoUrl}
            alt={proyecto.nombre}
            className="w-10 h-10 object-cover rounded-md border border-stone-200"
          />
        ) : (
          <div className="w-10 h-10 bg-stone-100 rounded-md flex items-center justify-center text-stone-400 text-base">
            📷
          </div>
        )}
      </td>
      <td className="p-3.5">
        <div className="font-bold text-stone-900 text-sm">
          {proyecto.nombre || "Ítem de Vitrina"}
        </div>
        <span
          className={`inline-block px-1.5 py-0.5 rounded text-[9px] font-bold uppercase mt-1 ${
            proyecto.destino === "index"
              ? "bg-amber-50 text-amber-800 border border-amber-200"
              : proyecto.destino === "categoria"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : "bg-indigo-50 text-indigo-800 border border-indigo-200"
          }`}
        >
          {proyecto.destino || "No definido"}
        </span>
      </td>
      <td className="p-3.5 text-stone-500 font-mono">
        {proyecto.modelo ? `Mod: ${proyecto.modelo}` : "—"}
        {proyecto.genero && (
          <div className="text-[10px] text-stone-400 font-sans font-medium">
            Línea: {proyecto.genero}
          </div>
        )}
      </td>
      <td className="p-3.5 font-medium text-stone-600 capitalize">
        {proyecto.tipoArticuloCat
          ? proyecto.tipoArticuloCat === "cuero"
            ? "Artículos en Cuero"
            : "Tapicería"
          : "—"}
      </td>
      <td className="p-3.5 text-stone-500 font-medium">
        <div className="text-stone-800">{proyecto.subcategoriaUso || "—"}</div>
        {proyecto.clasificacionCalzado && (
          <div className="text-[10px] text-indigo-600 font-bold mt-0.5">
            ↳ {proyecto.clasificacionCalzado}
          </div>
        )}
      </td>
      <td className="p-3.5 text-center" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          onClick={ejecutarEliminacionLocal}
          className="px-2.5 py-1 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-md transition-colors"
        >
          Eliminar
        </button>
      </td>
    </tr>
  );
};
