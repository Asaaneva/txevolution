import React from "react";
import { usePortfolioPage } from "../hooks/usePortfolioPage";
import { LivePreviewCard } from "../components/admin/LivePreviewCard";
import { PortfolioForm } from "../components/admin/PortfolioForm";
import { PortfolioRow } from "../components/admin/PortfolioRow";

export const PortfolioPage = () => {
  const {
    proyectos,
    formData,
    errores: erroresValidacion, // Renombra 'errores' como 'erroresValidacion' al renombrar esto la validacion de errores volvio
    isModalOpen,
    guardandoRegistro,
    proyectoEdicionId,
    setIsModalOpen,
    registrarCambio,
    handleSubmitForm,
    handleConfirmarGuardado,
    handleGuardarCambiosFila,
    handleEliminar,
    resetFormulario,
    prepararEdicion,
  } = usePortfolioPage();

  return (
    <div className="w-full animate-fadeIn">
      {/* 📝 Formulario Principal */}
      <PortfolioForm
        formData={formData}
        errores={erroresValidacion}
        registrarCambio={registrarCambio}
        onSubmit={handleSubmitForm} // 👈 Conectado correctamente
        isEditing={!!proyectoEdicionId}
        onCancelarEdicion={resetFormulario}
      />

      {/* 📋 Tabla / Vitrina de Proyectos */}
      <div className="bg-white rounded-xl border border-stone-200/80 shadow-sm p-6 mt-6">
        <h3 className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-4">
          Listado de Proyectos Publicados{" "}
          {proyectoEdicionId && (
            <span className="text-amber-500 font-normal normal-case">
              (Modo formulario activo)
            </span>
          )}
        </h3>
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-stone-50/75 border-b border-stone-200 text-stone-500 font-semibold text-xs uppercase tracking-wider">
                <th className="p-3.5 w-16">Imagen</th>
                <th className="p-3.5">Ubicación / Destino</th>
                <th className="p-3.5">Modelo / Info</th>
                <th className="p-3.5">Sección Principal</th>
                <th className="p-3.5">Subcategoría / Filtros</th>
                <th className="p-3.5 text-center w-28">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-700 text-xs">
              {proyectos.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="p-8 text-center text-stone-400 font-medium"
                  >
                    No hay artículos agregados en la base de datos.
                  </td>
                </tr>
              ) : (
                proyectos.map((p) => (
                  <PortfolioRow
                    key={p.id}
                    proyecto={p}
                    onGuardarCambios={handleGuardarCambiosFila}
                    onEliminar={handleEliminar}
                    onEditar={() => prepararEdicion(p)}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 👁️ Modal de Vista Previa y Confirmación */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-xl border border-stone-200 max-w-[390px] w-full p-6 flex flex-col items-center gap-5">
            <div className="w-full text-center border-b border-stone-100 pb-3">
              <h3 className="text-sm font-bold text-stone-900">
                {proyectoEdicionId
                  ? "👁️ Confirmar Cambios de Edición"
                  : "👁️ Confirmación de Vitrina"}
              </h3>
            </div>
            <div className="w-full flex justify-center py-1">
              <LivePreviewCard datos={formData} />
            </div>
            <div className="flex gap-3 w-full mt-2">
              <button
                type="button"
                disabled={guardandoRegistro}
                onClick={() => setIsModalOpen(false)}
                className="flex-1 py-2 text-xs font-bold text-stone-500 bg-stone-100 rounded-lg border border-stone-200 cursor-pointer"
              >
                ✕ Cancelar
              </button>
              <button
                type="button"
                disabled={guardandoRegistro}
                onClick={handleConfirmarGuardado}
                className="flex-1 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg flex items-center justify-center disabled:bg-indigo-400 cursor-pointer"
              >
                {guardandoRegistro
                  ? "⏳ Guardando..."
                  : proyectoEdicionId
                  ? "✓ Aplicar Cambios"
                  : "✓ Publicar Artículo"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
