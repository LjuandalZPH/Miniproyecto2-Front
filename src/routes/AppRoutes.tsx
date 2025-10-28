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
import FavoritesPage from '../pages/FavoritesPage/FavoritesPage';

/**
 * AppRoutes
 *
 * Top-level React Router configuration for the application. This component
 * wires URL paths to page components. It intentionally contains no route
 * guarding or authentication logic — each page component is responsible for
 * handling access control where applicable.
 *
 * Notes:
 * - Keep this file strictly presentational: adding, removing or reordering
 *   routes will change the application's navigation.
 * - All edits here should be comments or route additions only when possible.
 *
 * No props are accepted. The component returns a BrowserRouter with the
 * application's Routes and Route declarations.
 */
export const AppRoutes = () => (
  <BrowserRouter>
    <Routes>
      {/* Public / landing pages */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/movies" element={<MoviesPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/about" element={<AboutPage />} />
      {/* Auth / session pages */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/recover" element={<RecoverPasswordPage />} />
      <Route path="/change-password" element={<ChangePasswordPage />} />
      {/* Movie-specific routes: details and player */}
      <Route path="/movies/:id" element={<MovieDetailPage />} />
      <Route path="/watch/:id" element={<MoviePlayerPage />} /> 
      {/* User favorites and collections */}
      <Route path="/favorites" element={<FavoritesPage />} />
    </Routes>
  </BrowserRouter>
);

