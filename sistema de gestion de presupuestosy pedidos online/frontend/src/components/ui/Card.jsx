// src/components/ui/Card.jsx
import React from "react";

export const Card = ({ children, className = "" }) => {
  return (
    <div
      className={`bg-white rounded-2xl border border-slate-200/80 shadow-md p-6 sm:p-8 transition-all duration-300 hover:shadow-lg w-full ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;
