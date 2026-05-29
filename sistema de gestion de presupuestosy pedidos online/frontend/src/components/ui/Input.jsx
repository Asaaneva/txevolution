import React from "react";

export const Input = ({
  label,
  type = "text",
  name,
  placeholder,
  disabled,
  value,
  onChange,
  error,
  helperText,
  renderRightAction,
  ...props
}) => {
  return (
    <div className="ui-input-container">
      {label && <label className="ui-label">{label}</label>}

      <div className="ui-input-wrapper">
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          disabled={disabled}
          value={value}
          onChange={onChange}
          className={`ui-input ${error ? "has-error" : ""}`}
          {...props}
        />

        {renderRightAction && (
          <div className="ui-input-action">
            {renderRightAction()}
          </div>
        )}
      </div>

      {error && <span className="ui-error-text">❌ {error}</span>}

      {helperText && !error && (
        <div className="ui-helper-text">
          {helperText}
        </div>
      )}
    </div>
  );
};
export default Input;