import React, { useState } from "react";
import "./RegisterPage.scss";
import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";
import { useNavigate } from "react-router-dom";

const RegisterPage: React.FC = () => {
  const [preview, setPreview] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Registro enviado");
  };

  return (
    <div className="register-page">
      <Navbar />

      <div className="register-container">
        <div className="register-card">
          <h2>Registro</h2>

          <form className="register-form" onSubmit={handleSubmit}>
            <input type="text" placeholder="Nombre" required />
            <input type="text" placeholder="Apellido" required />
            <input
              type="text"
              placeholder="Edad"
              required
              inputMode="numeric" 
              pattern="[0-9]*"
            />

            <input type="email" placeholder="Correo Electrónico" required />
            <input type="password" placeholder="Contraseña" required />
            <input type="password" placeholder="Confirmar Contraseña" required />
            <button type="submit" className="confirm-btn">Confirmar</button>
          </form>

          <div className="login-redirect">
            <p>
              ¿Ya tienes una cuenta?{" "}
              <span onClick={() => navigate("/login")}>Inicia sesión</span>
            </p>
          </div>
        </div>

        <div className="register-image">
          <label htmlFor="imageUpload" className="image-label">
            <img
              src={preview || `${import.meta.env.BASE_URL}MoovieNormal.png`}
              alt="preview"
              className="preview-image"
            />
          </label>
          <input
            id="imageUpload"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{ display: "none" }}
          />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default RegisterPage;


