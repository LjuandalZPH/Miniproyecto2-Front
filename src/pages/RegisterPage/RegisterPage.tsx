import React, { useState } from "react";
import "./RegisterPage.scss";
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';

const RegisterPage: React.FC = () => {
  const [preview, setPreview] = useState<string | null>(null);

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
    alert("Registro enviado ✅");
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
            <input type="number" placeholder="Edad" required />
            <input type="email" placeholder="Correo Electrónico" required />
            <input type="password" placeholder="Contraseña" required />
            <input type="password" placeholder="Confirmar Contraseña" required />
            <button type="submit" className="confirm-btn">Confirmar</button>
            </form>
        </div>

        <div className="register-image">
            <label htmlFor="imageUpload" className="image-label">
            <img
                src={preview || "/MoovieNormal.png"}
                alt="preview"
                className="preview-image"
            />
            </label>
        </div>
        </div>
        <Footer />
    </div>
  );
};

export default RegisterPage;
