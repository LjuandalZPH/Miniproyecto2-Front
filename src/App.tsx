import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './styles/App.scss';

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Usamos React Router para redirigir

  const validateEmail = (email: string) => /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(email);
  const validatePassword = (password: string) => password.length >= 6; // Validación simple de contraseña

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validar correo y contraseña
    if (!validateEmail(email)) {
      setErrorMessage('Correo electrónico inválido');
      return;
    }
    if (!validatePassword(password)) {
      setErrorMessage('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('/api/login', { email, password });

      const { token } = response.data;
      localStorage.setItem('authToken', token); // Guardar token en localStorage

      // Redirigir a la página de dashboard o principal
      navigate('/dashboard');
    } catch (error) {
      setErrorMessage('Credenciales incorrectas');
    } finally {
      setLoading(false);
    }
  };
return (
  <div className="login-page">
    <div className="login-wrapper">
      <div className="login-container">
        <form onSubmit={handleSubmit} className="login-form">
          <h1>Iniciar Sesión</h1>

          <div className="input-group">
            <input
              type="email"
              placeholder="Introduce tu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <input
              type="password"
              placeholder="Introduce tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="forgot-password">
            <a href="#">¿Olvidaste tu contraseña?</a>
          </div>

          {errorMessage && <p className="error-message">{errorMessage}</p>}

          <button type="submit" disabled={loading} className="btn red">
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>

          <div className="register-section">
            <p>¿No tienes cuenta?</p>
            <button
              className="btn red"
              onClick={() => navigate('/register')}
              type="button"
            >
              Registrarme
            </button>
          </div>
        </form>
      </div>
    </div>

    <div className="login-image">
      <img src="/logo_Oscuro_Moovies.jpg" alt="Logo Moovie" />
    </div>
  </div>
);

}

export default App;


