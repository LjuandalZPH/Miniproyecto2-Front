import React from "react";
import "./ChangePasswordPage.scss";
import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";

const ChangePasswordPage: React.FC = () => {
  
  return (
    <div className="change-password-page">
      <Navbar />

      <div className="change-container">
        <div className="change-card">
          <h2>Recuperar Mi Cuenta</h2>
          <p className="change-text">
            Se ha enviado un correo de recuperación a la dirección de correo
            introducida.
          </p>

          <p className="secondary-text">¿No recibiste el correo?</p>

          <div className="button-group">
            <button className="resend-btn">Reenviar enlace</button>
            <button className="accept-btn">Aceptar</button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ChangePasswordPage;
