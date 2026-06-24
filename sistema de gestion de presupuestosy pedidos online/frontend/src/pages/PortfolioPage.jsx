import React, { useState, useEffect } from "react";
import { usePortfolioForm } from "../hooks/usePortfolioForm";
import { LivePreviewCard } from "../components/admin/LivePreviewCard";
import { PortfolioForm } from "../components/admin/PortfolioForm";
import { PortfolioRow } from "../components/admin/PortfolioRow";

export const PortfolioPage = () => {
  const [proyectos, setProyectos] = useState([]);
  const [erroresValidacion, setErroresValidacion] = useState({});
  const [archivoFisicoFoto, setArchivoFisicoFoto] = useState(null);

  const {
    formData,
    isModalOpen,
    guardandoRegistro,
    proyectoEdicionId,
    setIsModalOpen,
    handleInputChange,
    resetFormulario,
    prepararEdicion,
    publicarProyecto,
    eliminarProyecto,
  } = usePortfolioForm();

  // 🔄 Cargar y transformar datos del Backend centralizados
  const cargarVitrinaDesdeElBackend = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/proyectos");
      if (!res.ok)
        throw new Error("No se pudo conectar con el servidor central.");
      const datosBD = await res.json();

      const proyectosMapeados = datosBD.map((p) => ({
        id: p.id,
        nombre: p.nombre,
        destino: p.destino,
        modelo: p.modelo,
        descripcion: p.descripcion,
        tipoArticuloCat: p.tipo_articulo,
        subcategoriaUso: p.subcategoria,
        fotoUrl: p.foto_url,
        // 🛠️ Agregados de forma segura por si tu base de datos o modelos los usan
        genero: p.genero || "",
        clasificacionCalzado: p.clasificacion_calzado || "",
      }));

      setProyectos(proyectosMapeados);
    } catch (error) {
      console.error("❌ Error al hidratar el listado:", error);
    }
  };

  useEffect(() => {
    cargarVitrinaDesdeElBackend();
  }, []);

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

    // Si no estamos editando, la foto física es obligatoria. Al editar, es opcional.
    if (!archivoFisicoFoto && !proyectoEdicionId) nuevosErrores.foto = true;

    if (Object.keys(nuevosErrores).length > 0) {
      setErroresValidacion(nuevosErrores);
      setTimeout(() => setErroresValidacion({}), 3000);
      return;
    }

    setErroresValidacion({});
    setIsModalOpen(true);
  };

  // 🛠️ FIX: Sincronización exacta del ciclo de guardado/edición
  const handleConfirmarGuardado = async () => {
    try {
      // 1. Enviamos la petición a FastAPI (POST o PUT automático según proyectoEdicionId)
      await publicarProyecto(archivoFisicoFoto);

      // Guardamos una referencia local para el alert antes de resetear
      const eraEdicion = !!proyectoEdicionId;

      // 2. Limpieza de estados del contenedor de manera ordenada
      setIsModalOpen(false);
      setArchivoFisicoFoto(null);
      resetFormulario(); // Limpia campos y desactiva modo edición en el hook

      // 3. Traer datos frescos de la Base de Datos
      await cargarVitrinaDesdeElBackend();

      alert(
        eraEdicion
          ? "¡Artículo actualizado con éxito!"
          : "¡Artículo publicado con éxito!"
      );
    } catch (error) {
      alert(`Error al guardar: ${error.message}`);
    }
  };

  const handleEliminar = async (id, urlFoto) => {
    if (
      window.confirm(
        "¿Estás seguro de que deseas eliminar este artículo de la vitrina?"
      )
    ) {
      try {
        await eliminarProyecto(id, urlFoto);
        alert("🎉 Artículo e imagen eliminados correctamente.");
        await cargarVitrinaDesdeElBackend();
      } catch (error) {
        alert("Error al eliminar: " + error.message);
      }
    }
  };

  const registrarCambio = (campo, valor) => {
    if (campo === "fotoUrl") {
      if (valor instanceof File) {
        setArchivoFisicoFoto(valor);
        const urlVisualTemporal = URL.createObjectURL(valor);
        handleInputChange("fotoUrl", urlVisualTemporal);
        handleInputChange("nombreArchivo", valor.name);
      } else {
        handleInputChange("fotoUrl", valor);
      }
    } else {
      handleInputChange(campo, valor);
    }

    if (erroresValidacion[campo]) {
      setErroresValidacion((prev) => ({ ...prev, [campo]: false }));
    }
  };

  return (
    <div className="w-full animate-fadeIn">
      {/* Formulario principal */}
      <PortfolioForm
        formData={formData}
        errores={erroresValidacion}
        registrarCambio={registrarCambio}
        onSubmit={handleVerVistaPrevia}
        isEditing={!!proyectoEdicionId}
        onCancelarEdicion={resetFormulario}
      />

      {/* Tabla de listado conectado */}
      <div className="bg-white rounded-xl border border-stone-200/80 shadow-xs p-6 mt-6">
        <h3 className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-4">
          Listado de Proyectos Publicados{" "}
          {proyectoEdicionId && (
            <span className="text-amber-500 font-normal normal-case">
              (Modo edición activo)
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
                    onEditar={() => prepararEdicion(p)}
                    onEliminar={() => handleEliminar(p.id, p.fotoUrl)}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de confirmación con LivePreview */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-xl border border-stone-200 max-w-[390px] w-full p-6 flex flex-col items-center gap-5">
            <div className="w-full text-center border-b border-stone-100 pb-3">
              <h3 className="text-sm font-bold text-stone-900">
                {proyectoEdicionId
                  ? "👁️ Confirmar Cambios de Edición"
                  : "👁️ Confirmación de Vitrina"}
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
                className="flex-1 py-2 text-xs font-bold text-stone-500 bg-stone-100 rounded-lg border border-stone-200"
              >
                ✕ Cancelar
              </button>
              <button
                type="button"
                disabled={guardandoRegistro}
                onClick={handleConfirmarGuardado}
                className="flex-1 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg flex items-center justify-center disabled:bg-indigo-400"
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

export default PortfolioPage;
