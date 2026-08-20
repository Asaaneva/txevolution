//modal de vistaprevia
import { useState } from "react";
import { proyectoService } from "../services/proyectoService";

export const usePortfolioModal = (resetFormulario, cargarVitrina) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [guardandoRegistro, setGuardandoRegistro] = useState(false);

  // 🚀 Lógica de negocio secuencial coordinada por el hook del modal
  const ejecutarPublicarProyecto = async (
    formData,
    archivoFisicoFoto,
    proyectoEdicionId
  ) => {
    setGuardandoRegistro(true);
    try {
      let finalFotoUrl = formData.fotoUrl || "";

      // 1️⃣ Si el usuario cargó un archivo nuevo, invocamos al servicio de imágenes primero
      if (archivoFisicoFoto) {
        const respuestaImagen = await proyectoService.subirImagen(
          archivoFisicoFoto
        );
        // FastAPI habitualmente retorna { foto_url: "..." } o { url: "..." }
        finalFotoUrl =
          respuestaImagen.fotoUrl ||
          respuestaImagen.foto_url ||
          respuestaImagen.url;
      }

      // 2️⃣ Construimos el JSON plano estructurado en snake_case para FastAPI
      const payloadBackend = {
        destino: formData.destino || "",
        nombre: formData.nombre || "",
        modelo: formData.modelo || "",
        descripcion: formData.descripcion || "",
        tipo_articulo: formData.tipoArticuloCat || "cuero",
        subcategoria: formData.subcategoriaUso || "",
        foto_url: finalFotoUrl,
        genero: formData.genero || "",
        clasificacion_calzado: formData.clasificacionCalzado || "",
      };

      // 3️⃣ Decidimos si llamamos a PUT o POST a través del servicio puro de red
      if (proyectoEdicionId) {
        await proyectoService.actualizar(proyectoEdicionId, payloadBackend);
        alert("¡Artículo actualizado con éxito!");
      } else {
        await proyectoService.crear(payloadBackend);
        alert("¡Artículo publicado con éxito!");
      }

      // 4️⃣ Limpieza coordinada de estados y recarga instantánea de la interfaz gráfica
      setIsModalOpen(false);
      resetFormulario();
      await cargarVitrina();
    } catch (error) {
      alert(`Error al consolidar los cambios: ${error.message}`);
    } finally {
      setGuardandoRegistro(false);
    }
  };

  return {
    isModalOpen,
    guardandoRegistro,
    setIsModalOpen,
    ejecutarPublicarProyecto,
  };
};
