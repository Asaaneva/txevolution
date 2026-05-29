import React from "react";

export const Button = ({ children, type = "button", disabled = false, className = "", ...props }) => {
  return (
    <button type={type} disabled={disabled} className={`ui-button ${className}`} {...props}>
      {children}
    </button>
  );
};
export default Button;