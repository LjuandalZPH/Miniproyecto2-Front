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
import { UserManualPage } from "../pages/UserManual/UserManualPage";

/**
 * AppRoutes Component
 *
 * This component defines all the main routes of the frontend application.
 * It uses React Router v6 and provides navigation for all pages including:
 * - Landing page
 * - Movies list
 * - Profile and authentication pages
 * - Movie details and player pages
 *
 * Accessibility & Usability Notes:
 * - Each route is clearly labeled with semantic page components.
 * - The routes follow consistent URL patterns for usability.
 * - Route elements should use accessible headings inside pages (h1, h2, etc.).
 * - Ensure focus management when navigating between pages for WCAG compliance.
 *
 * @returns {JSX.Element} The routing configuration of the app.
 */
export const AppRoutes = () => (
  <BrowserRouter>
    <Routes>
      {/* Landing page */}
      <Route path="/" element={<LandingPage />} />

      {/* Movies page */}
      <Route path="/movies" element={<MoviesPage />} />

      {/* User profile */}
      <Route path="/profile" element={<ProfilePage />} />

      {/* Registration page */}
      <Route path="/register" element={<RegisterPage />} />

      {/* About page */}
      <Route path="/about" element={<AboutPage />} />

      {/* Login page */}
      <Route path="/login" element={<LoginPage />} />

      {/* Password recovery and change */}
      <Route path="/recover" element={<RecoverPasswordPage />} />
      <Route path="/change-password" element={<ChangePasswordPage />} />

      {/* Movie details */}
      <Route path="/movies/:id" element={<MovieDetailPage />} />

      {/* Movie player */}
      <Route path="/watch/:id" element={<MoviePlayerPage />} /> 

      {/* User Manual */}
      <Route path="/manual" element={<UserManualPage />} />

    </Routes>
  </BrowserRouter>
);