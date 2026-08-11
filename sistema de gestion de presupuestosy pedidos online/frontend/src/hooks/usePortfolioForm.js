import { useState } from "react";
import { proyectoService } from "../services/proyectoService";

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [proyectoEdicionId, setProyectoEdicionId] = useState(null);
  const [errores, setErrores] = useState({});

  // 📸 Estado para guardar el archivo físico real que se enviará al backend
  const [archivoFisicoReal, setArchivoFisicoReal] = useState(null);

  const registrarCambio = (campo, valor) => {
    setFormData((prev) => ({ ...prev, [campo]: valor }));
    if (errores[campo]) {
      setErrores((prev) => ({ ...prev, [campo]: false }));
    }
  };

  // 📸 Función especial para manejar cuando el usuario selecciona una foto local
  const manejarCambioFoto = (file) => {
    if (!file) return;

    // 1. Creamos una URL temporal para que la validación y la mini preview funcionen al instante
    const urlTemporal = URL.createObjectURL(file);

    // 2. Guardamos el archivo físico real para enviarlo luego a FastAPI
    setArchivoFisicoReal(file);

    // 3. Actualizamos formData.fotoUrl para que el validador dé luz verde
    setFormData((prev) => ({ ...prev, fotoUrl: urlTemporal }));

    if (errores.fotoUrl) {
      setErrores((prev) => ({ ...prev, fotoUrl: false }));
    }
  };

  const validarFormulario = () => {
    const nuevosErrores = {};

    if (!formData.destino) {
      nuevosErrores.destino = true;
    }

    if (formData.destino === "index" || formData.destino === "categoria") {
      if (!formData.tipoArticuloCat) nuevosErrores.tipoArticuloCat = true;
      if (!formData.subcategoriaUso) nuevosErrores.subcategoriaUso = true;

      if (
        formData.subcategoriaUso === "Zapatos" &&
        !formData.clasificacionCalzado
      ) {
        nuevosErrores.clasificacionCalzado = true;
      }
    }

    if (formData.destino === "producto") {
      if (!formData.nombre?.trim()) nuevosErrores.nombre = true;
      if (!formData.modelo?.trim()) nuevosErrores.modelo = true;
    }

    // 🛡️ Validamos directamente contra formData.fotoUrl (que ya tendrá la URL temporal o texto)
    if (!formData.fotoUrl) {
      nuevosErrores.fotoUrl = true;
    }

    setErrores(nuevosErrores);
    return nuevosErrores;
  };

  const handleVerVistaPrevia = (e) => {
    if (e && typeof e.preventDefault === "function") e.preventDefault();

    const errs = validarFormulario();

    if (Object.keys(errs).length > 0) {
      return false;
    }

    return true;
  };

  const resetFormulario = () => {
    setFormData(VALORES_INICIALES);
    setProyectoEdicionId(null);
    setArchivoFisicoReal(null); // Limpiamos el archivo físico
    setErrores({});
  };

  const prepararEdicion = (proyecto) => {
    setProyectoEdicionId(proyecto.id);
    setArchivoFisicoReal(null);
    setErrores({});
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

  const publicarProyecto = async () => {
    setGuardandoRegistro(true);
    try {
      let urlImagenFinal = formData.fotoUrl;

      // Si el usuario seleccionó un archivo físico nuevo de su PC, lo subimos al backend primero
      if (archivoFisicoReal) {
        const respuestaSubida = await proyectoService.subirImagen(
          archivoFisicoReal
        );
        urlImagenFinal =
          respuestaSubida.fotoUrl ||
          respuestaSubida.foto_url ||
          respuestaSubida.url ||
          urlImagenFinal;
      }

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

      if (proyectoEdicionId) {
        return await proyectoService.actualizar(proyectoEdicionId, payloadJson);
      } else {
        return await proyectoService.crear(payloadJson);
      }
    } catch (error) {
      console.error("❌ Error al publicar proyecto:", error);
      throw error;
    } finally {
      setGuardandoRegistro(false);
    }
  };

  const guardarCambiosFilaDirecto = async (id, camposModificados) => {
    try {
      if (!id || id === "undefined") throw new Error(`ID inválido: ${id}`);

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

      delete payloadJson.id;
      delete payloadJson._id;

      return await proyectoService.actualizar(id, payloadJson);
    } catch (error) {
      console.error("❌ Error en guardarCambiosFilaDirecto:", error);
      throw error;
    }
  };

  const eliminarProyecto = async (id) => {
    try {
      if (!id) throw new Error("ID requerido para la eliminación.");
      return await proyectoService.eliminar(id);
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
    errores,
    archivoFisicoReal,
    validarFormulario,
    setIsModalOpen,
    registrarCambio,
    manejarCambioFoto, // 👈 Conectada para tu componente de carga de foto
    handleVerVistaPrevia,
    resetFormulario,
    prepararEdicion,
    publicarProyecto,
    guardarCambiosFilaDirecto,
    eliminarProyecto,
  };
};