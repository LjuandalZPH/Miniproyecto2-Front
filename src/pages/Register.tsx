import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/Register.scss'; 

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email: string) => /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(email);
  const validatePassword = (password: string) => password.length >= 6;

  
  const handleRegister = async (e: React.FormEvent) => {
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
      const response = await axios.post('/api/register', { email, password });
      const { token } = response.data;

      // Guardar token en el localStorage y redirigir al login
      localStorage.setItem('authToken', token);
      navigate('/login'); // Redirigir al login después de registrarse
    } catch (error) {
      setErrorMessage('Error al registrar cuenta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <h1>Crear cuenta</h1>
      <form onSubmit={handleRegister}>
        <div>
          <label htmlFor="email">Correo electrónico:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Contraseña:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {errorMessage && <p>{errorMessage}</p>}
        <button type="submit" disabled={loading}>
          {loading ? 'Creando cuenta...' : 'Crear cuenta'}
        </button>
      </form>
    </div>
  );
}

export default Register;
