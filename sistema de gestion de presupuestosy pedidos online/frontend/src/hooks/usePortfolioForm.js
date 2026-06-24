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

  // 👁️ ESTADOS COMPLEMENTARIOS PARA QUE EL FRONTEND NO LOGEE "UNDEFINED"
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [proyectoEdicionId, setProyectoEdicionId] = useState(null);

  const handleInputChange = (campo, valor) => {
    setFormData((prev) => ({ ...prev, [campo]: valor }));
  };

  const resetFormulario = () => {
    setFormData(VALORES_INICIALES);
    setProyectoEdicionId(null);
  };

  // Carga los datos de un proyecto existente en el formulario de arriba
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
      const dataToSend = new FormData();
      dataToSend.append("nombre", formData.nombre);
      dataToSend.append("destino", formData.destino);
      dataToSend.append("modelo", formData.modelo);
      dataToSend.append("descripcion", formData.descripcion || "");
      dataToSend.append("tipo_articulo", formData.tipoArticuloCat);
      dataToSend.append("subcategoria", formData.subcategoriaUso);
      dataToSend.append("genero", formData.genero);
      dataToSend.append("clasificacion_calzado", formData.clasificacionCalzado);

      if (archivoFoto) {
        dataToSend.append("file", archivoFoto);
      }

      const url = proyectoEdicionId
        ? `http://localhost:8000/api/proyectos/${proyectoEdicionId}`
        : "http://localhost:8000/api/proyectos";

      const method = proyectoEdicionId ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        body: dataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || "Error al procesar el registro.");
      }

      return await response.json();
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      setGuardandoRegistro(false);
    }
  };

  // Guarda los cambios instantáneos cuando editas directamente desde la fila de la tabla
  const guardarCambiosFilaDirecto = async (id, camposModificados) => {
    setGuardandoRegistro(true);
    try {
      const dataToSend = new FormData();
      dataToSend.append("nombre", camposModificados.nombre || "");
      dataToSend.append("destino", camposModificados.destino || "");
      dataToSend.append("modelo", camposModificados.modelo || "");
      dataToSend.append("descripcion", camposModificados.descripcion || "");
      dataToSend.append(
        "tipo_articulo",
        camposModificados.tipoArticuloCat || ""
      );
      dataToSend.append(
        "subcategoria",
        camposModificados.subcategoriaUso || ""
      );
      dataToSend.append("genero", camposModificados.genero || "");
      dataToSend.append(
        "clasificacion_calzado",
        camposModificados.clasificacionCalzado || ""
      );

      if (camposModificados.archivoFisico) {
        dataToSend.append("file", camposModificados.archivoFisico);
      }

      const response = await fetch(
        `http://localhost:8000/api/proyectos/${id}`,
        {
          method: "PUT",
          body: dataToSend,
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || "Error al actualizar la fila.");
      }

      return await response.json();
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      setGuardandoRegistro(false);
    }
  };

  // Eliminar proyecto por ID numérico limpio
  const eliminarProyecto = async (id) => {
    try {
      const idLimpio = parseInt(id, 10);
      if (isNaN(idLimpio)) throw new Error("ID no válido.");

      const response = await fetch(
        `http://localhost:8000/api/proyectos/${idLimpio}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.detail || `Error ${response.status}`);
      }
      return true;
    } catch (error) {
      console.error(error);
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
