import React from "react";
import { ComponenteCargaFoto } from "./ComponenteCargaFoto";

export const PortfolioForm = ({
  formData,
  errores,
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
        Publicar Proyecto Terminado
      </h2>

      <form
        onSubmit={onSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* COLUMNA IZQUIERDA: Flujos Dinámicos */}
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

          {/* FLUJO INDEX */}
          {formData.destino === "index" && (
            <div
              className={`flex flex-col gap-4 p-4 bg-stone-50/50 rounded-xl border ${
                errores.tipoArticuloCat || errores.subcategoriaUso
                  ? "border-red-300 bg-red-50/20"
                  : "border-stone-200/60"
              }`}
            >
              <div className="flex flex-col gap-2">
                <label className="text-[11px] font-bold text-stone-600 uppercase tracking-wider">
                  Sección de Destino
                </label>
                <div className="flex gap-4">
                  {["cuero", "tapiceria"].map((sec) => (
                    <label
                      key={sec}
                      className="flex items-center gap-2 text-xs text-stone-700 cursor-pointer capitalize"
                    >
                      <input
                        type="radio"
                        name="seccionIndex"
                        value={sec}
                        checked={formData.tipoArticuloCat === sec}
                        onChange={(e) =>
                          registrarCambio("tipoArticuloCat", e.target.value)
                        }
                        className="w-4 h-4 accent-amber-800"
                      />
                      {sec === "cuero" ? "Artículos en Cuero" : "Tapicería"}
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2 border-t border-stone-200/60 pt-3">
                <label className="text-[11px] font-bold text-stone-600 uppercase tracking-wider">
                  Subcategoría a Destacar
                </label>
                <div className="flex gap-4">
                  {["Zapatos", "Cartera", "Correa"].map((sub) => (
                    <label
                      key={sub}
                      className="flex items-center gap-2 text-xs text-stone-700 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="subcategoriaIndex"
                        value={sub}
                        checked={formData.subcategoriaUso === sub}
                        onChange={(e) =>
                          registrarCambio("subcategoriaUso", e.target.value)
                        }
                        className="w-4 h-4 accent-amber-800"
                      />
                      {sub}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* FLUJO CATEGORÍA */}
          {formData.destino === "categoria" && (
            <div
              className={`flex flex-col gap-4 p-4 bg-stone-50/50 rounded-xl border ${
                errores.tipoArticuloCat || errores.subcategoriaUso
                  ? "border-red-300 bg-red-50/20"
                  : "border-stone-200/60"
              }`}
            >
              <div className="flex flex-col gap-2">
                <label className="text-[11px] font-bold text-stone-600 uppercase tracking-wider">
                  Sección del Catálogo
                </label>
                <div className="flex gap-4">
                  {["cuero", "tapiceria"].map((sec) => (
                    <label
                      key={sec}
                      className="flex items-center gap-2 text-xs text-stone-700 cursor-pointer capitalize"
                    >
                      <input
                        type="radio"
                        name="seccionCat"
                        value={sec}
                        checked={formData.tipoArticuloCat === sec}
                        onChange={(e) =>
                          registrarCambio("tipoArticuloCat", e.target.value)
                        }
                        className="w-4 h-4 accent-amber-800"
                      />
                      {sec === "cuero" ? "Artículos en Cuero" : "Tapicería"}
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2 border-t border-stone-200/60 pt-3">
                <label className="text-[11px] font-bold text-stone-600 uppercase tracking-wider">
                  Subcategoría
                </label>
                <div className="flex gap-4">
                  {["Zapatos", "Cartera", "Correa"].map((sub) => (
                    <label
                      key={sub}
                      className="flex items-center gap-2 text-xs text-stone-700 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="subcategoriaCat"
                        value={sub}
                        checked={formData.subcategoriaUso === sub}
                        onChange={(e) =>
                          registrarCambio("subcategoriaUso", e.target.value)
                        }
                        className="w-4 h-4 accent-amber-800"
                      />
                      {sub}
                    </label>
                  ))}
                </div>
              </div>

              {formData.subcategoriaUso === "Zapatos" && (
                <div className="flex flex-col gap-3 border-t border-stone-200/60 pt-3">
                  <div
                    className={`flex flex-col gap-1.5 p-2 rounded-lg ${
                      errores.clasificacionCalzado
                        ? "bg-red-50 border border-red-200"
                        : ""
                    }`}
                  >
                    <label className="text-[10px] font-bold text-stone-500 uppercase">
                      Clasificación de Calzado
                    </label>
                    <div className="flex gap-3">
                      {["Casual", "Deportivo", "De Seguridad"].map((uso) => (
                        <label
                          key={uso}
                          className="flex items-center gap-1.5 text-xs text-stone-600 cursor-pointer"
                        >
                          <input
                            type="radio"
                            name="clasificacionCalzado"
                            value={uso}
                            checked={formData.clasificacionCalzado === uso}
                            onChange={(e) =>
                              registrarCambio(
                                "clasificacionCalzado",
                                e.target.value
                              )
                            }
                            className="w-3.5 h-3.5 accent-indigo-600"
                          />
                          {uso}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div
                    className={`flex flex-col gap-1.5 p-2 rounded-lg ${
                      errores.genero ? "bg-red-50 border border-red-200" : ""
                    }`}
                  >
                    <label className="text-[10px] font-bold text-stone-500 uppercase">
                      Público Objetivo
                    </label>
                    <div className="flex gap-4">
                      {["Dama", "Caballero"].map((gen) => (
                        <label
                          key={gen}
                          className="flex items-center gap-1.5 text-xs text-stone-600 cursor-pointer"
                        >
                          <input
                            type="radio"
                            name="generoCat"
                            value={gen}
                            checked={formData.genero === gen}
                            onChange={(e) =>
                              registrarCambio("genero", e.target.value)
                            }
                            className="w-3.5 h-3.5 accent-indigo-600"
                          />
                          {gen}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* FLUJO PRODUCTO DETALLADO */}
          {formData.destino === "producto" && (
            <div className="flex flex-col gap-4 p-4 bg-stone-50/50 rounded-xl border border-stone-200/60">
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                  Título / Nombre
                </label>
                <input
                  type="text"
                  value={formData.nombre || ""}
                  onChange={(e) => registrarCambio("nombre", e.target.value)}
                  placeholder="Ej. Calzado Oxford Clásico"
                  className={inputStyle(errores.nombre)}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                  Modelo / Código Único
                </label>
                <input
                  type="text"
                  value={formData.modelo || ""}
                  onChange={(e) => registrarCambio("modelo", e.target.value)}
                  placeholder="Ej. C3-OX-2026"
                  className={inputStyle(errores.modelo)}
                />
              </div>

              <div
                className={`flex flex-col gap-2 pt-1 p-2 rounded-lg ${
                  errores.genero ? "bg-red-50 border border-red-200" : ""
                }`}
              >
                <label className="text-[11px] font-bold text-stone-600 uppercase tracking-wider">
                  Línea de Diseño
                </label>
                <div className="flex gap-4">
                  {["Dama", "Caballero"].map((gen) => (
                    <label
                      key={gen}
                      className="flex items-center gap-2 text-xs text-stone-700 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="generoProducto"
                        value={gen}
                        checked={formData.genero === gen}
                        onChange={(e) =>
                          registrarCambio("genero", e.target.value)
                        }
                        className="w-4 h-4 accent-indigo-600"
                      />
                      Línea {gen}s
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* COLUMNA DERECHA: Multimedia */}
        <div className="flex flex-col gap-4 justify-between">
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
              Fotografía en Alta Resolución
            </label>
            {/* 🚀 MODIFICADO: Ahora pasamos el objeto de archivo físico en el callback nativo */}
            <ComponenteCargaFoto
              fotoUrl={formData.fotoUrl}
              nombreArchivo={formData.nombreArchivo}
              hasError={errores.foto}
              onFotoCambiada={(archivoImagenObjeto) => {
                if (archivoImagenObjeto) {
                  registrarCambio("nombreArchivo", archivoImagenObjeto.name);
                  registrarCambio("fotoUrl", archivoImagenObjeto); // Mandamos el binario File hacia la lógica interceptora
                }
              }}
              onFotoRemovida={() => {
                registrarCambio("nombreArchivo", "Seleccionar archivo...");
                registrarCambio("fotoUrl", "");
              }}
            />
          </div>

          {formData.destino !== "index" && (
            <div className="flex flex-col gap-1.5 transition-all duration-300">
              <label className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                Descripción del Artículo
              </label>
              <textarea
                value={formData.descripcion || ""}
                onChange={(e) => registrarCambio("descripcion", e.target.value)}
                placeholder="Especifica acabados, tipo de cuero, costuras o materiales de tapizado..."
                rows="4"
                className={inputStyle(false)}
              />
            </div>
          )}
        </div>

        <div className="md:col-span-2 mt-2">
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-xs active:scale-[0.995]"
          >
            👁️ Ver Vista Previa del Proyecto
          </button>
        </div>
      </form>
    </div>
  );
};
