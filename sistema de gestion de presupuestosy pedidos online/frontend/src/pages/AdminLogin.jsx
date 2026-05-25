import React, { useState } from "react";
const AdminLogin = () => {
  // Estados de control del formulario
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focusedField, setFocusedField] = useState("");

  // Estado para disparar la animación de vibración por input
  const [shakeField, setShakeField] = useState({
    email: false,
    password: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const triggerShake = (fieldName) => {
    setShakeField((prev) => ({ ...prev, [fieldName]: true }));
    setTimeout(() => {
      setShakeField((prev) => ({ ...prev, [fieldName]: false }));
    }, 500);
  };

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Regex de contraseña balanceada para desarrollo local
    const passwordRegex =
      /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d\.,\*@#\$%\^&\+=\!]{8,}$/;

    // VALIDACIÓN DE CORREO
    if (!formData.email.trim()) {
      newErrors.email = "El correo electrónico es obligatorio para el acceso.";
      triggerShake("email");
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "El formato del correo no es válido.";
      triggerShake("email");
    }

    // VALIDACIÓN DE CONTRASEÑA
    if (!formData.password) {
      newErrors.password = "La contraseña es obligatoria.";
      triggerShake("password");
    } else if (formData.password.length < 8) {
      newErrors.password =
        "Contraseña insegura. Debe contener mínimo 8 caracteres.";
      triggerShake("password");
    } else if (!passwordRegex.test(formData.password)) {
      newErrors.password =
        "La estructura debe contener al menos letras y números.";
      triggerShake("password");
    }

    return newErrors;
  };

  // FUNCIÓN CONECTADA AL BACKEND REAL (Limpia y corregida)
  // FUNCIÓN CONECTADA AL BACKEND REAL (¡Corregida y Sin Errores de Sintaxis!)
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("1. ¡Botón presionado! Iniciando handleSubmit...");

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      console.log("❌ Error de validación local:", validationErrors);
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const urlFinal = "https://tlmmdg-8000.csb.app/login";
      console.log("🚀 Enviando petición de control a:", urlFinal);

      // 🟢 CONSTRUIMOS UN FORM DATA (Por si FastAPI usa OAuth2 nativo)
      const formDataToSend = new URLSearchParams();
      // Ojo: FastAPI nativo a veces busca 'username' en vez de 'email'
      formDataToSend.append("username", formData.email);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("password", formData.password);

      // 🟢 HACEMOS LA PETICIÓN ULTRA-COMPATIBLE
      const response = await fetch(urlFinal, {
        method: "POST",
        mode: "cors",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Error en el servidor");
      }

      console.log("🏆 ¡LOGRADO! RESPUESTA DEL BACKEND:", data);
      alert("¡Inicio de sesión exitoso!");
    } catch (error) {
      console.error("🔴 ERROR EN LA PETICIÓN:", error.message);
      setErrors({ auth: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#e5e5e5] select-none">
      {/* HEADER SUPERIOR */}
      <header className="w-full bg-white border-b border-gray-200 px-8 py-3 flex justify-between items-center z-10">
        <div className="flex items-center gap-3">
          <span className="font-extrabold text-xl tracking-tighter text-slate-900 border-r border-gray-300 pr-4">
            EVOLVEX
          </span>
          <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
            Inicio
          </span>
        </div>
        <div className="flex items-center gap-4">
          <div className="border border-gray-200 rounded-lg px-4 py-1.5 bg-gray-50/50 text-xs font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 transition-all">
            Mi cuenta
          </div>
          <span className="text-blue-600 text-lg cursor-pointer">📘</span>
        </div>
      </header>

      {/* ÁREA CENTRAL */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 w-full">
        <h1 className="text-3xl font-normal text-gray-900 mb-6 tracking-tight">
          Inicio de Sesión
        </h1>

        {/* CARD CONTENEDORA */}
        <div
          className="login-card w-full max-w-[460px] mx-auto box-border"
          style={{ minWidth: "320px" }}
        >
          <img src="/logo(3).webp" alt="C3" className="mx-auto mb-4" />

          {/* Muestra errores de conexión generales del backend */}
          {errors.auth && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 text-sm text-center font-medium">
              ❌ {errors.auth}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="w-full max-w-[500px] mx-auto"
            style={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              gap: "30px",
            }}
          >
            {/* INPUT: CORREO ELECTRÓNICO */}
            <div className="flex flex-col md:flex-row md:items-start gap-3 w-full">
              <label className="w-full md:w-[30%] text-sm font-bold text-black md:text-right pt-2.5 flex-none">
                Correo
              </label>
              <div className="flex-1 w-full min-w-0 relative">
                <input
                  type="text"
                  name="email"
                  placeholder="ejemplo@gmail.com"
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField("")}
                  className={`login-input ${
                    shakeField.email ? "animate-shake" : ""
                  }`}
                  style={{
                    width: "100%",
                    height: "42px",
                    padding: "0 16px",
                    boxSizing: "border-box",
                    borderColor: errors.email ? "#dc2626" : "#cccccc",
                    backgroundColor: errors.email ? "#fef2f2" : "#e5e5e5",
                    borderWidth: "1px",
                    borderStyle: "solid",
                    display: "block",
                    outline: "none",
                  }}
                />
                {focusedField === "email" && !errors.email && (
                  <div className="absolute z-20 w-full mt-1 p-2 bg-gray-800 text-white text-xs rounded shadow-md opacity-95">
                    💡 Introduzca su correo electrónico registrado.
                  </div>
                )}
                {errors.email && (
                  <p className="text-red-600 text-xs font-medium mt-1.5">
                    {errors.email}
                  </p>
                )}
              </div>
            </div>

            {/* INPUT: CONTRASEÑA */}
            <div className="flex flex-col md:flex-row md:items-start gap-3 w-full">
              <label className="w-full md:w-[30%] text-sm font-bold text-gray-800 md:text-right pt-2.5 flex-none">
                Contraseña
              </label>

              <div className="flex-1 w-full min-w-0">
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    display: "block",
                    boxSizing: "border-box",
                    height: "42px",
                  }}
                >
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Contraseña"
                    value={formData.password}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("password")}
                    onBlur={() => setFocusedField("")}
                    className={`login-input ${
                      shakeField.password ? "animate-shake" : ""
                    }`}
                    style={{
                      width: "100%",
                      height: "42px",
                      boxSizing: "border-box",
                      paddingTop: "0px",
                      paddingBottom: "0px",
                      paddingLeft: "16px",
                      paddingRight: "44px",
                      borderColor: errors.password ? "#dc2626" : "#cccccc",
                      backgroundColor: errors.password ? "#fef2f2" : "#e5e5e5",
                      borderWidth: "1px",
                      borderStyle: "solid",
                      display: "block",
                      position: "absolute",
                      top: 0,
                      left: 0,
                      zIndex: 1,
                      outline: "none",
                    }}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="outline-none focus:outline-none cursor-pointer select-none flex items-center justify-center h-8 w-8 hover:bg-gray-200/50 rounded-full transition-colors"
                    style={{
                      position: "absolute",
                      right: "10px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      zIndex: 10,
                      margin: 0,
                      padding: 0,
                      backgroundColor: "transparent",
                      border: "none",
                    }}
                  >
                    {showPassword ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                      >
                        <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0" />
                        <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8m8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7" />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                      >
                        <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7 7 0 0 0-2.79.588l.77.771A6 6 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755q-.247.248-.517.486z" />
                        <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829" />
                        <path d="M3.35 5.47q-.27.24-.518.487A13 13 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7 7 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12z" />
                      </svg>
                    )}
                  </button>
                </div>

                {/* TOOLTIP DE REQUISITOS DE SEGURIDAD */}
                {focusedField === "password" && !errors.password && (
                  <div className="absolute z-20 w-full mt-2 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-xl opacity-98 border border-gray-700 font-sans leading-relaxed">
                    <p className="font-bold border-b border-gray-700 pb-1 mb-1.5 text-amber-400">
                      🔒 Requisitos de Seguridad:
                    </p>
                    <p className="mb-1">
                      • Mínimo 8 caracteres con letras y números.
                    </p>
                    <p className="mb-1">
                      <span className="text-green-400 font-bold">
                        ✔️ Acepta:
                      </span>{" "}
                      <code className="bg-gray-800 px-1 py-0.5 rounded text-green-300 font-mono font-bold">
                        . , * @ # $ % & + = !
                      </code>
                    </p>
                    <p>
                      <span className="text-red-400 font-bold">
                        ❌ Prohibidos:
                      </span>{" "}
                      <code className="bg-gray-800 px-1 py-0.5 rounded text-red-300 font-mono font-bold">
                        / \ &lt; &gt; " ' ; : ( ) [ ]
                      </code>
                    </p>
                  </div>
                )}
                {errors.password && (
                  <p className="text-red-600 text-xs font-medium mt-1.5">
                    {errors.password}
                  </p>
                )}
              </div>
            </div>

            {/* BOTÓN INICIAR SESIÓN */}
            <div className="pt-2 flex justify-center w-full">
              <div className="w-full md:w-[70%]">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-c3 shadow-sm active:scale-[0.99] transition-transform disabled:opacity-60 w-full"
                >
                  {isSubmitting ? "Autenticando..." : "Iniciar Sesión"}
                </button>
              </div>
            </div>

            {/* ENLACES AL PIE */}
            <div
              className="flex justify-center gap-8 text-xs font-normal text-gray-600 pt-1 w-full"
              style={{ textAlign: "center" }}
            >
              <a
                href="#forgot"
                className="hover:text-black hover:underline transition-colors"
              >
                ¿Olvidó su contraseña?
              </a>
              <a
                href="#register"
                className="hover:text-black hover:underline transition-colors"
              >
                Regístrate
              </a>
            </div>
          </form>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="py-4 text-center text-xs text-gray-400 font-normal z-10">
        &copy; {new Date().getFullYear()} EVOLVEX. Todos los derechos
        reservados.
      </footer>
    </div>
  );
};

export default AdminLogin;
