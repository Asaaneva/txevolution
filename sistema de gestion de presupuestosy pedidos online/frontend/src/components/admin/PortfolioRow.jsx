import React from "react";

export const PortfolioRow = ({ proyecto }) => {
  const {
    nombre,
    destino,
    modelo,
    genero,
    tipoArticuloCat,
    subcategoriaUso,
    clasificacionCalzado,
    fotoUrl,
  } = proyecto;

  return (
    <tr className="hover:bg-stone-50/40 transition-colors">
      <td className="p-3.5">
        {fotoUrl ? (
          <img
            src={fotoUrl}
            alt="miniatura"
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
          {nombre || "Ítem de Vitrina"}
        </div>
        <span
          className={`inline-block px-1.5 py-0.5 rounded text-[9px] font-bold uppercase mt-1 ${
            destino === "index"
              ? "bg-amber-50 text-amber-800 border border-amber-200"
              : destino === "categoria"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : "bg-indigo-50 text-indigo-800 border border-indigo-200"
          }`}
        >
          {destino}
        </span>
      </td>
      <td className="p-3.5 text-stone-500 font-mono">
        {modelo ? `Mod: ${modelo}` : "—"}
        {genero && (
          <div className="text-[10px] text-stone-400 font-sans font-medium">
            Línea: {genero}
          </div>
        )}
      </td>
      <td className="p-3.5 font-medium text-stone-600 capitalize">
        {tipoArticuloCat
          ? tipoArticuloCat === "cuero"
            ? "Artículos en Cuero"
            : "Tapicería"
          : "—"}
      </td>
      <td className="p-3.5 text-stone-500 font-medium">
        <div className="text-stone-800">{subcategoriaUso || "—"}</div>
        {clasificacionCalzado && (
          <div className="text-[10px] text-indigo-600 font-bold mt-0.5">
            ↳ {clasificacionCalzado}
          </div>
        )}
      </td>
    </tr>
  );
};
