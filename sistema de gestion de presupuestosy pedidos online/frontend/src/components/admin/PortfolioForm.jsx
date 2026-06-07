import React, { useState, useEffect, useRef } from "react";
import Button from "../ui/Button";

export const PortfolioForm = ({ onSave, currentProject, onCancelEdit }) => {
  const [formData, setFormData] = useState({
    titulo: "",
    categoria_principal: "cuero",
    subcategoria: "",
    modelo_tipo: "",
    genero: "",
    descripcion: "",
    imagen_file: null // Cambiado de URL a Objeto de archivo real
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showModal, setShowModal] = useState(false);
  
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (currentProject) {
      setFormData(currentProject);
      // Si ya viene con una URL previa del servidor, la mostramos
      setImagePreview(currentProject.imagen_url || null);
    } else {
      resetForm();
    }
  }, [currentProject]);

  const resetForm = () => {
    setFormData({
      titulo: "",
      categoria_principal: "cuero",
      subcategoria: "",
      modelo_tipo: "",
      genero: "",
      descripcion: "",
      imagen_file: null
    });
    setImagePreview(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Manejo Dinámico de Archivos (Click tradicional)
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    processFile(file);
  };

  // Manejo Dinámico de Arrastrar y Soltar (Drag & Drop)
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    processFile(file);
  };

  const processFile = (file) => {
    if (file && file.type.startsWith("image/")) {
      setFormData((prev) => ({ ...prev, imagen_file: file }));
      // Crear una URL temporal local para renderizar la previsualización al instante
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = (e) => {
    e.stopPropagation(); // Evita que se abra el selector de archivos al presionar eliminar
    setFormData((prev) => ({ ...prev, imagen_file: null }));
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowModal(true); 
  };

  const handleConfirmPublish = () => {
    onSave(formData);
    setShowModal(false);
    resetForm();
  };

  // Estilos base reutilizables
  const labelStyle = "block text-[14px] font-light text-[rgba(0,0,0,.9))] tracking-wider  mb-2 font-sans-arialsans-serif";
  
  const getInputClasses = (additional = "") => `
     w-full px-2 py-2 rounded-xl  border border-[#642121]/10 ring-1 ring-[#642121]/10 bg-[#642121]/20 text-[rgba(0,0,0,.9))]text-[14px] font-sans-serif transition-all duration-200 outline-none" 
    hover:border-[#642121]/5 hover:bg-white
    focus:border-[#642121]/10 focus:ring-1 focus:ring-[#642121]/10 focus:bg-white focus:text-stone-950 focus:border-[#642121]/5 text-[14px] 
    ${additional}
  `.trim();

  return (
    <div className="bg-white border  rounded-3xl p-6 md:p-10 shadow-xl max-w-4xl mx-auto transition-all duration-300 flex-colum gap-4"style={{ border: "1px solid #e0e0e0" }}>
      
      {/* Encabezado del Formulario de Alta Gama */}
      <div className="mb-8 pb-5 border-b border-stone-100 flex items-center justify-center">
        <div>
          <h2 className="text-[34px] font-bold tracking-widest text-[#642121]  bg-[#642121]/5 px-3 py-1 rounded-full justify-center font-sans-arial-sans-serif m-auto 
           flex">
            Taller Digital
          </h2>
         
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Campo: Nombre */}
        <div className="w-full ">
          <label className={labelStyle}>Nombre del Modelo / Trabajo</label>
          <input 
            type="text" 
            name="titulo" 
            value={formData.titulo} 
            onChange={handleChange} 
            required 
            placeholder="Ej. Bota Borceguí Premium" 
            className={getInputClasses()} 
          style={{ border: "1px solid rgba(0, 0, 0, 0.14)" }}/>
        </div>

        {/* Fila: Categoría y Subcategoría */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={labelStyle}>Categoría Raíz</label>
            <select 
              name="categoria_principal" 
              value={formData.categoria_principal} 
              onChange={handleChange} 
              className={getInputClasses("appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2378716c%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:16px] bg-[right_16px_center] bg-no-repeat")}
              style={{ border: "1px solid rgba(0, 0, 0, 0.14)" }}
            >
              <option value="cuero">Cuero / Calzado</option>
              <option value="tapiceria">Tapicería Automotriz</option>
            </select>
          </div>
          <div>
            <label className={labelStyle}>Subcategoría</label>
            <input 
              type="text" 
              name="subcategoria" 
              value={formData.subcategoria} 
              onChange={handleChange} 
              required 
              placeholder="Ej. Calzado Cavalier, Volantes" 
              className={getInputClasses()}
              style={{focusborder:"1px solid #642121"}} 
            />
          </div>
        </div>

        {/* Fila: Línea y Segmento */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={labelStyle}>Línea / Estilo</label>
            <input 
              type="text" 
              name="modelo_tipo" 
              value={formData.modelo_tipo} 
              onChange={handleChange} 
              placeholder="Ej. Minimalista, Clásico, Heritage" 
              className={getInputClasses()} 
              style={{ border: "1px solid rgba(0, 0, 0, 0.14)" }}

            />
          </div>
          <div>
            <label className={labelStyle}>Segmento</label>
            <select 
              name="genero" 
              value={formData.genero} 
              onChange={handleChange} 
              className={getInputClasses("appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2378716c%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:16px] bg-[right_16px_center] bg-no-repeat")}
              style={{ border: "1px solid rgba(0, 0, 0, 0.14)" }}
            >
              <option value="">No aplica</option>
              <option value="Caballero">Caballero</option>
              <option value="Dama">Dama</option>
              <option value="Unisex">Unisex</option>
            </select>
          </div>
        </div>

        {/* Fila: Precio Solitario */}
        <div className="w-full md:w-1/2">
          <label className={labelStyle}>Precio de Venta Estimado</label>
          <div className="relative">
            <span className="absolute left-4 top-[13px] text-stone-400 font-medium text-[15px]">$</span>
            <input 
              type="text" 
              name="precio" 
              value={formData.precio} 
              onChange={handleChange} 
              placeholder="0.00" 
              className={getInputClasses("pl-8")} 
            />
          </div>
        </div>

        {/* SECCIÓN NUEVA: Dropzone Dinámica e Interactiva para Fotografías */}
        <div>
          <label className={labelStyle}>Fotografía del Producto (HD)</label>
          
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden" 
          />

          <div 
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current.click()}
            className={`
              relative border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 group
              ${isDragging 
                ? "border-[#642121] bg-[#642121]/5 scale-[0.99]" 
                : "border-stone-200 bg-stone-50/30 hover:border-[#642121]/40 hover:bg-[#642121]/5"
              }
            `}
          >
            {!imagePreview ? (
              // Estado Dinámico Vacio: Esperando Archivo
              <div className="text-center space-y-3 py-4">
                <div className="p-3 bg-white border border-[1px solid #56070778] rounded-2xl shadow-xs inline-block text-stone-400 group-hover:text-[#642121] group-hover:scale-110 transition-all duration-300">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#642121" class="bi bi-camera-fill" viewBox="0 0 16 16">
                        <path d="M10.5 8.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0"/>
                        <path d="M2 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.172a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 9.172 2H6.828a2 2 0 0 0-1.414.586l-.828.828A2 2 0 0 1 3.172 4zm.5 2a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1m9 2.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0"/>
                      </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-stone-700">
                    <span className="text-[#642121] underline decoration-stone-300 group-hover:decoration-[#642121]">Haz clic para cargar</span> o arrastra tu imagen
                  </p>
                  <p className="text-xs text-stone-400 mt-1">Formatos recomendados: PNG, JPG o WEBP en alta definición</p>
                </div>
              </div>
            ) : (
              // Estado Dinámico Activo: Imagen Cargada y Previsualizada de Inmediato
              <div className="w-full relative flex flex-col items-center justify-center p-2 animate-fade-in">
                <div className="relative rounded-xl overflow-hidden shadow-md max-h-[220px] max-w-full border border-stone-200 bg-stone-100">
                  <img 
                    src={imagePreview} 
                    alt="Previsualización de Calidad" 
                    className="object-contain max-h-[200px] w-full transition-transform duration-300 group-hover:scale-[1.02]"
                  />
                  {/* Botón flotante dinámico para remover imagen */}
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-3 right-3 bg-stone-900/80 hover:bg-red-600 text-white p-2 rounded-full shadow-lg backdrop-blur-xs transition-all duration-200 transform hover:scale-110"
                    title="Remover imagen"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/></svg>
                  </button>
                </div>
                <div className="mt-3 text-center">
                  <p className="text-xs font-bold text-[#642121] bg-[#642121]/5 px-3 py-1 rounded-full inline-block">
                    {formData.imagen_file ? formData.imagen_file.name : "Fotografía enlazada"}
                  </p>
                  <p className="text-[11px] text-stone-400 mt-1 font-sans">Haz clic en cualquier área gris para sustituir la foto</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Campo: Especificaciones */}
        <div>
          <label className={labelStyle}>Especificaciones Técnicas</label>
          <textarea 
            name="descripcion" 
            value={formData.descripcion} 
            onChange={handleChange} 
            rows="3" 
            placeholder="Especifica el calibre del cuero, hilos encerados, forros internos o herrajes utilizados..." 
            className={getInputClasses("resize-none py-3")}
          />
        </div>

        {/* Botonera de Envío */}
        <div className="pt-4 flex flex-col sm:flex-row gap-4">
          {currentProject && (
            <Button type="button" variant="secondary" onClick={onCancelEdit} className="w-full sm:flex-1 py-3.5 order-2 sm:order-1 font-sans font-semibold text-xs tracking-wider">
              Cancelar
            </Button>
          )}
          <Button type="submit" variant="artesanal" className="w-full sm:flex-1 py-3.5 order-1 sm:order-2 font-sans font-bold text-xs tracking-widest text-white bg-[#642121] rounded-xl shadow-md hover:bg-[#4a1818] transition-all transform hover:-translate-y-0.5">
            {currentProject ? "GUARDAR CAMBIOS" : "ENVIAR A VITRINA"}
          </Button>
        </div>
      </form>

      {/* MODAL DE CONTROL DE CALIDAD Y CONFIRMACIÓN */}
      {showModal && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white border border-stone-100 rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-2xl transform transition-all scale-100">
            <div className="text-center space-y-1">
              <span className="text-[10px] bg-amber-50 text-[#642121] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider font-sans">Curaduría</span>
              <h3 className="text-base font-bold text-stone-800 pt-1 font-sans">¿Confirmar publicación?</h3>
              <p className="text-xs text-stone-400 font-sans">Los archivos binarios e información técnica se procesarán de inmediato para la vitrina virtual.</p>
            </div>

            <div className="bg-stone-50 p-3 rounded-xl border border-stone-200/60 text-xs space-y-2 font-sans">
              <div className="flex justify-between items-center"><span className="text-stone-400 font-medium">Pieza:</span> <span className="font-bold text-stone-700 truncate max-w-[180px]">{formData.titulo}</span></div>
              <div className="flex justify-between items-center"><span className="text-stone-400 font-medium">Fotografía:</span> <span className="font-semibold text-emerald-600">{imagePreview ? "✓ Cargada" : "✗ Sin foto"}</span></div>
              <div className="flex justify-between items-center"><span className="text-stone-400 font-medium">Precio:</span> <span className="font-bold text-[#642121]">{formData.precio ? `$${formData.precio}` : "A consultar"}</span></div>
            </div>

            <div className="flex gap-3 pt-1">
              <Button type="button" variant="secondary" onClick={() => setShowModal(false)} className="w-full py-2.5 font-sans text-xs font-semibold">
                Corregir
              </Button>
              <Button type="button" variant="artesanal" onClick={handleConfirmPublish} className="w-full py-2.5 font-sans text-xs font-bold text-white bg-[#642121] rounded-lg">
                Confirmar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PortfolioForm;