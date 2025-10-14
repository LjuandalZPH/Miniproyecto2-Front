import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./RecoverPage.scss";
import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";

const RecoverPasswordPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRecover = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!email) {
      setError("Por favor, introduce un correo válido.");
      return;
    }

    try {
      setLoading(true);
      // 👇 Usa tu endpoint real aquí:
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/users/recover-password`,
        { email }
      );

      setMessage(response.data.message || "Correo de recuperación enviado.");
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "Error al enviar el correo.");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate("/login");
  };

  return (
    <div className="recover-page">
      <Navbar />

      <div className="recover-container">
        <div className="recover-card">
          <h2>Recuperar Mi Cuenta</h2>
          <p className="recover-text">
            Para recuperar tu contraseña, por favor ingresa tu dirección de correo registrada.
          </p>

          <form className="recover-form" onSubmit={handleRecover}>
            <input
              type="email"
              placeholder="Introduce tu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />

            <button
              type="submit"
              className="send-btn"
              disabled={loading}
            >
              {loading ? "Enviando..." : "Enviar"}
            </button>
          </form>

          {message && <p className="success-text">{message}</p>}
          {error && <p className="error-text">{error}</p>}

          <button
            type="button"
            className="back-btn"
            onClick={handleBack}
            disabled={loading}
          >
            ← Volver
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default RecoverPasswordPage;

