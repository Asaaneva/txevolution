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
  nombreArchivo: "",
};

export const usePortfolioForm = () => {
  const [formData, setFormData] = useState(VALORES_INICIALES);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [guardandoRegistro, setGuardandoRegistro] = useState(false);
  const [proyectoEdicionId, setProyectoEdicionId] = useState(null);

  // Cambiar dinámicamente propiedades del formulario
  const handleInputChange = (campo, valor) => {
    setFormData((prev) => ({
      ...prev,
      [campo]: valor,
    }));
  };

  // Limpiar el formulario por completo y salir de modo edición
  const resetFormulario = () => {
    setFormData(VALORES_INICIALES);
    setProyectoEdicionId(null);
  };

  // Cargar datos en el formulario al presionar "Editar" en la fila
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
      nombreArchivo: "",
    });
  };

  // Guardar o Actualizar el Registro en FastAPI
  const publicarProyecto = async (archivoFoto) => {
    setGuardandoRegistro(true);
    try {
      const dataToSend = new FormData();
      dataToSend.append("nombre", formData.nombre);
      dataToSend.append("destino", formData.destino);
      dataToSend.append("modelo", formData.modelo);
      dataToSend.append("descripcion", formData.descripcion);
      dataToSend.append("tipo_articulo", formData.tipoArticuloCat);
      dataToSend.append("subcategoria", formData.subcategoriaUso);
      dataToSend.append("genero", formData.genero);
      dataToSend.append("clasificacion_calzado", formData.clasificacionCalzado);

      // Si hay un archivo binario nuevo, se envía
      if (archivoFoto) {
        dataToSend.append("file", archivoFoto);
      }

      // Determinar la URL y el método HTTP correcto de manera dinámica
      const url = proyectoEdicionId
        ? `http://localhost:8000/api/proyectos/${proyectoEdicionId}`
        : "http://localhost:8000/api/proyectos";

      const method = proyectoEdicionId ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        body: dataToSend, // Al pasar un FormData, el navegador asigna los encabezados multipart automáticamente
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.detail || "Error en la operación con el servidor."
        );
      }

      return await response.json();
    } catch (error) {
      console.error("❌ Error en publicarProyecto:", error);
      throw error;
    } finally {
      setGuardandoRegistro(false);
    }
  };

  // Eliminar un Registro de la BD
  const eliminarProyecto = async (id, urlFoto) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/proyectos/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error(
          "No se pudo eliminar el artículo del servidor backend."
        );
      }
      return true;
    } catch (error) {
      console.error("❌ Error en eliminarProyecto:", error);
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
    eliminarProyecto,
  };
};
