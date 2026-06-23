import React, { useEffect, useState } from "react";

export default function ListaProyectos() {
  const [proyectos, setProyectos] = useState([]);
  const [cargando, setCargando] = useState(true);

  // 🔄 1. Petición para obtener todos los proyectos al cargar el componente
  useEffect(() => {
    const obtenerProyectos = async () => {
      try {
        // Apunta al endpoint GET que creamos en FastAPI
        const respuesta = await fetch("http://localhost:8000/api/proyectos");
        if (!respuesta.ok) throw new Error("Error al conectar con el servidor");
        
        const datos = await respuesta.json();
        setProyectos(datos);
      } catch (error) {
        console.error("❌ Error cargando la vitrina:", error);
      } finally {
        setCargando(false);
      }
    };

    obtenerProyectos();
  }, []);

  if (cargando) return <p>Cargando catálogo de TXevolution...</p>;

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h2>📋 Lista de Proyectos Publicados</h2>

      {proyectos.length === 0 ? (
        <p>No hay proyectos en la vitrina todavía.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "15px" }}>
          <thead>
            <tr style={{ backgroundColor: "#f4f4f4", textAlign: "left" }}>
              <th style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Imagen</th>
              <th style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Nombre</th>
              <th style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Modelo</th>
              <th style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Tipo de Artículo</th>
              <th style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Destino</th>
              <th style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {proyectos.map((proyecto) => (
              <tr key={proyecto.id}>
                {/* 📸 RENDERIZADO ÓPTIMO: Cargando la URL directa de Supabase Storage */}
                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
                  {proyecto.foto_url ? (
                    <img
                      src={proyecto.foto_url}
                      alt={proyecto.nombre}
                      style={{ width: "80px", height: "60px", objectFit: "cover", borderRadius: "6px" }}
                    />
                  ) : (
                    <span>Sin foto</span>
                  )}
                </td>
                <td style={{ padding: "10px", borderBottom: "1px solid #ddd", fontWeight: "bold" }}>
                  {proyecto.nombre}
                </td>
                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
                  {proyecto.modelo || "-"}
                </td>
                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
                  <span style={{ background: "#e0f7fa", padding: "4px 8px", borderRadius: "12px", fontSize: "12px" }}>
                    {proyecto.tipo_articulo}
                  </span>
                </td>
                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
                  {proyecto.destino}
                </td>
                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
                  {/* Botones listos para cuando usemos los endpoints de modificar o borrar */}
                  <button style={{ marginRight: "8px", color: "blue", cursor: "pointer" }}>Editar</button>
                  <button style={{ color: "red", cursor: "pointer" }}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}