// src/components/PortfolioForm.jsx
import React from "react";
import { ComponenteCargaFoto } from "./ComponenteCargaFoto";
import { FormRadioGroup } from "./FormRadioGroup";

export const PortfolioForm = ({
  formData,
  errores = {},
  registrarCambio,
  onSubmit,
}) => {
  const inputStyle = (hasError) => `
    w-full p-2.5 px-3.5 text-xs text-stone-800 bg-white border rounded-lg outline-none transition-all duration-200
    focus:border-amber-800 focus:ring-1 focus:ring-amber-800
    ${
      hasError
        ? "bg-red-50/60 border-red-400 text-red-900 animate-pulse"
        : "border-stone-200 hover:border-stone-300"
    }
  `;

  return (
    <div className="bg-white rounded-xl border border-stone-200/80 shadow-xs p-6 mb-6">
      <h2 className="text-sm font-bold text-stone-800 text-center uppercase tracking-wide mb-6">
        {formData.id ? "Editar Proyecto" : "Proyecto Terminado"}
      </h2>

      <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Columna Izquierda: Dinámica */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
              Ubicación de Destino
            </label>
            <select
              value={formData.destino || ""}
              onChange={(e) => registrarCambio("destino", e.target.value)}
              className={inputStyle(errores.destino)}
            >
              <option value="">Seleccione el destino...</option>
              <option value="index">Página de Inicio (Index)</option>
              <option value="categoria">Página de Categoría</option>
              <option value="detalles">Página de Detalles</option>
            </select>
          </div>

          {/* Bloque dinámico: Se renderiza solo si hay un destino elegido */}
          {formData.destino && (
            <div className="flex flex-col gap-4 p-4 bg-stone-50/50 rounded-xl border border-stone-200/60">
              
              {/* Bloque Base: Siempre aparece */}
              <FormRadioGroup
                titulo="Sección de Destino"
                items={["cuero", "tapiceria"]}
                campo="tipoArticuloCat"
                nameScope="seccion"
                valorActual={formData.tipoArticuloCat}
                onChange={registrarCambio}
                esListaCapitalize
              />

              <div className="border-t border-stone-200/60 pt-3">
                <FormRadioGroup
                  titulo="Subcategoría"
                  items={["Zapatos", "Cartera", "Correa"]}
                  campo="subcategoriaUso"
                  nameScope="subcategoria"
                  valorActual={formData.subcategoriaUso}
                  onChange={registrarCambio}
                />
              </div>

              {/* Clasificación de Calzado: ÚNICAMENTE para Categoría y Detalles si es Zapatos */}
              {(formData.destino === "categoria" || formData.destino === "detalles") && 
                formData.subcategoriaUso === "Zapatos" && (
                <div className="border-t border-stone-200/60 pt-3">
                  <FormRadioGroup
                    titulo="Clasificación de Calzado"
                    items={["Casual", "Deportivo", "De Seguridad"]}
                    campo="clasificacionCalzado"
                    nameScope="calzado"
                    valorActual={formData.clasificacionCalzado}
                    onChange={registrarCambio}
                  />
                </div>
              )}

              {/* Extras de Detalles: Solo si el destino es "detalles" */}
              {formData.destino === "detalles" && (
                <div className="border-t border-stone-200/60 pt-4 flex flex-col gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-bold text-stone-600 uppercase">Modelo</label>
                    <input 
                      type="text" 
                      value={formData.modelo || ""}
                      onChange={(e) => registrarCambio("modelo", e.target.value)}
                      className={inputStyle(errores.modelo)}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-bold text-stone-600 uppercase">Descripción</label>
                    <input 
                      type="text" 
                      value={formData.descripcion || ""}
                      onChange={(e) => registrarCambio("descripcion", e.target.value)}
                      className={inputStyle(errores.descripcion)}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Columna Derecha: Foto y Botón */}
        <div className="flex flex-col justify-between gap-6">
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
              Fotografía de Vitrina
            </label>
            <ComponenteCargaFoto
              fotoUrl={formData.fotoUrl}
              nombreArchivo={formData.fotoNombre}
              onFotoCambiada={(file) => {
                const urlTemporal = URL.createObjectURL(file);
                registrarCambio("fotoUrl", urlTemporal);
                registrarCambio("fotoNombre", file.name);
              }}
              onFotoRemovida={() => {
                registrarCambio("fotoUrl", "");
                registrarCambio("fotoNombre", "");
              }}
              hasError={errores.fotoUrl}
            />
          </div>
          <button
            type="submit"
            className="w-full py-2.5 bg-amber-800 text-white font-bold text-xs rounded-lg hover:bg-amber-900 transition-colors shadow-xs mt-auto cursor-pointer"
          >
            {formData.id ? "Guardar Cambios" : "Previsualizar Publicación"}
          </button>
        </div>
      </form>
    </div>
  );
};