// src/pages/public/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";

export const Login = () => {
  const navigate = useNavigate(); // 👈 AGREGA ESTA LÍNEA

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focusedField, setFocusedField] = useState("");
  const [attemptsLeft, setAttemptsLeft] = useState(3);
  const [errorMessage, setErrorMessage] = useState("");
  const [shakeField, setShakeField] = useState({
    email: false,
    password: false,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
    }
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
    const passwordRegex =
      /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d\.,\*@#\$%\^&\+=\!]{8,}$/;

    if (!formData.email.trim()) {
      newErrors.email = "El correo electrónico es obligatorio para el acceso.";
      triggerShake("email");
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "El formato del correo no es válido.";
      triggerShake("email");
    }

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (attemptsLeft <= 0) {
      setErrorMessage(
        "Acceso bloqueado. Demasiados intentos fallidos. Intenta más tarde."
      );
      return;
    }

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const urlFinal = `${import.meta.env.VITE_API_URL}/login`;
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

      if (response.status === 401) {
        const nextAttempts = attemptsLeft - 1;
        setAttemptsLeft(nextAttempts);
        setErrorMessage(
          nextAttempts <= 0
            ? "Has agotado tus 3 intentos. Acceso bloqueado temporalmente."
            : `Credenciales inválidas. Te quedan ${nextAttempts} intentos.`
        );
        return;
      }

      if (response.status === 403) {
        setErrorMessage(
          data.detail || "Acceso denegado: Se requieren permisos de ADMIN."
        );
        return;
      }

      if (!response.ok) throw new Error("Error en la respuesta del servidor");

      if (data.access_token) localStorage.setItem("token", data.access_token);
      localStorage.setItem("isAuthenticated", "true");

      // Guardamos el nombre del usuario para mostrarlo en el Dashboard
      localStorage.setItem("userName", data.user_name || "Administrador");
      // 3. Redirigimos de inmediato al Dashboard
      navigate("/dashboard");
    } catch (error) {
      setErrorMessage(
        "Error de red o comunicación con el servidor. Verifica tu conexión."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="app-grid-container select-none">
      <Header />

      <main className="main-content">
        <h1
          className="font-normal text-gray-900 mb-6 tracking-tight text-center"
          style={{ fontSize: "var(--font-size-titulo)" }}
        >
          Inicio de Sesión
        </h1>

        <div className="w-full max-w-md mx-auto px-4 box-border">
          <Card>
            <div className="flex flex-col items-center w-full p-2">
              <img
                src="/logo(3).webp"
                className="logo mb-6 w-16 h-16 object-contain"
                alt="Logo"
              />

              <form
                onSubmit={handleSubmit}
                className="w-full flex flex-col gap-6"
              >
                {/* INPUT DE CORREO MODULARIZADO */}
                <Input
                  label="Correo"
                  type="text"
                  name="email"
                  placeholder="ejemplo@gmail.com"
                  disabled={attemptsLeft <= 0 || isSubmitting}
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField("")}
                  error={errors.email}
                  shake={shakeField.email}
                  isFocused={focusedField === "email"}
                  helperText="💡 Introduzca su correo electrónico registrado."
                />

                {/* INPUT DE CONTRASEÑA MODULARIZADO */}
                <Input
                  label="Contraseña"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Contraseña"
                  disabled={attemptsLeft <= 0 || isSubmitting}
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField("")}
                  error={errors.password}
                  shake={shakeField.password}
                  isFocused={focusedField === "password"}
                  helperText={
                    <div className="text-[11px] leading-relaxed text-slate-500 text-left">
                      <p className="font-bold border-b border-gray-200 pb-1 mb-1.5 text-amber-600">
                        🔒 Requisitos de Seguridad:
                      </p>
                      <p className="mb-1">
                        • Mínimo 8 caracteres con letras y números.
                      </p>
                      <p className="mb-1">
                        <span className="text-green-600 font-bold">
                          ✔️ Acepta:
                        </span>{" "}
                        <code className="bg-slate-100 px-1 py-0.5 rounded text-green-700 font-mono font-bold">
                          {".,*@#$%^&+="}
                        </code>
                      </p>
                      <p>
                        <span className="text-red-500 font-bold">
                          ❌ Prohibidos:
                        </span>{" "}
                        <code className="bg-slate-100 px-1 py-0.5 rounded text-red-600 font-mono font-bold">
                          {"/ \\ < > \" ' ; : ( ) [ ]"}
                        </code>
                      </p>
                    </div>
                  }
                  renderRightAction={() => (
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-slate-400 hover:text-slate-600 transition-colors pr-2 outline-none"
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
                  )}
                />

                {/* ALERTAS Y BOTÓN MODULAR */}
                <div className="flex flex-col gap-4 w-full mt-2">
                  {errorMessage && (
                    <div className="p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg text-center font-medium shadow-sm animate-fade-in">
                      <span className="block font-bold mb-0.5">
                        ⚠️ Control de Seguridad
                      </span>
                      {errorMessage}
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={isSubmitting || attemptsLeft <= 0}
                  >
                    {attemptsLeft <= 0
                      ? "Acceso Bloqueado"
                      : isSubmitting
                      ? "Autenticando..."
                      : "Iniciar Sesión"}
                  </Button>
                </div>

                {/* ENLACES AL PIE */}
                <div className="flex justify-center gap-8 text-xs font-normal text-gray-500 pt-3 text-center w-full border-t border-slate-100 mt-2">
                  <a
                    href="#forgot"
                    className="hover:text-slate-900 hover:underline transition-colors"
                  >
                    ¿Olvió su contraseña?
                  </a>
                  <a
                    href="#register"
                    className="hover:text-slate-900 hover:underline transition-colors"
                  >
                    Regístrate
                  </a>
                </div>
              </form>
            </div>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Login;
