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
        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider text-left">
          {label}
        </label>
      )}

      <div className="relative w-full flex items-center">
        <input
          className={`w-full px-4 py-3 rounded-xl border bg-slate-50/30 text-sm placeholder-slate-400 transition-all duration-200 outline-none
            ${renderRightAction ? "pr-10" : "pr-4"}
            ${error 
              ? "border-rose-400 bg-rose-50/10 text-rose-900 focus:ring-2 focus:ring-rose-500" 
              : isFocused 
                ? "border-slate-950 ring-2 ring-slate-950 bg-white" 
                : "border-slate-200 focus:border-slate-950 focus:bg-white"
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
        <span className="text-[11px] text-rose-600 font-semibold mt-0.5 text-left flex items-center gap-1">
          ⚠️ {error}
        </span>
      )}

      {!error && helperText && (
        <div className="mt-0.5 w-full text-left">
          {typeof helperText === "string" ? (
            <span className="text-[11px] text-slate-400 font-medium">{helperText}</span>
          ) : (
            helperText
          )}
        </div>
      )}
    </div>
  );
};

export default Input;