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

  // ==========================================
  // 1. PUBLICAR O EDITAR DESDE EL MODAL COMPLETÓ
  // ==========================================
  const publicarProyecto = async (archivoFoto) => {
    setGuardandoRegistro(true);
    try {
      let urlImagenFinal = formData.fotoUrl;

      if (archivoFoto) {
        const bodyImagen = new FormData();
        bodyImagen.append("file", archivoFoto);

        const resImagen = await fetch(
          "https://fuzzy-couscous-pjpvr5wrj675f7xw6-8000.app.github.dev/api/upload-imagen",
          {
            method: "POST",
            body: bodyImagen,
          }
        );

        if (!resImagen.ok) throw new Error("Fallo al subir la imagen.");
        const dataImagen = await resImagen.json();
        urlImagenFinal = dataImagen.fotoUrl;
      }

      // Mapeamos los campos al formato snake_case que exige ProyectoData en FastAPI
      const payloadJson = {
        destino: formData.destino,
        nombre: formData.nombre || "",
        modelo: formData.modelo || "",
        descripcion: formData.descripcion || "",
        foto_url: urlImagenFinal || "",
        tipo_articulo: formData.tipoArticuloCat || "cuero",
        subcategoria: formData.subcategoriaUso || "",
        genero: formData.genero || "",
        clasificacion_calzado: formData.clasificacionCalzado || "",
      };

      const url = proyectoEdicionId
        ? `https://fuzzy-couscous-pjpvr5wrj675f7xw6-8000.app.github.dev/api/proyectos/api/proyectos/${proyectoEdicionId}`
        : "https://fuzzy-couscous-pjpvr5wrj675f7xw6-8000.app.github.dev/api/proyectos/api/proyectos";

      const response = await fetch(url, {
        method: proyectoEdicionId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payloadJson),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || "Error al procesar el proyecto.");
      }

      return await response.json();
    } catch (error) {
      console.error("❌ Error al publicar proyecto:", error);
      throw error;
    } finally {
      setGuardandoRegistro(false);
    }
  };

  // ==========================================
  // 2. GUARDAR CAMBIOS DIRECTO EN LA FILA
  // ==========================================
  const guardarCambiosFilaDirecto = async (id, camposModificados) => {
    try {
      if (!id || id === "undefined") {
        throw new Error(`ID inválido: ${id}`);
      }

      // Molde exacto con guiones bajos que espera tu FastAPI y tu Supabase
      const payloadJson = {
        profile_id:
          camposModificados.profile_id ||
          "c20df547-0648-433b-85fe-d1912423a677",
        destino: camposModificados.destino,
        nombre: camposModificados.nombre || null,
        modelo: camposModificados.modelo || null,
        descripcion: camposModificados.descripcion || null,
        foto_url: camposModificados.fotoUrl || null,
        tipo_articulo: camposModificados.tipoArticuloCat || null,
        subcategoria: camposModificados.subcategoriaUso || null,
        genero: camposModificados.genero || null,
        clasificacion_calzado: camposModificados.clasificacionCalzado || null,
        estado: camposModificados.estado || "activo",
      };

      // 🚨 ELIMINACIÓN CRUCIAL: Limpiamos cualquier rastro de ID dentro del JSON
      delete payloadJson.id;
      delete payloadJson._id;

      const res = await fetch(
        `https://fuzzy-couscous-pjpvr5wrj675f7xw6-8000.app.github.dev/api/proyectos/api/proyectos/${parseInt(id, 10)}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payloadJson),
        }
      );

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        const mensajeLimpio =
          typeof errorData.detail === "object"
            ? JSON.stringify(errorData.detail)
            : errorData.detail;
        throw new Error(mensajeLimpio || "Error en el servidor local.");
      }

      return await res.json();
    } catch (error) {
      console.error("❌ Error en guardarCambiosFilaDirecto:", error);
      throw error;
    }
  };

  // ==========================================
  // 3. ELIMINAR PROYECTO (BAJA LÓGICA VÍA DELETE)
  // ==========================================
  const eliminarProyecto = async (id) => {
    try {
      if (!id) throw new Error("ID requerido para la eliminación.");

      // 🚨 CORREGIDO: Forzamos la conversión a un número entero limpio en base 10
      const idNumerico = parseInt(id, 10);

      console.log(
        "🗑️ Intentando dar de baja el proyecto con ID numérico:",
        idNumerico
      );

      // Usamos la variable numérica para construir la URL de FastAPI
      const response = await fetch(
        `https://fuzzy-couscous-pjpvr5wrj675f7xw6-8000.app.github.dev/api/proyectos/api/proyectos/${idNumerico}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) {
        const datosRespuesta = await response.json().catch(() => ({}));
        throw new Error(
          datosRespuesta.detail ||
            `Error en el servidor (Código ${response.status})`
        );
      }

      return true;
    } catch (error) {
      console.error("❌ Error al eliminar proyecto:", error);
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
