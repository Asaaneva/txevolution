// src/hooks/usePortfolioForm.js
import { useState } from "react";

export const usePortfolioForm = () => {
  const [formData, setFormData] = useState({
    destino: "",
    nombre: "",
    modelo: "",
    descripcion: "",
    fotoUrl: "",
    tipoArticuloCat: "",
    subcategoriaUso: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [guardandoRegistro, setGuardandoRegistro] = useState(false);

  const handleInputChange = (campo, valor) => {
    setFormData((prev) => ({ ...prev, [campo]: valor }));
  };

  const resetFormulario = () => {
    setFormData({
      destino: "",
      nombre: "",
      modelo: "",
      descripcion: "",
      fotoUrl: "",
      tipoArticuloCat: "",
      subcategoriaUso: "",
    });
  };

  // 🚀 FUNCIÓN INTEGRADA CON SUBIDA DE IMAGEN WEBP Y BASE DE DATOS
  const publicarProyecto = async (archivoFisicoFoto) => {
    if (!archivoFisicoFoto) {
      throw new Error("Es obligatorio seleccionar una imagen real.");
    }

    setGuardandoRegistro(true);
    try {
      // 📸 PASO 1: Subir el archivo binario puro a FastAPI para compresión e ir a Supabase Storage
      const formDataImagen = new FormData();
      formDataImagen.append("file", archivoFisicoFoto);

      const resImagen = await fetch("http://localhost:8000/api/upload-imagen", {
        method: "POST",
        body: formDataImagen,
      });

      if (!resImagen.ok) {
        throw new Error("Error al procesar y subir la imagen al Storage.");
      }

      const datosImagen = await resImagen.json();
      const urlPublicaRealWebp = datosImagen.fotoUrl; // URL definitiva .webp

      // 📝 PASO 2: Estructurar el JSON final usando la URL real de la imagen
      const proyectoParaSupabase = {
        profile_id: "c20df547-0648-433b-85fe-d1912423a677",
        destino: formData.destino,
        nombre: formData.nombre || "Artículo de Vitrina",
        modelo: formData.modelo || "Genérico",
        descripcion: formData.descripcion || "",
        foto_url: urlPublicaRealWebp, // <--- GUARDAMOS LA URL REAL EN LA DB, NO EL BLOB
        tipo_articulo: formData.tipoArticuloCat || "",
        subcategoria: formData.subcategoriaUso || "",
      };

      // 🗄️ PASO 3: Guardar el registro en la tabla de Supabase
      const res = await fetch("http://localhost:8000/api/proyectos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(proyectoParaSupabase),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        const mensajeBackend =
          errorData.detail || "Error desconocido en el servidor";
        throw new Error(
          typeof mensajeBackend === "object"
            ? JSON.stringify(mensajeBackend)
            : mensajeBackend
        );
      }

      const respuestaBD = await res.json();
      return respuestaBD;
    } finally { // <--- CORREGIDO: Cambiado 'shadow' por 'finally'
      setGuardandoRegistro(false);
    }
  };

  return {
    formData,
    isModalOpen,
    guardandoRegistro,
    setIsModalOpen,
    handleInputChange,
    resetFormulario,
    publicarProyecto,
  };
};