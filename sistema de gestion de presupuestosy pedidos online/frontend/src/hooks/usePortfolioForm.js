// src/hooks/usePortfolioForm.js
import { useState } from "react";

const INITIAL_STATE = {
  title: "",
  description: "",
  category: "",
  technologies: "",
  project_url: "",
  repo_url: "",
  image: ""
};

export const usePortfolioForm = (onSuccessCallback) => {
  const [formData, setFormData] = useState(INITIAL_STATE);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Manejador de cambios para inputs de texto y selectores
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // 📷 Procesamiento local de imagen a Base64 (Evita errores de Multipart)
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, image: "La imagen no debe superar los 2MB" }));
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({ ...prev, image: reader.result }));
      setErrors((prev) => ({ ...prev, image: "" }));
    };
    reader.readAsDataURL(file);
  };

  // 🛡️ Validación estricta "Early Return" (Ahorro total de créditos)
  const validateForm = () => {
    const localErrors = {};
    if (!formData.title.trim()) localErrors.title = "El título es obligatorio.";
    if (!formData.description.trim()) localErrors.description = "La descripción es obligatoria.";
    if (!formData.category) localErrors.category = "Selecciona una categoría válida.";
    if (!formData.image) localErrors.image = "La miniatura del proyecto es obligatoria.";
    
    setErrors(localErrors);
    return Object.keys(localErrors).length === 0;
  };

  // Envió controlado
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return; // Se aborta si hay errores (0 peticiones al servidor)

    setIsSubmitting(true);
    try {
      // 🚀 SIMULACIÓN DE RED (MOCK) - No gasta créditos del sandbox
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      console.log("Payload limpio enviado al Backend:", formData);
      
      // Si todo sale bien, ejecutamos el callback (ej. recargar la lista de proyectos)
      if (onSuccessCallback) onSuccessCallback();
      
      setFormData(INITIAL_STATE); // Limpiamos el formulario
      alert("¡Proyecto cargado exitosamente al portafolio!");
    } catch (error) {
      setErrors({ global: "Error de comunicación con el servidor." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return { formData, errors, isSubmitting, handleChange, handleImageChange, handleSubmit };
};