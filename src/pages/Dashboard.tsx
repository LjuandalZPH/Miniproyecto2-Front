import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  // Verificar si el usuario está autenticado cuando el componente se monta
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/'); // Redirigir al login si no hay token
    } else {
      setIsAuthenticated(true); // Si hay token, el usuario está autenticado
    }
  }, [navigate]);

  return isAuthenticated ? (
    <div>
      <h1>Bienvenido al Dashboard</h1>
      <button onClick={handleLogout}>Cerrar sesión</button>
      {/* Aquí puedes añadir más contenido del dashboard */}
    </div>
  ) : (
    <p>Redirigiendo...</p> // Mientras se valida la autenticación
  );
};

// Función para manejar el cierre de sesión
const handleLogout = () => {
  localStorage.removeItem('authToken');  // Eliminar el token del almacenamiento local
  window.location.href = '/';  // Redirigir al login
};

export default Dashboard;
