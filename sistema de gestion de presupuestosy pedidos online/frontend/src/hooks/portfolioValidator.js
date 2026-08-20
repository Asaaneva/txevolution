export const validarFormularioPortfolio = (formData, archivoFisicoFoto, proyectoEdicionId) => {
    const errores = {};
  
    // Validar destino global obligatorio
    if (!formData.destino) {
      errores.destino = true;
      return { esValido: false, errores };
    }
  
    // Validaciones condicionales por flujo
    if (formData.destino === "index" || formData.destino === "categoria") {
      if (!formData.tipoArticuloCat) errores.tipoArticuloCat = true;
      if (!formData.subcategoriaUso) errores.subcategoriaUso = true;
      
      // Regla añadida si es Zapato en la página de categoría
      if (formData.destino === "categoria" && formData.subcategoriaUso === "Zapatos") {
        if (!formData.clasificacionCalzado) errores.clasificacionCalzado = true;
      }
    }
  
    if (formData.destino === "producto") {
      if (!formData.nombre?.trim()) errores.nombre = true;
      if (!formData.modelo?.trim()) errores.modelo = true;
    }
  
    // Validar carga de archivo físico si no es edición
    if (!archivoFisicoFoto && !proyectoEdicionId) {
      errores.foto = true;
    }
  
    return {
      esValido: Object.keys(errores).length === 0,
      errores
    };
  };
  