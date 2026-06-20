import { useState } from "react";

export const usePortfolioForm = (onSuccess) => {
  const [formData, setFormData] = useState({
    destino: "",
    nombre: "",
    modelo: "",
    descripcion: "",
    fotoUrl: "",
    nombreArchivo: "Seleccionar archivo...",
    tipoArticuloIndex: "",
    subcategoriaIndex: "",
    tipoArticuloCat: "",
    publico: "",
    subcategoriaUso: "",
  });

  const [errors, setErrors] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [subiendo, setSubiendo] = useState(false); // Estado útil para deshabilitar el botón mientras sube

  // ✍️ CREADA: Función estándar para actualizar cualquier campo de texto
  const handleInputChange = (campo, valor) => {
    setFormData((prev) => ({
      ...prev,
      [campo]: valor,
    }));
  };

  const handleFileChange = async (e) => {
    const archivoSeleccionado = e.target.files[0];
    if (!archivoSeleccionado) return;

    setSubiendo(true);

    // Guardamos temporalmente el nombre del archivo en la UI para que el usuario vea qué eligió
    handleInputChange("nombreArchivo", archivoSeleccionado.name);

    const datosParaEnviar = new FormData();
    datosParaEnviar.append("file", archivoSeleccionado);

    try {
      // 🚀 CORREGIDO: Comentario válido para JavaScript (//)
      const respuesta = await fetch("http://localhost:8080/api/upload-imagen", {
        method: "POST",
        body: datosParaEnviar,
      });

      if (!respuesta.ok) {
        throw new Error("Error en el servidor al procesar el archivo");
      }

      const resultado = await respuesta.json();

      console.log(
        "¡Fotografía almacenada en Supabase Storage!",
        resultado.fotoUrl
      );

      // 🎯 CORREGIDO: Usamos el actualizador de estado nativo para guardar la URL de Supabase
      handleInputChange("fotoUrl", resultado.fotoUrl);
    } catch (error) {
      console.error(
        "Error al conectar con el banco de imágenes de TXevolution:",
        error
      );
      alert("Hubo un problema al subir la foto al servidor.");
      handleInputChange("nombreArchivo", "Seleccionar archivo...");
    } finally {
      setSubiendo(false);
    }
  };

  const ejecutarValidacion = (e) => {
    if (e) e.preventDefault();
    const newErrors = {};

    if (!formData.destino) newErrors.destino = true;
    if (formData.destino === "index" && !formData.tipoArticuloIndex)
      newErrors.tipoArticuloIndex = true;
    if (!formData.nombre?.trim()) newErrors.nombre = true;
    if (!formData.modelo?.trim()) newErrors.modelo = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setTimeout(() => setErrors({}), 450);
      return false;
    }

    setIsModalOpen(true);
    return true;
  };

  const resetFormulario = () => {
    setFormData({
      destino: "",
      nombre: "",
      modelo: "",
      descripcion: "",
      fotoUrl: "",
      nombreArchivo: "Seleccionar archivo...",
      tipoArticuloIndex: "",
      subcategoriaIndex: "",
      tipoArticuloCat: "",
      publico: "",
      subcategoriaUso: "",
    });
    setErrors({});
    setIsModalOpen(false);
  };

  // Retornamos todos los métodos controlados que tu formulario necesita consumir
  return {
    formData,
    setFormData,
    errors,
    isModalOpen,
    setIsModalOpen,
    subiendo, // Te servirá para mostrar un spinner o texto de "Cargando..."
    handleInputChange, // 🔥 CORREGIDO: Ahora sí está definida
    handleFileChange, // 🔥 AGREGADO: Necesario para el onChange del <input type="file" />
    ejecutarValidacion,
    resetFormulario,
  };
};
