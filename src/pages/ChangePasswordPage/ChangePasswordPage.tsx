import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import "./ChangePasswordPage.scss";
import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";

/**
 * @component ChangePasswordPage
 * @description Password reset page component that allows users to set a new password using a reset token.
 * The token is expected to be provided as a URL query parameter.
 * 
 * Features:
 * - Token validation from URL parameters
 * - Password and confirmation validation
 * - Error handling and user feedback
 * - Loading states for form submission
 * - Automatic redirect after successful password change
 * - Responsive design with SCSS styling
 * 
 * @example
 * ```tsx
 * // URL format: /change-password?token=resetTokenHere
 * <Route path="/change-password" element={<ChangePasswordPage />} />
 * ```
 */
const ChangePasswordPage: React.FC = () => {
  /** @const {URLSearchParams} Hook to access URL query parameters */
  const [searchParams] = useSearchParams();
  
  /** @const {Function} Navigation function from react-router-dom */
  const navigate = useNavigate();

  /** @const {string | null} Reset token from URL query parameter */
  const token = searchParams.get("token");
  
  /** @state {string} New password input value */
  const [password, setPassword] = useState("");
  
  /** @state {string} Password confirmation input value */
  const [confirmPassword, setConfirmPassword] = useState("");
  
  /** @state {boolean} Loading state during form submission */
  const [loading, setLoading] = useState(false);
  
  /** @state {string} Success message to display to user */
  const [message, setMessage] = useState("");
  
  /** @state {string} Error message to display to user */
  const [error, setError] = useState("");

  /**
   * Handles the password change form submission
   * @async
   * @function handleChangePassword
   * @param {React.FormEvent} e - Form submission event
   * @fires setError - Sets error message if validation fails
   * @fires setMessage - Sets success message after password change
   * @fires setLoading - Updates loading state during API call
   * @fires navigate - Redirects to login page after success
   */
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
      {/* Global navigation */}
      <Navbar />

      {/* Main password change form container */}
      <div className="change-container">
        <div className="change-card">
          <h2>Restablecer Contraseña</h2>
          <p className="change-text">
            Ingresa una nueva contraseña para recuperar el acceso a tu cuenta.
          </p>

          {/* Password change form */}
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

          {/* Feedback messages */}
          {message && <p className="success-text">{message}</p>}
          {error && <p className="error-text">{error}</p>}

          {/* Navigation button */}
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
