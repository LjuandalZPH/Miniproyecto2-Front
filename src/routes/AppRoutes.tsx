import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LandingPage } from '../pages/LandingPage/LandingPage';
import { MoviesPage } from '../pages/MoviesPage/MoviesPage';
import ProfilePage from "../pages/ProfilePage/ProfilePage";
import RegisterPage from "../pages/RegisterPage/RegisterPage";
import { AboutPage } from '../pages/AboutPage';
import { LoginPage } from '../pages/LoginPage/LoginPage';
import RecoverPasswordPage from "../pages/RecoverPage/RecoverPage";
import ChangePasswordPage from "../pages/ChangePasswordPage/ChangePasswordPage";
import MovieDetailPage from '../pages/MoviesDetails/MoviesDetails';
import MoviePlayerPage from "../pages/MoviesPlayerPage/MoviesPlayerPage"; 

export const AppRoutes = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/movies" element={<MoviesPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/recover" element={<RecoverPasswordPage />} />
      <Route path="/change-password" element={<ChangePasswordPage />} />
      <Route path="/movies/:id" element={<MovieDetailPage />} />
      <Route path="/watch/:id" element={<MoviePlayerPage />} /> {/* 👈 agregada */}
    </Routes>
  </BrowserRouter>
);

