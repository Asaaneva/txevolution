import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx"; // 🟢 IMPORTANTE: "App" debe declararse aquí para poder usarlo abajo
import "./index.css"; // Tus estilos de Tailwind

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
