// src/utils/portfolioValidations.js
export const validarFormularioPortfolio = (formData) => {
  const nuevosErrores = {};

  if (!formData.destino) {
    nuevosErrores.destino = true;
  }

  if (formData.destino === "index" || formData.destino === "categoria") {
    if (!formData.tipoArticuloCat) nuevosErrores.tipoArticuloCat = true;
    if (!formData.subcategoriaUso) nuevosErrores.subcategoriaUso = true;

    if (
      formData.destino === "categoria" &&
      formData.subcategoriaUso === "Zapatos" &&
      !formData.clasificacionCalzado
    ) {
      nuevosErrores.clasificacionCalzado = true;
    }
  }

  // Corregido: Debe ser "detalles" en lugar de "producto"
  if (formData.destino === "detalles") {
    if (!formData.modelo?.trim()) nuevosErrores.modelo = true;
    if (!formData.descripcion?.trim()) nuevosErrores.descripcion = true;
  }

  if (!formData.fotoUrl) {
    nuevosErrores.fotoUrl = true;
  }

  return nuevosErrores;
};