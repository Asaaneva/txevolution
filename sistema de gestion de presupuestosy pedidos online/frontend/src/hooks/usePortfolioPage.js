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

  // esto era el error de no guardado conecta los datos del formulario con la ejecución del modal
  const handleConfirmarGuardado = async () => {
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
        alert("🎉 Artículo eliminado correctamente.");
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
    ...portfolioForm,
    ...portfolioModal,
  };
};