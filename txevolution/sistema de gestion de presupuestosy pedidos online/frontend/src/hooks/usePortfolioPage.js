import { useEffect, useState } from "react";
import { proyectoService } from "../services/proyectoService";
import { usePortfolioForm } from "./usePortfolioForm";
import { usePortfolioModal } from "./usePortfolioModal";

export const usePortfolioPage = () => {
  const [proyectos, setProyectos] = useState([]);

  const cargarVitrinaDesdeElBackend = async () => {
    try {
      const datosBD = await proyectoService.obtenerTodos();
      const proyectosMapeados = datosBD.map((p) => ({
        id: p.id,
        nombre: p.nombre || "Artículo sin nombre",
        destino: p.destino,
        modelo: p.modelo || "Genérico",
        descripcion: p.descripcion,
        tipoArticuloCat: p.tipo_articulo || "cuero",
        subcategoriaUso: p.subcategoria || "",
        fotoUrl: p.foto_url || "",
        genero: p.genero || "",
        clasificacionCalzado: p.clasificacion_calzado || "",
        estado: p.estado || "activo",
      }));
      setProyectos(proyectosMapeados);
    } catch (error) {
      console.error("❌ Error crítico al consultar el backend:", error);
    }
  };

  const portfolioForm = usePortfolioForm();
  const portfolioModal = usePortfolioModal(
    portfolioForm.resetFormulario,
    cargarVitrinaDesdeElBackend
  );

  useEffect(() => {
    cargarVitrinaDesdeElBackend();
  }, []);

  // 🛡️ Evaluación de duplicados con logs de diagnóstico
  const verificarSiYaEstaPublicado = () => {
    if (portfolioForm.proyectoEdicionId) return false;

    const { destino, nombre, modelo, subcategoriaUso, tipoArticuloCat, clasificacionCalzado } = portfolioForm.formData;

    console.log("🔍 Intentando publicar/verificar:", { destino, nombre, modelo });
    console.log("📋 Proyectos actuales en memoria:", proyectos);

    return proyectos.some((p) => {
      // Ignoramos registros sin nombre para que no bloqueen
      if (!p.nombre || p.nombre === "Artículo sin nombre") return false;

      if (destino === "producto" || destino === "detalles") {
        const esDuplicado =
          p.destino === destino &&
          p.nombre?.trim().toLowerCase() === nombre?.trim().toLowerCase() &&
          p.modelo?.trim().toLowerCase() === modelo?.trim().toLowerCase();

        if (esDuplicado) {
          console.warn("⚠️ ¡Conflicto de duplicado detectado con el proyecto ID:", p.id, p);
        }
        return esDuplicado;
      }
      
      const esDuplicadoCat =
        p.destino === destino &&
        p.subcategoriaUso === subcategoriaUso &&
        p.tipoArticuloCat === tipoArticuloCat &&
        (!clasificacionCalzado || p.clasificacionCalzado === clasificacionCalzado);

      if (esDuplicadoCat) {
        console.warn("⚠️ ¡Conflicto de categoría detectado con el proyecto ID:", p.id, p);
      }
      return esDuplicadoCat;
    });
  };

  // 🌉 Puente que conecta los datos del formulario con la ejecución del modal
  const handleConfirmarGuardado = async () => {
    if (verificarSiYaEstaPublicado()) {
      alert("⚠️ El proyecto ya está publicado. Puedes buscarlo en la lista inferior para editarlo o borrarlo de allí.");
      portfolioModal.setIsModalOpen(false);
      return;
    }

    await portfolioModal.ejecutarPublicarProyecto(
      portfolioForm.formData,
      portfolioForm.archivoFisicoReal,
      portfolioForm.proyectoEdicionId
    );
  };

  const handleSubmitForm = (e) => {
    if (e && typeof e.preventDefault === "function") e.preventDefault();

    const esValido = portfolioForm.handleVerVistaPrevia(e);

    if (
      esValido === false ||
      Object.keys(portfolioForm.validarFormulario()).length > 0
    ) {
      return;
    }

    portfolioModal.setIsModalOpen(true);
  };

  const handleEliminar = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este artículo?")) {
      try {
        await proyectoService.eliminar(id);
        
        // 🔄 Actualización inmediata del estado local filtrando el ID borrado
        setProyectos((prevProyectos) => prevProyectos.filter((p) => p.id !== id));
        
        alert("🎉 Artículo eliminado correctamente.");
        
        // Sincronizamos de nuevo con el backend
        await cargarVitrinaDesdeElBackend();
      } catch (error) {
        alert("Error al eliminar: " + error.message);
      }
    }
  };

  return {
    proyectos,
    cargarVitrinaDesdeElBackend,
    handleEliminar,
    handleSubmitForm,
    handleConfirmarGuardado,
    handleGuardarCambiosFila: portfolioForm.guardarCambiosFilaDirecto,
    ...portfolioForm,
    ...portfolioModal,
  };
};