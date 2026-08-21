// src/components/FormRadioGroup.jsx
import React from "react";

export const FormRadioGroup = ({
  titulo,
  items,
  campo,
  nameScope,
  valorActual,
  onChange,
  esListaCapitalize = false,
}) => (
  <div className="flex flex-col gap-2">
    <label className="text-[11px] font-bold text-stone-600 uppercase tracking-wider">
      {titulo}
    </label>
    <div className="flex gap-4 flex-wrap">
      {items.map((item) => (
        <label
          key={item}
          className={`flex items-center gap-2 text-xs text-stone-700 cursor-pointer ${
            esListaCapitalize ? "capitalize" : ""
          }`}
        >
          <input
            type="radio"
            name={nameScope}
            value={item}
            checked={valorActual === item}
            onChange={(e) => onChange(campo, e.target.value)}
            className="w-4 h-4 accent-amber-800"
          />
          {item === "cuero"
            ? "Artículos en Cuero"
            : item === "tapiceria"
            ? "Tapicería"
            : item}
        </label>
      ))}
    </div>
  </div>
);



