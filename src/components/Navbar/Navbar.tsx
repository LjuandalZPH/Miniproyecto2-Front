import { useState, useRef, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import "./Navbar.scss";

/**
 * Top navigation bar with search input and navigation links.
 * - On search submit, navigates to /movies?search=<query>
 */
export const Navbar = () => {
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const searchInput = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  useEffect(() => {
    if (showSearch && searchInput.current) {
      searchInput.current.focus();
    }
  }, [showSearch]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (q) {
      navigate(`/movies?search=${encodeURIComponent(q)}`);
      setShowSearch(false);
      setSearchQuery("");
    }
  };

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
            end
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
            Peliculas y series
          </NavLink>

          {isAuthenticated && (
            <NavLink
              to="/favorites"
              className={({ isActive }) =>
                `navbar__link ${isActive ? "navbar__link--active" : ""}`
              }
            >
              Favoritos
            </NavLink>
          )}
        </div>

        {/* Right side actions */}
        <div className="navbar__actions">
          {/* Search Icon */}
          <button
            className="navbar__icon-btn"
            aria-label="Search"
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
          {isAuthenticated && (
            <Link to="/profile" className="navbar__icon-btn" aria-label="Perfil de usuario">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="8" r="4" strokeWidth="2" />
                <path d="M4 20c2-4 6-6 8-6s6 2 8 6" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </Link>
          )}

          {/* Auth actions */}
          {!isAuthenticated ? (
            <>
              <Link to="/login" className="navbar__auth-btn">Iniciar sesión</Link>
              <Link to="/register" className="navbar__auth-btn">Registrarse</Link>
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