
import { Navigate } from 'react-router-dom';

interface PrivateRouteProps {
  children: JSX.Element;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const token = localStorage.getItem('authToken');

  if (!token) {
    // Si no hay token, redirige al login
    return <Navigate to="/" />;
  }

  // Si hay token, renderiza el contenido protegido
  return children;
};

export default PrivateRoute;


