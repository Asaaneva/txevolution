import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/authService";

export function useAuthForm(onSuccessLogin) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attemptsLeft, setAttemptsLeft] = useState(3);
  const [errorMessage, setErrorMessage] = useState("");
  const [shakeField, setShakeField] = useState({
    email: false,
    password: false,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name])
      setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const triggerShake = (fieldName) => {
    setShakeField((prev) => ({ ...prev, [fieldName]: true }));
    setTimeout(
      () => setShakeField((prev) => ({ ...prev, [fieldName]: false })),
      500
    );
  };

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex =
      /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d\.,\*@#\$%\^&\+=\!]{8,}$/;

    if (!formData.email.trim()) {
      newErrors.email = "El correo electrónico es obligatorio.";
      triggerShake("email");
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "El formato del correo no es válido.";
      triggerShake("email");
    }

    if (!formData.password) {
      newErrors.password = "La contraseña es obligatoria.";
      triggerShake("password");
    } else if (
      formData.password.length < 8 ||
      !passwordRegex.test(formData.password)
    ) {
      newErrors.password =
        "Contraseña insegura o estructura inválida (mínimo 8 caracteres).";
      triggerShake("password");
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (attemptsLeft <= 0) {
      setErrorMessage("Acceso bloqueado. Demasiados intentos fallidos.");
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
      const result = await authService.iniciarSesion(
        formData.email,
        formData.password
      );

      if (result.status === 401) {
        const nextAttempts = attemptsLeft - 1;
        setAttemptsLeft(nextAttempts);
        setErrorMessage(
          nextAttempts <= 0
            ? "Has agotado tus 3 intentos. Acceso bloqueado."
            : `Credenciales inválidas. Quedan ${nextAttempts} intentos.`
        );
        return;
      }

      if (result.status === 403) {
        setErrorMessage(
          result.data.detail ||
            "Acceso denegado: Se requieren permisos de ADMIN."
        );
        return;
      }

      if (!result.ok) throw new Error();

      // Guardamos la sesión local de forma transparente
      localStorage.setItem("token", result.data.access_token);
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem(
        "userName",
        result.data.user_name || "Administrador"
      );

      // Inyectamos el usuario en el AuthContext global
      if (onSuccessLogin) onSuccessLogin(result.data.user);

      navigate("/dashboard");
    } catch {
      setErrorMessage("Error de red o comunicación con el servidor.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    errors,
    isSubmitting,
    attemptsLeft,
    errorMessage,
    shakeField,
    handleChange,
    handleSubmit,
  };
}
