import React, { useState } from "react";
import { usePortfolioForm } from "../hooks/usePortfolioForm";
import { LivePreviewCard } from "../components/admin/LivePreviewCard";
import { PortfolioForm } from "../components/admin/PortfolioForm";
import { PortfolioRow } from "../components/admin/PortfolioRow";

export const PortfolioPage = () => {
  const [proyectos, setProyectos] = useState([]);
  const [erroresValidacion, setErroresValidacion] = useState({});

  // Consumimos de forma elegante la función de guardado y su estado de carga
  const {
    formData,
    isModalOpen,
    guardandoRegistro,
    setIsModalOpen,
    handleInputChange,
    resetFormulario,
    publicarProyecto,
  } = usePortfolioForm();

  const handleVerVistaPrevia = (e) => {
    e.preventDefault();
    const nuevosErrores = {};

    if (!formData.destino) nuevosErrores.destino = true;
    if (formData.destino === "index" || formData.destino === "categoria") {
      if (!formData.tipoArticuloCat) nuevosErrores.tipoArticuloCat = true;
      if (!formData.subcategoriaUso) nuevosErrores.subcategoriaUso = true;
    }
    if (formData.destino === "producto") {
      if (!formData.nombre?.trim()) nuevosErrores.nombre = true;
      if (!formData.modelo?.trim()) nuevosErrores.modelo = true;
    }
    if (!formData.fotoUrl) nuevosErrores.foto = true;

    if (Object.keys(nuevosErrores).length > 0) {
      setErroresValidacion(nuevosErrores);
      setTimeout(() => setErroresValidacion({}), 3000);
      return;
    }

    setErroresValidacion({});
    setIsModalOpen(true);
  };

  // Execución limpia delegando el peso al hook
  const handleConfirmarGuardado = async () => {
    try {
      const nuevoProyecto = await publicarProyecto();

      setProyectos((prev) => [nuevoProyecto, ...prev]);
      setIsModalOpen(false);
      resetFormulario();
      alert("¡Proyecto publicado con éxito en TXevolution!");
    } catch (error) {
      console.error("❌ Error al consolidar registro:", error);
      alert(`Error al guardar en base de datos: ${error.message}`);
    }
  };

  const registrarCambio = (campo, valor) => {
    handleInputChange(campo, valor);
    if (erroresValidacion[campo]) {
      setErroresValidacion((prev) => ({ ...prev, [campo]: false }));
    }
  };

  return (
    <div className="w-full animate-fadeIn">
      <PortfolioForm
        formData={formData}
        errores={erroresValidacion}
        registrarCambio={registrarCambio}
        onSubmit={handleVerVistaPrevia}
      />

      {/* LISTADO DE PROYECTOS */}
      <div className="bg-white rounded-xl border border-stone-200/80 shadow-xs p-6 mt-6">
        <h3 className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-4">
          Listado de Proyectos Publicados
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
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-700 text-xs">
              {proyectos.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="p-8 text-center text-stone-400 font-medium"
                  >
                    No hay artículos agregados en esta sesión.
                  </td>
                </tr>
              ) : (
                proyectos.map((p) => <PortfolioRow key={p.id} proyecto={p} />)
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL DE CONFIRMACIÓN */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-xl border border-stone-200 max-w-[390px] w-full p-6 flex flex-col items-center gap-5">
            <div className="w-full text-center border-b border-stone-100 pb-3">
              <h3 className="text-sm font-bold text-stone-900">
                👁️ Confirmación de Vitrina
              </h3>
              <p className="text-[11px] text-stone-400 mt-0.5">
                Comprueba la distribución antes de publicar.
              </p>
            </div>

            <div className="w-full flex justify-center py-1">
              <LivePreviewCard datos={formData} />
            </div>

            <div className="flex gap-3 w-full mt-2">
              <button
                type="button"
                disabled={guardandoRegistro}
                onClick={() => setIsModalOpen(false)}
                className="flex-1 py-2 text-xs font-bold text-stone-500 bg-stone-100 rounded-lg border border-stone-200 disabled:opacity-50"
              >
                ✕ Cancelar
              </button>
              <button
                type="button"
                disabled={guardandoRegistro}
                onClick={handleConfirmarGuardado}
                className="flex-1 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg flex items-center justify-center disabled:bg-indigo-400"
              >
                {guardandoRegistro ? "⏳ Guardando..." : "✓ Publicar Artículo"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PortfolioPage;
