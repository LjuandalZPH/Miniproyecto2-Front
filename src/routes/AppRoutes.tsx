import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LandingPage } from '../pages/LandingPage/LandingPage';
import { MoviesPage } from '../pages/MoviesPage/MoviesPage';

export const AppRoutes = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/movies" element={<MoviesPage />} />
    </Routes>
  </BrowserRouter>
);

