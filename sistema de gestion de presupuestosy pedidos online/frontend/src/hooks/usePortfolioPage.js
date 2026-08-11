// ✅ EL HOCH /usePortfolioPage.js DEBE QUEDAR SOLO CON LÓGICA Y ESTADO:
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

  const handleSubmitForm = (e) => {
    if (e && typeof e.preventDefault === "function") e.preventDefault();

    // 1. Ejecuta la validación que viene de portfolioForm
    const esValido = portfolioForm.handleVerVistaPrevia(e);

    // 2. Si hay errores, se detiene y NO abre el modal
    if (
      esValido === false ||
      Object.keys(portfolioForm.validarFormulario()).length > 0
    ) {
      return;
    }

    // 3. 🚨 ¡ESTO ES LO QUE FALTABA! Si todo está OK, abre el modal de vista previa
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
    ...portfolioForm,
    ...portfolioModal,
  };
};
