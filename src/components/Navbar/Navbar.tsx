import { Link, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import './Navbar.scss';

export const Navbar = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const searchInput = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check authentication status on mount and when token changes
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  useEffect(() => {
    if (showSearch && searchInput.current) {
      searchInput.current.focus();
    }
  }, [showSearch]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Aquí puedes redirigir o manejar la búsqueda
      alert(`Buscando: ${searchQuery}`);
      setShowSearch(false);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    // Navegar al login, o recargar la página
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar__container">
        {/* Logo */}
        <Link to="/" className="navbar__logo">
          <img 
            src="/MoovieNormal.png" 
            alt="Moovies Logo" 
            className="navbar__logo-icon"
          />
          <span className="navbar__logo-text">Moovies</span>
        </Link>

        {/* Navigation Links */}
        <div className="navbar__nav">
          <Link 
            to="/" 
            className={`navbar__link ${activeTab === 'home' ? 'navbar__link--active' : ''}`}
            onClick={() => setActiveTab('home')}
          >
            Home
          </Link>
          <Link 
            to="/movies" 
            className={`navbar__link ${activeTab === 'movies' ? 'navbar__link--active' : ''}`}
            onClick={() => setActiveTab('movies')}
          >
            Movies & Shows
          </Link>
        </div>

        {/* Right side actions */}
        <div className="navbar__actions">
          {/* Search Icon */}
          <button
            className="navbar__icon-btn"
            aria-label="Buscar"
            onClick={() => setShowSearch(prev => !prev)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="11" cy="11" r="8" strokeWidth="2"/>
              <path d="M21 21L16.65 16.65" strokeWidth="2" strokeLinecap="round"/>
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
                onChange={e => setSearchQuery(e.target.value)}
                onBlur={() => setShowSearch(false)}
                aria-label="Buscar"
              />
            </form>
          )}

          {/* User Icon */}
          <Link to="/profile" className="navbar__icon-btn" aria-label="Perfil de usuario">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="8" r="4" strokeWidth="2"/>
              <path d="M4 20C4 16.6863 6.68629 14 10 14H14C17.3137 14 20 16.6863 20 20" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </Link>

          {/* Auth Buttons */}
          {!isAuthenticated ? (
            <>
              <Link to="/login" className="navbar__auth-btn navbar__auth-btn--login">
                Iniciar sesión
              </Link>
              <Link to="/register" className="navbar__auth-btn navbar__auth-btn--register">
                Registrarse
              </Link>
            </>
          ) : (
            <button
              className="navbar__auth-btn navbar__auth-btn--logout"
              onClick={handleLogout}
            >
              Cerrar sesión
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};