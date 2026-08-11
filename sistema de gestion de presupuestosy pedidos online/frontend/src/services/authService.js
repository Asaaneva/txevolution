const API_URL = import.meta.env.VITE_API_URL || "https://fuzzy-couscous-pjpvr5wrj675f7xw6-8000.app.github.dev";

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