const API_URL = import.meta.env.VITE_API_URL || "https://pdxqgg-8000.csb.app";

export const authService = {
  async iniciarSesion(email, password) {
    const urlFinal = `${API_URL}/login`;

    const response = await fetch(urlFinal, {
      method: "POST",
      mode: "cors",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    return { status: response.status, ok: response.ok, data };
  },
};
