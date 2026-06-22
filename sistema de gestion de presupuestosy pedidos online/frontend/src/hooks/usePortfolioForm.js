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

  // 🚀 FUNCIÓN DE PETICIÓN REVISADA Y BLINDADA
  const publicarProyecto = async () => {
    setGuardandoRegistro(true);
    try {
      const proyectoParaSupabase = {
        profile_id: "c20df547-0648-433b-85fe-d1912423a677",
        destino: formData.destino,
        nombre: formData.nombre || "Artículo de Vitrina",
        modelo: formData.modelo || "Genérico",
        descripcion: formData.descripcion || "",
        foto_url: formData.fotoUrl,
        tipo_articulo: formData.tipoArticuloCat || "",
        subcategoria: formData.subcategoriaUso || "",
      };

      const res = await fetch("http://localhost:8000/api/proyectos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(proyectoParaSupabase),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        const mensajeBackend =
          errorData.detail || "Error desconocido en el servidor";
        throw new Error(mensajeBackend);
      }

      const respuestaBD = await res.json();
      return respuestaBD;
    } finally {
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
