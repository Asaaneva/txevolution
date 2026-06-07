// src/components/ui/Card.jsx
import React from "react";

export const Card = ({ children, className = "" }) => {
  return (
    <div
      className={`bg-white shadow-[0_2px_10px_rgba(227,227,227,0.64)] rounded-2xl  p-6 sm:p-8 transition-all duration-300 hover:shadow-lg w-full  ${className}`}
      style={{ border: "1px solid rgba(221, 221, 221, 0.64)" }}
    >
      {children}
    </div>
  );
};

export default Card;
