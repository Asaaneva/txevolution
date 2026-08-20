import React from "react";
import { BrowserRouter as Router } from "react-router-dom"; // 👈 El Router se muda aquí
import { AuthProvider } from "./context/AuthContext";
import AppRoutes from "./routes"; // Importa tus rutas limpias

function App() {
  return (
    // 🏛️ JERARQUÍA INDUSTRIAL: Red (Router) ➔ Memoria (Provider) ➔ Pantallas (Routes)
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
