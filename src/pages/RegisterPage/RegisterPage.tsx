import React, { useState } from "react";
import "./RegisterPage.scss";
import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";
import { useNavigate } from "react-router-dom";
import { register } from "../../services/authService";

const RegisterPage: React.FC = () => {
  const [preview, setPreview] = useState<string | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState<number | "">("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  /** 
   * Valida la contraseña según los requisitos:
   * - Mínimo 8 caracteres
   * - Al menos una letra mayúscula
   * - Al menos una letra minúscula
   * - Al menos un número
   * - Al menos un carácter especial
   */
  const validatePassword = (password: string): string | null => {
    const requirements = [
      { regex: /.{8,}/, message: "Debe tener al menos 8 caracteres." },
      { regex: /[A-Z]/, message: "Debe contener al menos una letra mayúscula." },
      { regex: /[a-z]/, message: "Debe contener al menos una letra minúscula." },
      { regex: /[0-9]/, message: "Debe contener al menos un número." },
      { regex: /[!@#$%^&*(),.?":{}|<>]/, message: "Debe incluir un símbolo o carácter especial." },
    ];

    const failed = requirements.filter(r => !r.regex.test(password));
    if (failed.length > 0) {
      return failed.map(f => f.message).join("\n");
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!firstName.trim() || !lastName.trim() || !age || !email.trim() || !password) {
      setError("Por favor completa todos los campos requeridos.");
      return;
    }

    if (typeof age === "number" && (age <= 0 || age > 120)) {
      setError("Ingresa una edad válida.");
      return;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(" Contraseña inválida:\n" + passwordError);
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        age: Number(age),
        email: email.trim(),
        password,
      };

      const res = await register(payload);
      console.log("Usuario registrado:", res);

      alert(" Usuario registrado correctamente.");
      navigate("/login");
    } catch (err: any) {
      console.error("Error de registro:", err);
      const msg = err?.response?.data?.message || err?.message || "Error al registrar usuario";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <Navbar />

      <div className="register-container">
        <div className="register-card">
          <h2>Registro</h2>

          <form className="register-form" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Nombre"
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              disabled={loading}
            />
            <input
              type="text"
              placeholder="Apellido"
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              disabled={loading}
            />
            <input
              type="number"
              placeholder="Edad"
              required
              inputMode="numeric"
              pattern="[0-9]*"
              min={1}
              value={age}
              onChange={(e) => setAge(e.target.value ? Number(e.target.value) : "")}
              disabled={loading}
            />
            <input
              type="email"
              placeholder="Correo Electrónico"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
            <input
              type="password"
              placeholder="Contraseña"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
            <input
              type="password"
              placeholder="Confirmar Contraseña"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading}
            />

            {error && (
              <div className="form-error">
                {error.split("\n").map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
            )}

            <button type="submit" className="confirm-btn" disabled={loading}>
              {loading ? "Registrando..." : "Confirmar"}
            </button>
          </form>

          <div className="login-redirect">
            <p>
              ¿Ya tienes una cuenta?{" "}
              <span onClick={() => navigate("/login")} style={{ cursor: "pointer", color: "#0b5fff" }}>
                Inicia sesión
              </span>
            </p>
          </div>
        </div>

        <div className="register-image">
          <label htmlFor="imageUpload" className="image-label" style={{ cursor: "pointer" }}>
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
            disabled={loading}
          />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default RegisterPage;



