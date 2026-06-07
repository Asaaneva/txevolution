// src/components/ui/Button.jsx
import React from "react";

export const Button = ({ children, variant = "artesanal", className = "", ...props }) => {
  // Estilos base ultra limpios con la fuente Open Sans heredada o explícita
  const baseStyles = "rounded-lg text-xs  tracking-wider transition-all duration-300 shadow-3xs cursor-pointer active:scale-99 flex items-center justify-center font-sans py-4 font-normal";
  
  const variants = {
    // 🟫 TU VARIANTE ARTESANAL PRINCIPAL (Color #682e0c, Hover #5b0b0b, Peso 600)
    artesanal: "bg-[#642121] text-white hover:bg-[#5b0b0b] font-semibold",
    
    // Variante secundaria para cancelaciones o retornos
    secondary: "bg-stone-100 text-stone-600 hover:bg-stone-200 border border-stone-200 font-medium"
  };

  return (
    <button
      style={{ fontFamily: "'Open Sans', sans-serif" }}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;