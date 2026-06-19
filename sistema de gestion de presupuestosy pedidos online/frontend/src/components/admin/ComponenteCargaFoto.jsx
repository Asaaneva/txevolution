// src/components/admin/ComponenteCargaFoto.jsx
import React, { useRef } from "react";

export const ComponenteCargaFoto = ({ fotoUrl, nombreArchivo, onFotoCambiada, onFotoRemovida, hasError }) => {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ["image/jpeg", "image/png"];
      if (validTypes.includes(file.type)) {
        const reader = new FileReader();
        reader.onload = (event) => onFotoCambiada(file.name, event.target.result);
        reader.readAsDataURL(file);
      } else {
        alert("Solo archivos JPG y PNG.");
        onFotoRemovida();
      }
    }
  };

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label className="text-xs font-bold text-stone-800 tracking-wide">Imagen del Artículo</label>
      
      <div className="relative w-full">
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept="image/jpeg, image/png" 
          className="hidden"
        />
        
        {/* Dropzone dinámico con Tailwind */}
        <div 
          onClick={() => fileInputRef.current?.click()}
          className={`flex justify-between items-center p-3 px-4 rounded-lg border cursor-pointer transition-all duration-200
            ${fotoUrl 
              ? "bg-green-50 border-green-200 text-green-800" 
              : hasError 
                ? "bg-red-50 border-red-500 text-red-900 animate-[vibrate_0.4s_ease-in-out]" 
                : "bg-stone-50 border-dashed border-stone-300 text-stone-500 hover:bg-stone-100 hover:border-stone-400"
            }`}
        >
          <span className="text-xs font-medium truncate max-w-[85%]">{nombreArchivo}</span>
          <span className="text-sm">📷</span>
        </div>
      </div>

      {fotoUrl && (
        <div className="mt-2">
          <div className="relative w-[70px] h-[70px] rounded-lg border border-stone-200 overflow-hidden shadow-sm">
            <img src={fotoUrl} alt="Mini preview" className="w-full h-full object-cover" />
            <button 
              type="button" 
              onClick={onFotoRemovida}
              className="absolute top-1 right-1 w-4 h-4 bg-red-600/90 hover:bg-red-600 text-white rounded-full text-[10px] flex items-center justify-center transition-colors"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
};