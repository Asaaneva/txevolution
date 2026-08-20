// src/components/ui/Button.jsx
import React from "react";

export const Button = ({ children, className = "", disabled, ...props }) => {
  return (
    <button
      disabled={disabled}
      className={`w-full bg-slate-950 text-white py-3 px-4 rounded-xl font-bold text-sm tracking-wide shadow-sm transition-all duration-200 select-none
        ${
          disabled
            ? "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none active:scale-100"
            : "hover:bg-slate-800 active:scale-[0.98]"
        } ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
