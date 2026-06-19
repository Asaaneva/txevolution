// src/pages/PortfolioFormpages.jsx
import React, { useState } from "react";
import { usePortfolioForm } from "../hooks/usePortfolioForm";
import { PortfolioForm } from "../components/admin/PortfolioForm";
import { ComponenteCargaFoto } from "../components/admin/ComponenteCargaFoto";
import { PreviewModal } from "../components/admin/PreviewModal";
import { ProyectosTable } from "../components/admin/ProyectosTable";

export const PortfolioFormpages = () => {
  const [proyectos, setProyectos] = useState([]);

  // Inyección de nuestra lógica personalizada desacoplada
  const {
    formData,
    errors,
    isModalOpen,
    setIsModalOpen,
    handleInputChange,
    ejecutarValidacion,
    resetFormulario
  } = usePortfolioForm();

  // Confirmación final del modal
  const handleConfirmarGuardado = () => {
    setProyectos((prev) => [...prev, { ...formData, id: Date.now() }]);
    resetFormulario();
  };

  return (
    <div className="w-full min-h-screen bg-stone-100/40 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        
        {/* PANEL PRINCIPAL: Formulario de Configuración */}
        <div className="bg-white rounded-xl border border-stone-200/80 shadow-xs p-6 mb-6">
          <h2 className="text-xl font-bold text-stone-800 text-center uppercase tracking-wide mb-6">
            Publicar Proyecto Terminado
          </h2>

          <PortfolioForm 
            datos={formData} 
            errors={errors} 
            onChange={handleInputChange}
            onSubmit={ejecutarValidacion}
          >
            <ComponenteCargaFoto 
              fotoUrl={formData.fotoUrl}
              nombreArchivo={formData.nombreArchivo}
              hasError={errors.foto}
              onFotoCambiada={(name, url) => {
                handleInputChange("nombreArchivo", name);
                handleInputChange("fotoUrl", url);
              }}
              onFotoRemovida={() => {
                handleInputChange("nombreArchivo", "Seleccionar archivo...");
                handleInputChange("fotoUrl", "");
              }}
            />
          </PortfolioForm>

          {/* Botón de control periférico */}
          <div className="w-full mt-6">
            <button
              type="button"
              onClick={ejecutarValidacion}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-xs active:scale-[0.995]"
            >
              👁️ Ver Vista Previa del Proyecto
            </button>
          </div>
        </div>

        {/* LISTADO: Tabla de datos presentacional */}
        <ProyectosTable proyectos={proyectos} />

      </div>

      {/* MODAL EMERGENTE DE CONFIRMACIÓN */}
      <PreviewModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmarGuardado}
        datos={formData}
      />
      
    </div>
  );
};

export default PortfolioFormpages;