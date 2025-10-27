import { useState, useRef, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import "./Navbar.scss";

/**
 * Top navigation bar with search input and navigation links.
 * - On search submit, navigates to /movies?search=<query>
 */
export const Navbar = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const searchInput = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check authentication status on mount
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  useEffect(() => {
    // Focus the input when the search box becomes visible
    if (showSearch && searchInput.current) {
      searchInput.current.focus();
    }
  }, [showSearch]);

  /**
   * Handle the search form submission.
   * Navigates to /movies with the "search" query parameter.
   */
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (q) {
      navigate(`/movies?search=${encodeURIComponent(q)}`);
      setShowSearch(false);
      setSearchQuery("");
    }
  };

  /**
   * Clear auth token and navigate to login page.
   */
  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar__container">
        {/* Logo */}
        <Link to="/" className="navbar__logo">
          <img src="/MoovieNormal.png" alt="Moovies Logo" className="navbar__logo-icon" />
          <span className="navbar__logo-text">Moovies</span>
        </Link>

        {/* Navigation Links */}
        <div className="navbar__nav">
          <NavLink
            to="/"
              className={({ isActive }) =>
                `navbar__link ${isActive ? "navbar__link--active" : ""}`
              }
          >
            Inicio
          </NavLink>
          <NavLink
            to="/movies"
              className={({ isActive }) =>
                `navbar__link ${isActive ? "navbar__link--active" : ""}`
              }
          >
            Películas & Shows
          </NavLink>
        </div>

        {/* Right side actions */}
        <div className="navbar__actions">
          {/* Search Icon */}
          <button
            className="navbar__icon-btn"
            aria-label="Buscar"
            onClick={() => setShowSearch((prev) => !prev)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="11" cy="11" r="8" strokeWidth="2" />
              <path d="M21 21L16.65 16.65" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>

          {showSearch && (
            <form className="navbar__search-form" onSubmit={handleSearchSubmit}>
              <input
                ref={searchInput}
                className="navbar__search-input"
                type="text"
                placeholder="Buscar..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onBlur={() => setShowSearch(false)}
                aria-label="Buscar"
              />
            </form>
          )}

          {/* User Icon */}
          <Link to="/profile" className="navbar__icon-btn" aria-label="Perfil de usuario">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="8" r="4" strokeWidth="2" />
              <path d="M4 20c2-4 6-6 8-6s6 2 8 6" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </Link>

          {/* Auth actions */}
          {!isAuthenticated ? (
            <>
              {/* Show both login and register when not authenticated */}
              <Link to="/login" className="navbar__auth-btn">
                Iniciar sesión
              </Link>
              <Link to="/register" className="navbar__auth-btn">
                Registrarse
              </Link>
            </>
          ) : (
            <button className="navbar__auth-btn" onClick={handleLogout}>
              Cerrar sesión
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};
