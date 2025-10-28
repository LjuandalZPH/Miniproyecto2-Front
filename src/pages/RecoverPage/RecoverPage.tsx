import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./RecoverPage.scss";
import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";

/**
 * @component RecoverPasswordPage
 * @description Page for initiating a password recovery flow. The user enters
 * their registered email and the app posts it to the backend recover endpoint.
 * The component shows loading, success and error states and provides a back
 * button to return to the login screen.
 *
 * Note: This component only initiates the recovery email; the actual reset
 * token handling is performed elsewhere (ChangePasswordPage).
 *
 * @returns {JSX.Element} Recover password page
 */
const RecoverPasswordPage: React.FC = () => {
  /** Email address entered by the user for recovery */
  const [email, setEmail] = useState("");
  /** Loading flag while the recovery request is in progress */
  const [loading, setLoading] = useState(false);
  /** Success or informational message returned from the server */
  const [message, setMessage] = useState("");
  /** Error message to display when submission fails or validation fails */
  const [error, setError] = useState("");
  /** Navigation helper from react-router-dom */
  const navigate = useNavigate();

  /**
   * Submit the recovery request to the backend.
   * Validates the email locally then posts to `/api/users/recover-password`.
   * Shows loading state and displays server message or errors.
   *
   * @param {React.FormEvent} e - Form submission event
   */
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
      //  Usa tu endpoint real aquí:
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

  /** Navigate back to the login page */
  const handleBack = () => {
    navigate("/login");
  };

  // Render: form, messages, and back button. No functional changes here.
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

