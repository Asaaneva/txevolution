const API_URL = import.meta.env.VITE_API_URL || "https://fuzzy-couscous-pjpvr5wrj675f7xw6-8000.app.github.dev";

export const proyectoService = {
  obtenerTodos: async () => {
    const res = await fetch(`${API_URL}/api/proyectos`, {
      method: "GET",
      mode: "cors",
      credentials: "include", // 👈 Vital para que viaje la cookie de sesión
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(`Error HTTP: ${res.status}`);
    }

    return await res.json();
  },

  crear: async (dataProyecto) => {
    const res = await fetch(`${API_URL}/api/proyectos`, {
      method: "POST",
      mode: "cors",
      credentials: "include", // 👈 Vital
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(dataProyecto),
    });
    if (!res.ok) throw new Error("No se pudo registrar el proyecto.");
    return await res.json();
  },

  actualizar: async (id, dataProyecto) => {
    const res = await fetch(`${API_URL}/api/proyectos/${id}`, {
      method: "PUT",
      mode: "cors",
      credentials: "include", // 👈 Vital
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(dataProyecto),
    });
    if (!res.ok) throw new Error("No se pudo actualizar.");
    return await res.json();
  },

  eliminar: async (id) => {
    const res = await fetch(`${API_URL}/api/proyectos/${id}`, {
      method: "DELETE",
      mode: "cors",
      credentials: "include", // 👈 Vital para traer los projectos ya que requieren autorizacion
      headers: {
        Accept: "application/json",
      },
    });
    if (!res.ok) throw new Error("No se pudo eliminar.");
    return true;
  },
};