import { useState } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";
import "./LoginPage.scss";

export const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
 
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("¡Inicio de sesión simulado!");
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
              onChange={e => setEmail(e.target.value)}
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
              onChange={e => setPassword(e.target.value)}
            />

            <button type="submit" className="login-btn">
              Iniciar sesión
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