import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App"; // O AdminLogin, dependiendo de cuál renderices
import "./index.css"; // 👈 ¡ESTA LÍNEA ES CRUCIAL! Si no está, Tailwind no carga.

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
