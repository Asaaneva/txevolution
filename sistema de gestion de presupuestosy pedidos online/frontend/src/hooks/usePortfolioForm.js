import { useState } from "react";

const VALORES_INICIALES = {
  nombre: "",
  destino: "",
  modelo: "",
  descripcion: "",
  tipoArticuloCat: "",
  subcategoriaUso: "",
  genero: "",
  clasificacionCalzado: "",
  fotoUrl: "",
};

export const usePortfolioForm = () => {
  const [formData, setFormData] = useState(VALORES_INICIALES);
  const [guardandoRegistro, setGuardandoRegistro] = useState(false);

  // Estados complementarios para la interfaz
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [proyectoEdicionId, setProyectoEdicionId] = useState(null);

  const handleInputChange = (campo, valor) => {
    setFormData((prev) => ({ ...prev, [campo]: valor }));
  };

  const resetFormulario = () => {
    setFormData(VALORES_INICIALES);
    setProyectoEdicionId(null);
  };

  const prepararEdicion = (proyecto) => {
    setProyectoEdicionId(proyecto.id);
    setFormData({
      nombre: proyecto.nombre || "",
      destino: proyecto.destino || "",
      modelo: proyecto.modelo || "",
      descripcion: proyecto.descripcion || "",
      tipoArticuloCat: proyecto.tipoArticuloCat || "",
      subcategoriaUso: proyecto.subcategoriaUso || "",
      genero: proyecto.genero || "",
      clasificacionCalzado: proyecto.clasificacionCalzado || "",
      fotoUrl: proyecto.fotoUrl || "",
    });
  };

  // Acción para el botón Publicar/Guardar del formulario principal
  const publicarProyecto = async (archivoFoto) => {
    setGuardandoRegistro(true);
    try {
      let urlImagenFinal = formData.fotoUrl;

      // 1. Si el usuario subió un archivo nuevo, lo enviamos primero al bucket
      if (archivoFoto) {
        const bodyImagen = new FormData();
        bodyImagen.append("file", archivoFoto);

        const resImagen = await fetch("http://localhost:8000/upload-imagen", {
          method: "POST",
          body: bodyImagen,
        });

        if (!resImagen.ok)
          throw new Error("Fallo al subir la imagen al almacén.");
        const dataImagen = await resImagen.json();
        urlImagenFinal = dataImagen.fotoUrl; // Guardamos el enlace público generado
      }

      // 2. Construimos el JSON limpio mapeado idénticamente a ProyectoData en Pydantic
      const payloadJson = {
        nombre: formData.nombre,
        destino: formData.destino,
        modelo: formData.modelo,
        descripcion: formData.descripcion || "",
        tipoArticuloCat: formData.tipoArticuloCat,
        subcategoriaUso: formData.subcategoriaUso,
        genero: formData.genero,
        clasificacionCalzado: formData.clasificacionCalzado,
        fotoUrl: urlImagenFinal,
      };

      // CORREGIDO: Eliminamos el '/api' fantasma de las URLs
      const url = proyectoEdicionId
        ? `http://localhost:8000/proyectos/${proyectoEdicionId}`
        : "http://localhost:8000/proyectos";

      const method = proyectoEdicionId ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payloadJson),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || "Error al procesar el registro.");
      }

      return await response.json();
    } catch (error) {
      console.error("❌ Error al publicar proyecto:", error);
      throw error;
    } finally {
      setGuardandoRegistro(false);
    }
  };

  // Guarda los cambios instantáneos cuando editas directamente desde la fila de la tabla
  const guardarCambiosFilaDirecto = async (id, camposModificados) => {
    setGuardandoRegistro(true);
    try {
      // CORREGIDO: Enviamos JSON en lugar de FormData para evitar el error 422
      const response = await fetch(`http://localhost:8000/proyectos/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(camposModificados),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || "Error al actualizar la fila.");
      }

      return await response.json();
    } catch (error) {
      console.error("❌ Error en edición rápida:", error);
      throw error;
    } finally {
      setGuardandoRegistro(false);
    }
  };

  // Eliminar proyecto por ID aplicando baja lógica
  const eliminarProyecto = async (id) => {
    try {
      if (!id) throw new Error("ID requerido para auditoría.");

      const response = await fetch(`http://localhost:8000/proyectos/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const datosRespuesta = await response.json().catch(() => ({}));
        const mensajeLimpio =
          typeof datosRespuesta.detail === "object"
            ? JSON.stringify(datosRespuesta.detail)
            : datosRespuesta.detail;

        throw new Error(
          mensajeLimpio || `Fallo en el servidor (Código ${response.status})`
        );
      }

      return true;
    } catch (error) {
      console.error("❌ Error en el hook al aplicar borrado lógico:", error);
      throw error;
    }
  };

  return {
    formData,
    isModalOpen,
    guardandoRegistro,
    proyectoEdicionId,
    setIsModalOpen,
    handleInputChange,
    resetFormulario,
    prepararEdicion,
    publicarProyecto,
    guardarCambiosFilaDirecto,
    eliminarProyecto,
  };
};
