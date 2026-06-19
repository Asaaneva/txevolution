// src/hooks/usePortfolioForm.js
import { useState } from "react";

export const usePortfolioForm = (onSuccess) => {
  const [formData, setFormData] = useState({
    destino: "", nombre: "", modelo: "", descripcion: "", fotoUrl: "", nombreArchivo: "Seleccionar archivo...",
    tipoArticuloIndex: "", subcategoriaIndex: "", tipoArticuloCat: "", publico: "", subcategoriaUso: ""
  });

  const [errors, setErrors] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Limpieza reactiva de errores al escribir
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: false }));
    }
  };

  const ejecutarValidacion = (e) => {
    if (e) e.preventDefault();
    const newErrors = {};

    if (!formData.destino) newErrors.destino = true;
    if (formData.destino === "index" && !formData.tipoArticuloIndex) newErrors.tipoArticuloIndex = true;
    if (!formData.nombre?.trim()) newErrors.nombre = true;
    if (!formData.modelo?.trim()) newErrors.modelo = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setTimeout(() => setErrors({}), 450); // Reseteo para la animación CSS
      return false;
    }

    setIsModalOpen(true);
    return true;
  };

  const resetFormulario = () => {
    setFormData({
      destino: "", nombre: "", modelo: "", descripcion: "", fotoUrl: "", nombreArchivo: "Seleccionar archivo...",
      tipoArticuloIndex: "", subcategoriaIndex: "", tipoArticuloCat: "", publico: "", subcategoriaUso: ""
    });
    setErrors({});
    setIsModalOpen(false);
  };

  return {
    formData,
    errors,
    isModalOpen,
    setIsModalOpen,
    handleInputChange,
    ejecutarValidacion,
    resetFormulario
  };
};