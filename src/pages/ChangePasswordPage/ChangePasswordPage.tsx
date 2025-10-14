import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import "./ChangePasswordPage.scss";
import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";

const ChangePasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!password || !confirmPassword) {
      setError("Por favor completa ambos campos.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    if (!token) {
      setError("Token no válido o faltante.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/users/reset-password`,
        { token, newPassword: password }
      );

      setMessage(response.data.message || "Contraseña cambiada con éxito.");
      setTimeout(() => navigate("/login"), 2500);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "Error al cambiar la contraseña.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="change-password-page">
      <Navbar />

      <div className="change-container">
        <div className="change-card">
          <h2>Restablecer Contraseña</h2>
          <p className="change-text">
            Ingresa una nueva contraseña para recuperar el acceso a tu cuenta.
          </p>

          <form className="change-form" onSubmit={handleChangePassword}>
            <input
              type="password"
              placeholder="Nueva contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
            <input
              type="password"
              placeholder="Confirmar nueva contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading}
            />

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Guardando..." : "Cambiar contraseña"}
            </button>
          </form>

          {message && <p className="success-text">{message}</p>}
          {error && <p className="error-text">{error}</p>}

          <button
            className="back-btn"
            onClick={() => navigate("/login")}
            disabled={loading}
          >
            ← Volver al inicio de sesión
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ChangePasswordPage;
