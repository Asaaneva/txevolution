import React, { createContext, useState, useContext, useEffect } from "react";
import { proyectoService } from "../services/proyectoService";

const PortfolioContext = createContext();

export const PortfolioProvider = ({ children }) => {
  const [proyectos, setProyectos] = useState([]);
  const [cargando, setCargando] = useState(true);

  const cargarProyectos = async () => {
    setCargando(true);
    try {
      const datosBD = await proyectoService.obtenerTodos();

      // 💡 El mapeo de datos se queda aquí por Separación de Responsabilidades
      const proyectosMapeados = datosBD.map((p) => ({
        id: p.id,
        nombre: p.nombre,
        destino: p.destino,
        modelo: p.modelo,
        descripcion: p.descripcion,
        tipoArticuloCat: p.tipo_articulo,
        subcategoriaUso: p.subcategoria,
        fotoUrl: p.foto_url,
      }));

      setProyectos(proyectosMapeados);
    } catch (error) {
      console.error("❌ Error en PortfolioContext:", error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarProyectos();
  }, []);

  return (
    <PortfolioContext.Provider
      value={{ proyectos, setProyectos, cargando, cargarProyectos }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

// Hook utilitario para consumir el contexto fácilmente
export const usePortfolioContext = () => {
  const context = useContext(PortfolioContext);
  if (!context)
    throw new Error(
      "usePortfolioContext debe usarse dentro de PortfolioProvider"
    );
  return context;
};
