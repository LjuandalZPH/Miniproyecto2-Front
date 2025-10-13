import React, { useState, useEffect } from "react";
import "./RecoverPage.scss";
import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";

const RecoverPasswordPage: React.FC = () => {
  const [email, setEmail] = useState("");

  useEffect(() => {
    setEmail("usuario@ejemplo.com");
  }, []);

  return (
    <div className="recover-page">
      <Navbar />

      <div className="recover-container">
        <div className="recover-card">
          <h2>Recuperar Mi Cuenta</h2>
          <p className="recover-text">
            Para recuperar tu contraseña, por favor ingresa tu dirección de correo registrada.
          </p>

          <form className="recover-form">
            <input
              type="email"
              placeholder="Introduce tu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button type="button" className="send-btn">
              Enviar
            </button>
          </form>

          <button type="button" className="back-btn">
            ← Volver
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default RecoverPasswordPage;
