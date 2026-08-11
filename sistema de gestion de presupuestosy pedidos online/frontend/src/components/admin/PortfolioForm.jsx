// src/components/PortfolioForm.jsx
import React from "react";
import { ComponenteCargaFoto } from "./ComponenteCargaFoto";
import { FormRadioGroup } from "./FormRadioGroup";

export const PortfolioForm = ({
  formData,
  errores = {},
  registrarCambio,
  onSubmit,
  manejarCambioFoto,
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
        Publicar Proyecto Terminado
      </h2>

      <form
        onSubmit={onSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* Columna Izquierda: Destinos y Opciones Condicionales */}
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
              <option value="producto">Detalles de Producto</option>
            </select>
          </div>

          {(formData.destino === "index" ||
            formData.destino === "categoria") && (
            <div
              className={`flex flex-col gap-4 p-4 bg-stone-50/50 rounded-xl border ${
                errores.tipoArticuloCat || errores.subcategoriaUso
                  ? "border-red-300 bg-red-50/20"
                  : "border-stone-200/60"
              }`}
            >
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

              {formData.destino === "categoria" &&
                formData.subcategoriaUso === "Zapatos" && (
                  <div
                    className={`border-t border-stone-200/60 pt-3 p-2 rounded-lg ${
                      errores.clasificacionCalzado
                        ? "bg-red-50/40 border border-red-200"
                        : ""
                    }`}
                  >
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
            </div>
          )}

          {formData.destino === "producto" && (
            <div className="flex flex-col gap-4 p-4 bg-stone-50/50 rounded-xl border border-stone-200/60">
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold text-stone-600 uppercase">
                  Nombre Comercial
                </label>
                <input
                  type="text"
                  placeholder="Ej. Bota Confort Premium"
                  value={formData.nombre || ""}
                  onChange={(e) => registrarCambio("nombre", e.target.value)}
                  className={inputStyle(errores.nombre)}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold text-stone-600 uppercase">
                  Modelo Técnico
                </label>
                <input
                  type="text"
                  placeholder="Ej. TX-2026"
                  value={formData.modelo || ""}
                  onChange={(e) => registrarCambio("modelo", e.target.value)}
                  className={inputStyle(errores.modelo)}
                />
              </div>
            </div>
          )}
        </div>

        {/* Columna Derecha: Carga de Foto y Botón */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
            Fotografía de Vitrina
          </label>
          <ComponenteCargaFoto
            fotoUrl={formData.fotoUrl}//createObjectURL(file)transforma el archivo local a rutatipo blob
            nombreArchivo={formData.fotoNombre}
            onFotoCambiada={(file) => {
              // 1. Creamos la URL temporal para que la etiqueta <img> la pueda mostrar sin romperse
              const urlTemporal = URL.createObjectURL(file);
              registrarCambio("fotoUrl", urlTemporal);
              registrarCambio("fotoNombre", file.name);
              
              //  Opcional: si tu función registrarCambio limpia errores automáticamente, genial. 
              // Si no, asegúrate de que al cambiar la foto se limpie el error de fotoUrl.
            }}
            onFotoRemovida={() => {
              registrarCambio("fotoUrl", "");
              registrarCambio("fotoNombre", "");
            }}
            hasError={errores.fotoUrl}
          />
          <button
            type="submit"
            className="w-full py-2.5 bg-amber-800 text-white font-bold text-xs rounded-lg hover:bg-amber-900 transition-colors shadow-xs mt-auto cursor-pointer"
          >
            Previsualizar Publicación
          </button>
        </div>
      </form>
    </div>
  );
};