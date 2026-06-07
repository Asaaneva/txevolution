// src/components/ui/Input.jsx
import React from "react";

export const Input = ({
  label,
  error,
  shake,
  isFocused,
  helperText,
  renderRightAction,
  className = "",
  ...props
}) => {
  return (
    <div 
      className={`flex flex-col gap-1.5 w-full transition-transform duration-300 ${
        shake ? "animate-[shake_0.5s_ease-in-out]" : ""
      }`}
    >
      {/* Animación quirúrgica de vibración inyectada localmente */}
      {shake && (
        <style>{`
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            20%, 60% { transform: translateX(-6px); }
            40%, 80% { transform: translateX(6px); }
          }
        `}</style>
      )}

      {label && (
        <label className="text-[16px] font-semibold text-stone-800 text-[16px]  tracking-wider m-b m-1 "style={{fontFamily:"Sans,Arial,sans-serif", fontWeight:"520", fontSize:"16px"}}>
          {label}
        </label>
      )}

      <div className="relative w-full flex items-center gap-2">
        <input
          className={`w-full px-3 py-2.5 rounded-lg border border-[#642121]/20 bg-[#642121]/20 placeholder-stone-600 transition-all duration-200 outline-none font-sans-serif text-[14px] font-normal
            ${renderRightAction ? "pr-8" : "pr-4"}
            ${error 
                ? "border-rose-400 bg-rose-50/10 text-rose-900 focus:ring-1 focus:ring-rose-500" 
                : isFocused 
                  ? "border-[#642121]/20 ring ring-[#642121]/10 bg-[#642121]/20 text-stone-800" 
                  : "border-[#642121]/20 - bg-white text-stone-500 focus:border-[#642121]/10 focus:ring-1 focus:ring-[#642121] focus:bg-[#642121]/10 focus:text-stone-950"
            } ${className}`}
        {...props}
        />

        {renderRightAction && (
          <div className="absolute right-2 flex items-center justify-center">
            {renderRightAction()}
          </div>
        )}
      </div>

      {error && (
        <span className="text-[11px] text-rose-600 font-semibold mt-0.5 text-left flex items-center gap-1 font-sans">
          ⚠️ {error}
        </span>
      )}

      {!error && helperText && (
        <div className="mt-1 w-full text-left font-sans">
          {typeof helperText === "string" ? (
            <span className="text-[11px] font-medium text-stone-400 leading-relaxed">{helperText}</span>
          ) : (
            helperText
          )}
        </div>
      )}
    </div>
  );
};

export default Input;