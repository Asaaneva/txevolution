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
    guardarCambiosFilaDirecto,
  } = usePortfolioForm();

  const cargarVitrinaDesdeElBackend = async () => {
    try {
const res = await fetch(`${import.meta.env.VITE_API_URL}/api/proyectos`);    
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

    if (!archivoFisicoFoto && !proyectoEdicionId) nuevosErrores.foto = true;

    if (Object.keys(nuevosErrores).length > 0) {
      setErroresValidacion(nuevosErrores);
      setTimeout(() => setErroresValidacion({}), 3000);
      return;
    }

    setErroresValidacion({});
    setIsModalOpen(true);
  };

  const handleConfirmarGuardado = async () => {
    try {
      await publicarProyecto(archivoFisicoFoto);
      const eraEdicion = !!proyectoEdicionId;

      setIsModalOpen(false);
      setArchivoFisicoFoto(null);
      resetFormulario();

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

  const handleGuardarCambiosFila = async (id, camposModificados) => {
    try {
      const respuesta = await guardarCambiosFilaDirecto(id, camposModificados);
      
      if (respuesta && respuesta.status === "success") {
        alert("🎉 Cambios guardados dinámicamente.");
  
        // 🚀 EN MEMORIA: Buscamos el proyecto en el estado de React y lo actualizamos al instante
        setProyectos((prevProyectos) =>
          prevProyectos.map((proyecto) =>
            proyecto.id === id ? { ...proyecto, ...camposModificados } : proyecto
          )
        );
      }
    } catch (error) {
      alert("No se pudieron consolidar los cambios: " + error.message);
    }
  };

  const handleEliminar = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este artículo?")) {
      try {
        // Forzamos el await para esperar que el backend responda con éxito en Supabase
        const exito = await eliminarProyecto(id);

        if (exito) {
          alert("🎉 Artículo eliminado correctamente.");
          await cargarVitrinaDesdeElBackend(); // Rehidrata la tabla inmediatamente
        }
      } catch (error) {
        alert("Error al eliminar: " + error.message);
      }
    }
  }; // <--- ¡AQUÍ ESTABA EL ERROR! Faltaba cerrar esta llave

  const registrarCambio = (campo, valor) => {
    if (campo === "fotoUrl") {
      if (valor instanceof File) {
        setArchivoFisicoFoto(valor);
        handleInputChange("fotoUrl", URL.createObjectURL(valor));
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
      <PortfolioForm
        formData={formData}
        errores={erroresValidacion}
        registrarCambio={registrarCambio}
        onSubmit={handleVerVistaPrevia}
        isEditing={!!proyectoEdicionId}
        onCancelarEdicion={resetFormulario}
      />

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
