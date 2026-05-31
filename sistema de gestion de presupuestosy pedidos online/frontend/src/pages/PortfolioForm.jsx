// src/pages/private/admin/portfolio/PortfolioForm.jsx
import React from "react";
import { usePortfolioForm } from "./hooks/usePortfolioForm";

export const PortfolioForm = ({ onProjectAdded }) => {
  const { formData, errors, isSubmitting, handleChange, handleImageChange, handleSubmit } = 
    usePortfolioForm(onProjectAdded);

  return (
    <div className="w-full max-w-3xl bg-white border border-slate-200/80 rounded-2xl shadow-sm p-6">
      <div className="mb-5">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Nuevo Proyecto</h3>
        <p className="text-xs text-slate-400 mt-0.5">Carga un nuevo caso de éxito al portafolio de la marca.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Fila 1: Título y Categoría */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Título del Proyecto *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Ej: E-Commerce Calzados C3"
              className={`w-full px-3 py-2 text-xs bg-slate-50 border rounded-xl focus:outline-none transition-all duration-200 ${
                errors.title ? "border-rose-400 ring-2 ring-rose-50" : "border-slate-200 focus:border-slate-950 focus:bg-white"
              }`}
            />
            {errors.title && <p className="text-[10px] text-rose-500 font-medium mt-1">{errors.title}</p>}
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Categoría *</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={`w-full px-3 py-2 text-xs bg-slate-50 border rounded-xl focus:outline-none cursor-pointer transition-all duration-200 ${
                errors.category ? "border-rose-400 ring-2 ring-rose-50" : "border-slate-200 focus:border-slate-950 focus:bg-white"
              }`}
            >
              <option value="">Selecciona una opción</option>
              <option value="web">Desarrollo Web</option>
              <option value="automation">Automatización e IA</option>
              <option value="ux-ui">Diseño UI/UX</option>
            </select>
            {errors.category && <p className="text-[10px] text-rose-500 font-medium mt-1">{errors.category}</p>}
          </div>
        </div>

        {/* Fila 2: Descripción */}
        <div>
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Descripción Técnica *</label>
          <textarea
            name="description"
            rows="3"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe el reto de ingeniería y las soluciones implementadas..."
            className={`w-full px-3 py-2 text-xs bg-slate-50 border rounded-xl focus:outline-none transition-all duration-200 resize-none ${
              errors.description ? "border-rose-400 ring-2 ring-rose-50" : "border-slate-200 focus:border-slate-950 focus:bg-white"
            }`}
          />
          {errors.description && <p className="text-[10px] text-rose-500 font-medium mt-1">{errors.description}</p>}
        </div>

        {/* Fila 3: Tecnologías y URLs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-1">
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Tecnologías (Separadas por coma)</label>
            <input
              type="text"
              name="technologies"
              value={formData.technologies}
              onChange={handleChange}
              placeholder="React, Python, SQL"
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-950 focus:bg-white transition-all duration-200"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">URL del Proyecto (Demo)</label>
            <input
              type="url"
              name="project_url"
              value={formData.project_url}
              onChange={handleChange}
              placeholder="https://..."
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-950 focus:bg-white transition-all duration-200"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">URL del Repositorio</label>
            <input
              type="url"
              name="repo_url"
              value={formData.repo_url}
              onChange={handleChange}
              placeholder="https://github.com/..."
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-950 focus:bg-white transition-all duration-200"
            />
          </div>
        </div>

        {/* Fila 4: Carga de Imagen */}
        <div>
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Miniatura del Proyecto *</label>
          <div className={`w-full border-2 border-dashed rounded-xl p-4 text-center transition-all duration-200 ${
            errors.image ? "border-rose-400 bg-rose-50/20" : "border-slate-200 bg-slate-50 hover:bg-slate-100/50"
          }`}>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              id="portfolio-image"
              className="hidden"
            />
            <label htmlFor="portfolio-image" className="cursor-pointer block w-full h-full text-xs text-slate-500 font-medium">
              {formData.image ? (
                <div className="flex items-center justify-center gap-2 text-emerald-600 font-bold">
                  <span>✓ Imagen cargada exitosamente</span>
                  <span className="text-[10px] text-slate-400 font-normal">(Haz clic para cambiar)</span>
                </div>
              ) : (
                "📂 Seleccionar archivo de imagen (Máx. 2MB)"
              )}
            </label>
          </div>
          {errors.image && <p className="text-[10px] text-rose-500 font-medium mt-1">{errors.image}</p>}
        </div>

        {/* Botón de Envió */}
        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-5 py-2.5 text-xs font-bold text-white rounded-xl shadow-sm transition-all duration-200 cursor-pointer ${
              isSubmitting ? "bg-slate-400 cursor-not-allowed" : "bg-slate-950 hover:bg-slate-800"
            }`}
          >
            {isSubmitting ? "Procesando..." : "Guardar Proyecto"}
          </button>
        </div>
      </form>
    </div>
  );
};