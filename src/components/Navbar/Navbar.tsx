import { Link } from 'react-router-dom';
import { useState } from 'react';
import './Navbar.scss';

export const Navbar = () => {
  const [activeTab, setActiveTab] = useState('home');

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
          <button className="navbar__icon-btn" aria-label="Search">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="11" cy="11" r="8" strokeWidth="2"/>
              <path d="M21 21L16.65 16.65" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>

          {/* User Icon */}
          <button className="navbar__icon-btn" aria-label="User profile">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="8" r="4" strokeWidth="2"/>
              <path d="M4 20C4 16.6863 6.68629 14 10 14H14C17.3137 14 20 16.6863 20 20" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
};