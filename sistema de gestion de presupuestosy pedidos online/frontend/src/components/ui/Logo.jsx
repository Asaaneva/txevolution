// src/components/ui/Logo.jsx
export const Logo = ({ size = "w-16 h-16", className = "", ...props }) => {
  return (
    <img
      src="./public/logo(3).webp"
      alt="Logo"
      className={`object-contain ${size} ${className}`}
      {...props} // Esto permite pasar otros atributos como onClick o style si los necesitas
    />
  );
};
