import { useState, useRef, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import "./Navbar.scss";

/**
 * @component Navbar
 * @description Main navigation bar component for the Moovies platform.
 * Provides navigation, search functionality, and authentication-aware features.
 * 
 * Features:
 * - Responsive navigation with logo and main section links
 * - Dynamic route-based active link highlighting via NavLink
 * - Toggleable search box with auto-focus (navigates to /movies?search=<query>)
 * - Authentication-aware rendering (login/register vs logout/profile)
 * - Persistent auth state management via localStorage
 * - Accessible buttons and forms with ARIA labels
 * - Mobile-friendly design with SCSS styling
 * 
 * @example
 * ```tsx
 * // In your app's layout or main component:
 * <Navbar />
 * ```
 * 
 * @see {@link Link} from react-router-dom
 * @see {@link NavLink} from react-router-dom
 * @see {@link useNavigate} from react-router-dom
 */
export const Navbar = () => {
  /** @state {boolean} Controls visibility of the search input */
  const [showSearch, setShowSearch] = useState(false);
  
  /** @state {string} Stores the current search query */
  const [searchQuery, setSearchQuery] = useState("");
  
  /** @state {boolean} Tracks user authentication status */
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  /** @ref {React.RefObject<HTMLInputElement>} Reference to search input for auto-focus */
  const searchInput = useRef<HTMLInputElement>(null);
  
  /** @const {Function} Navigation function from react-router-dom */
  const navigate = useNavigate();

  /**
   * Effect to initialize authentication state from localStorage
   * @effect
   * @fires setIsAuthenticated
   */
  useEffect(() => {
    // Determine authentication state from localStorage token
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  /**
   * Effect to auto-focus search input when search box is toggled
   * @effect
   * @depends showSearch
   */
  useEffect(() => {
    // Focus input when the search box is toggled open
    if (showSearch && searchInput.current) {
      searchInput.current.focus();
    }
  }, [showSearch]);

  /**
   * Handles search form submission and navigates to movies search results
   * @function
   * @param {React.FormEvent} e - The form submission event
   * @fires navigate - Navigates to /movies with search query
   * @fires setShowSearch - Closes the search box
   * @fires setSearchQuery - Clears the search input
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
   * Handles user logout by clearing authentication and redirecting
   * @function
   * @fires localStorage.removeItem - Removes the authentication token
   * @fires setIsAuthenticated - Updates authentication state
   * @fires navigate - Redirects to login page
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