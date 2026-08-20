export const validarArchivoImagen = (archivo) => {
  if (!archivo)
    return { esValido: false, error: "No se ha seleccionado ningún archivo." };

  // 1. Validar que sea una imagen real
  const tiposPermitidos = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/jpg",
  ];
  if (!tiposPermitidos.includes(archivo.type)) {
    return {
      esValido: false,
      error: "El formato no es válido. Solo se permite JPG, PNG o WEBP.",
    };
  }

  // 2. Validar tamaño máximo (Ejemplo: 5MB = 5 * 1024 * 1024 bytes)
  const limiteTamano = 5 * 1024 * 1024;
  if (archivo.size > limiteTamano) {
    return {
      esValido: false,
      error: "La imagen es muy pesada. El tamaño máximo permitido es de 5MB.",
    };
  }

  return { esValido: true, error: null };
};
