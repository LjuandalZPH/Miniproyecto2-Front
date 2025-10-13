import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../../services/authService";
import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";
import "./LoginPage.scss";

export const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

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
      navigate("/profile");
    } catch (err: any) {
      console.error("Error al iniciar sesión:", err);
      setError(err?.response?.data?.message || "Credenciales inválidas o error de servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <Navbar />
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
            <Link to="/forgot" className="login-link">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};
