// src/App.jsx
import React from "react";
import { AuthProvider } from "./context/AuthContext"; // 👈 Enciende el almacén de roles
import AppRoutes from "./routes";

function App() {
  return (
    // 🌟 REGLA DE ORO: El proveedor debe envolver obligatoriamente a tus rutas
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
