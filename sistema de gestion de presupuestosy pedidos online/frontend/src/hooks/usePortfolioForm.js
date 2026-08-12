// src/hooks/usePortfolioForm.js
import { useState } from "react";
import { proyectoService } from "../services/proyectoService";
import { validarFormularioPortfolio } from "../utils/portfolioValidations";

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

const PROFILE_ID_DEFAULT = "c20df547-0648-433b-85fe-d1912423a677";

export const usePortfolioForm = () => {
  const [formData, setFormData] = useState(VALORES_INICIALES);
  const [guardandoRegistro, setGuardandoRegistro] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [proyectoEdicionId, setProyectoEdicionId] = useState(null);
  const [errores, setErrores] = useState({});
  const [archivoFisicoReal, setArchivoFisicoReal] = useState(null);

  const registrarCambio = (campo, valor) => {
    setFormData((prev) => ({ ...prev, [campo]: valor }));
    if (errores[campo]) {
      setErrores((prev) => ({ ...prev, [campo]: false }));
    }
  };

  const manejarCambioFoto = (file) => {
    if (!file) return;
    const urlTemporal = URL.createObjectURL(file);
    setArchivoFisicoReal(file);
    setFormData((prev) => ({ ...prev, fotoUrl: urlTemporal }));
    if (errores.fotoUrl) {
      setErrores((prev) => ({ ...prev, fotoUrl: false }));
    }
  };

  const validarFormulario = () => {
    const errs = validarFormularioPortfolio(formData);
    setErrores(errs);
    return errs;
  };

  const handleVerVistaPrevia = (e) => {
    if (e && typeof e.preventDefault === "function") e.preventDefault();
    const errs = validarFormulario();
    return Object.keys(errs).length === 0;
  };

  const resetFormulario = () => {
    setFormData(VALORES_INICIALES);
    setProyectoEdicionId(null);
    setArchivoFisicoReal(null);
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

  const obtenerUrlImagenFinal = async () => {
    if (!archivoFisicoReal) return formData.fotoUrl;
    const respuestaSubida = await proyectoService.subirImagen(archivoFisicoReal);
    return (
      respuestaSubida.fotoUrl ||
      respuestaSubida.foto_url ||
      respuestaSubida.url ||
      formData.fotoUrl
    );
  };

  const construirPayload = (urlImagenFinal) => ({
    profile_id: PROFILE_ID_DEFAULT,
    destino: formData.destino,
    nombre: formData.nombre || null,
    modelo: formData.modelo || null,
    descripcion: formData.descripcion || null,
    foto_url: urlImagenFinal || null,
    tipo_articulo: formData.tipoArticuloCat || null,
    subcategoria: formData.subcategoriaUso || null,
    genero: formData.genero || null,
    clasificacion_calzado: formData.clasificacionCalzado || null,
  });

  const publicarProyecto = async () => {
    setGuardandoRegistro(true);
    try {
      const urlImagenFinal = await obtenerUrlImagenFinal();
      const payloadJson = construirPayload(urlImagenFinal);

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
        profile_id: camposModificados.profile_id || PROFILE_ID_DEFAULT,
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
    manejarCambioFoto,
    handleVerVistaPrevia,
    resetFormulario,
    prepararEdicion,
    publicarProyecto,
    guardarCambiosFilaDirecto,
    eliminarProyecto,
  };
};