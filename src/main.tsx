import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './styles/index.scss';
import App from './App.tsx';
import Dashboard from './pages/Dashboard.tsx'; 
import Register from './pages/Register.tsx';
import PrivateRoute from './pages/PrivateRoute.tsx';

const root = createRoot(document.getElementById('root')!);

root.render(
  <StrictMode>
    <Router>
      <Routes>
        {/* Ruta pública */}
        <Route path="/" element={<App />} />
        <Route path="/register" element={<Register />} />
        {/* Ruta privada protegida */}
        <Route
          path="/dashboard"
          
          element={
            <PrivateRoute>
              <Dashboard /> {/* Aquí se pasa 'Dashboard' como children */}
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  </StrictMode>
  
);