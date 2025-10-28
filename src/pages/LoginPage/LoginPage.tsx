import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../../services/authService";
import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";
import "./LoginPage.scss";

/**
 * @component LoginPage
 * @description Login page component that handles user authentication.
 * Provides email/password login functionality with error handling and loading states.
 * 
 * Features:
 * - Email and password validation
 * - Loading state during authentication
 * - Error message display
 * - Automatic redirect after successful login
 * - Links to registration and password recovery
 * - Accessible form with ARIA labels
 * - Secure password handling with proper autocomplete attributes
 * 
 * @example
 * ```tsx
 * <Route path="/login" element={<LoginPage />} />
 * ```
 * 
 * @returns {JSX.Element} A login page with form and navigation options
 */
export const LoginPage = () => {
  /** @state {string} Email input value */
  const [email, setEmail] = useState("");
  
  /** @state {string} Password input value */
  const [password, setPassword] = useState("");
  
  /** @state {boolean} Loading state during form submission */
  const [loading, setLoading] = useState(false);
  
  /** @state {string | null} Error message to display */
  const [error, setError] = useState<string | null>(null);
  
  /** @const {Function} Navigation function from react-router-dom */
  const navigate = useNavigate();

  /**
   * Handles the login form submission
   * @async
   * @param {React.FormEvent} e - Form submission event
   * @fires login - Attempts to authenticate user
   * @fires setError - Updates error state if login fails
   * @fires setLoading - Updates loading state during authentication
   * @fires navigate - Redirects to /movies on successful login
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const data = await login(email, password);

      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      // Redirige al perfil tras login exitoso
      navigate("/movies");
    } catch (err: any) {
      console.error("Error al iniciar sesión:", err);
      setError(err?.response?.data?.message || "Credenciales inválidas o error de servidor");
    } finally {
      setLoading(false);
    }
  };

  /**
   * @returns {JSX.Element} Login page with form and navigation
   */
  return (
    <div className="login-page">
      {/* Global navigation */}
      <Navbar />
      {/* Main content area */}
      <main className="login-main">
        <section className="login-card" aria-labelledby="login-title">
          <h1 id="login-title">Iniciar sesión</h1>

          <form className="login-form" autoComplete="off" onSubmit={handleSubmit}>
            <label htmlFor="login-email">Correo electrónico</label>
            <input
              type="email"
              id="login-email"
              name="email"
              autoComplete="username"
              placeholder="ejemplo@correo.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />

            <label htmlFor="login-password">Contraseña</label>
            <input
              type="password"
              id="login-password"
              name="password"
              autoComplete="current-password"
              placeholder="Tu contraseña"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />

            {error && <p className="login-error">{error}</p>}

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? "Iniciando sesión..." : "Iniciar sesión"}
            </button>
          </form>

          <div className="login-links">
            <Link to="/register" className="login-link">
              ¿No tienes cuenta? Regístrate
            </Link>
            <Link to="/recover" className="login-link">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};
