// @vitest-environment jsdom

import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

// 💡 Importaciones del dominio con rutas relativas calibradas para tu carpeta
import { usePortfolioPage } from "../usePortfolioPage";
import { proyectoService } from "../../services/proyectoService";

// ====================================================
// 🔍 ASERTO DE AUDITORÍA INDUSTRIAL (Revisa tu terminal)
// ====================================================
console.log("====================================================");
console.log("🔍 [AUDITORÍA] Módulo importado:", usePortfolioPage);
console.log("🔍 [AUDITORÍA] Tipo de dato detectado:", typeof usePortfolioPage);
console.log("====================================================");

// Simulamos las APIs globales del navegador que Node.js no tiene dentro de Docker
if (typeof window !== "undefined") {
  window.URL.createObjectURL = vi.fn(
    () => "blob:http://localhost:5173/mock-uuid"
  );
}

describe("usePortfolioPage - Test de Integración con JSON Real", () => {
  // Limpiamos los espías antes de cada ejecución para evitar interferencias en memoria
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("debe transformar y renderizar el JSON de FastAPI en el modelo camelCase de React", async () => {
    // 1️⃣ Estructura del JSON real exacto que entrega tu servidor FastAPI
    const jsonRealFastAPI = [
      {
        id: 32,
        destino: "index",
        nombre: "Artículo de Vitrina",
        modelo: "Genérico",
        descripcion: "ofpogpf",
        foto_url: "https://supabase.co",
        tipo_articulo: "cuero",
        subcategoria: "Zapatos",
        created_at: "2026-07-17T20:31:02.734275+00:00",
        estado: "activo",
        clasificacion_calzado: "",
        genero: "",
      },
    ];

    // 2️⃣ Interceptamos la capa de red del servicio para inyectar el Mock asíncrono
    vi.spyOn(proyectoService, "obtenerTodos").mockResolvedValue(
      jsonRealFastAPI
    );

    // 3️⃣ Montamos el hook de forma aislada respetando la sintaxis limpia de renderHook
    const { result } = renderHook(() => usePortfolioPage());

    // 4️⃣ Esperamos a que el useEffect interno resuelva la promesa y guarde los datos
    await waitFor(() => {
      expect(result.current.proyectos).toHaveLength(1);
    });

    // 5️⃣ EL ASERTO: Certificamos que las llaves se tradujeron de snake_case a camelCase con éxito
    const proyectoMapeado = result.current.proyectos[0];

    expect(proyectoMapeado.id).toBe(32);
    expect(proyectoMapeado.tipoArticuloCat).toBe("cuero");
    expect(proyectoMapeado.subcategoriaUso).toBe("Zapatos");
    expect(proyectoMapeado.fotoUrl).toContain("1784320261_zapato.webp");
  });
});
import { useState, useEffect } from "react";
// 💡 CORRECCIÓN DEFINTIVA: Importaciones nombradas obligatorias con llaves
import { usePortfolioForm } from "./usePortfolioForm";
import { usePortfolioModal } from "./usePortfolioModal";
import { validarArchivoImagen } from "./mediaValidator";
import { proyectoService } from "../services/proyectoService";

export const usePortfolioPage = () => {
  const [proyectos, setProyectos] = useState([]);
  const [archivoFisicoFoto, setArchivoFisicoFoto] = useState(null);

  const formProps = usePortfolioForm();
  const modalProps = usePortfolioModal(formProps.resetFormulario, () =>
    cargarVitrinaDesdeElBackend()
  );

  const cargarVitrinaDesdeElBackend = async () => {
    try {
      const datosBD = await proyectoService.obtenerTodos();

      const proyectosMapeados = datosBD.map((p) => ({
        id: p.id,
        nombre: p.nombre || "Artículo sin nombre",
        destino: p.destino,
        modelo: p.modelo || "Genérico",
        descripcion: p.descripcion,
        tipoArticuloCat: p.tipo_articulo || "cuero",
        subcategoriaUso: p.subcategoria || "",
        fotoUrl: p.foto_url || "",
        genero: p.genero || "",
        clasificacionCalzado: p.clasificacion_calzado || "",
        estado: p.estado || "activo",
      }));

      setProyectos(proyectosMapeados);
    } catch (error) {
      console.error("❌ Error al conectar con FastAPI:", error);
    }
  };

  useEffect(() => {
    cargarVitrinaDesdeElBackend();
  }, []);

  const registrarCambio = (campo, valor) => {
    if (campo === "fotoUrl") {
      const { esValido, error } = validarArchivoImagen(valor);
      if (!esValido) {
        alert(error);
        setArchivoFisicoFoto(null);
        formProps.handleInputChange("fotoUrl", "");
        formProps.handleInputChange("nombreArchivo", "");
        return;
      }
      setArchivoFisicoFoto(valor);
      formProps.handleInputChange("fotoUrl", URL.createObjectURL(valor));
      formProps.handleInputChange("nombreArchivo", valor.name);
    } else {
      formProps.handleInputChange(campo, valor);
    }
  };

  const handleConfirmarGuardado = async () => {
    await modalProps.ejecutarPublicarProyecto(
      formProps.formData,
      archivoFisicoFoto,
      formProps.proyectoEdicionId
    );
    setArchivoFisicoFoto(null);
  };

  return {
    proyectos,
    archivoFisicoFoto,
    registrarCambio,
    handleConfirmarGuardado,
    ...formProps,
    ...modalProps,
  };
};
