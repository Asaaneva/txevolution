import React, { useState } from "react";
import { usePortfolioForm } from "../hooks/usePortfolioForm";
import { LivePreviewCard } from "../components/admin/LivePreviewCard";
import { PortfolioForm } from "../components/admin/PortfolioForm";
import { PortfolioRow } from "../components/admin/PortfolioRow";

export const PortfolioPage = () => {
  const [proyectos, setProyectos] = useState([]);
  const [erroresValidacion, setErroresValidacion] = useState({});
  const [guardandoRegistro, setGuardandoRegistro] = useState(false);

  // Consumimos todo lo que tu hook ya hace perfectamente
  const {
    formData,
    isModalOpen,
    setIsModalOpen,
    handleInputChange,
    resetFormulario,
  } = usePortfolioForm();

  const handleVerVistaPrevia = (e) => {
    e.preventDefault();
    const nuevosErrores = {};

    if (!formData.destino) nuevosErrores.destino = true;

    if (formData.destino === "index") {
      if (!formData.tipoArticuloCat) nuevosErrores.tipoArticuloCat = true;
      if (!formData.subcategoriaUso) nuevosErrores.subcategoriaUso = true;
    }

    if (formData.destino === "categoria") {
      if (!formData.tipoArticuloCat) nuevosErrores.tipoArticuloCat = true;
      if (!formData.subcategoriaUso) nuevosErrores.subcategoriaUso = true;
      if (formData.subcategoriaUso === "Zapatos") {
        if (!formData.clasificacionCalzado)
          nuevosErrores.clasificacionCalzado = true;
        if (!formData.genero) nuevosErrores.genero = true;
      }
    }

    if (formData.destino === "producto") {
      if (!formData.nombre?.trim()) nuevosErrores.nombre = true;
      if (!formData.modelo?.trim()) nuevosErrores.modelo = true;
      if (!formData.genero) nuevosErrores.genero = true;
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

  // =================================================================
  // 🚀 PASO FINAL: Guardar los textos y la URL ya existente en la BD
  // =================================================================
  const handleConfirmarGuardado = async () => {
    try {
      setGuardandoRegistro(true);

      // Creamos el JSON con la estructura exacta que espera tu tabla "proyectos"
      const proyectoParaSupabase = {
        profile_id: "c20df547-0648-433b-85fe-d1912423a677", // Tu ID de administrador
        destino: formData.destino,
        nombre: formData.nombre || "Artículo de Vitrina",
        modelo: formData.modelo || "Genérico",
        descripcion: formData.descripcion || "",
        foto_url: formData.fotoUrl, // 👈 ¡Usamos la URL de Supabase que tu hook ya obtuvo!
        tipo_articulo: formData.tipoArticuloCat || "",
        subcategoria: formData.subcategoriaUso || "",
      };

      // Recuerda cambiar 'http://localhost:8080' por tu URL de CodeSandbox si trabajas remoto
      const resProyecto = await fetch("http://localhost:8000/api/proyectos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(proyectoParaSupabase),
      });

      if (!resProyecto.ok) {
        throw new Error(
          "El backend no pudo registrar el proyecto en la base de datos."
        );
      }

      const respuestaBD = await resProyecto.json();
      console.log("✅ Guardado con éxito en la base de datos:", respuestaBD);

      // Estructuramos el objeto mapeado para que PortfolioRow lo dibuje correctamente
      const nuevoProyectoTabla = {
        id: respuestaBD.data?.[0]?.id || Date.now(),
        nombre: proyectoParaSupabase.nombre,
        destino: proyectoParaSupabase.destino,
        modelo: proyectoParaSupabase.modelo,
        tipoArticuloCat: proyectoParaSupabase.tipo_articulo,
        subcategoriaUso: proyectoParaSupabase.subcategoria,
        fotoUrl: proyectoParaSupabase.foto_url, // 'fotoUrl' para que coincida con PortfolioRow
      };

      // Lo agregamos al listado de la pantalla
      setProyectos((prev) => [nuevoProyectoTabla, ...prev]);

      // Cerramos y limpiamos
      setIsModalOpen(false);
      resetFormulario();
      alert("¡Proyecto publicado con éxito en TXevolution!");
    } catch (error) {
      console.error("❌ Error al guardar datos de texto:", error);
      alert(`Error al guardar en base de datos: ${error.message}`);
    } finally {
      setGuardandoRegistro(false);
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
      {/* FORMULARIO */}
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

      {/* MODAL */}
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
