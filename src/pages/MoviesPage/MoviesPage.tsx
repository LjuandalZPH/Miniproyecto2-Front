import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';
import { useNavigate } from 'react-router-dom';
import './MoviesPage.scss';

export const MoviesPage = () => {
  const navigate = useNavigate();

  // Función que maneja el click en una película
  const handleMovieClick = (id: string) => {
    navigate(`/movies/${id}`);
  };

  return (
    <div className="movies-page">
      <Navbar />

      <section className="featured">
        <div className="featured__container">
          <div className="featured__content">
            <h2 className="featured__title">FEATURED MOVIE TITLE</h2>
            <p className="featured__description">
              Placeholder featured movie description
            </p>
            <div className="featured__buttons">
              <button className="btn btn--play">▶ Play Now</button>
              <button className="btn btn--comments">Comentarios</button>
            </div>
          </div>
        </div>
      </section>

      <main className="movies-content">
        {/* Películas por género */}
        <section className="genre-section">
          <h3>
            <span className="tag">Género</span> Películas por género
          </h3>
          <div className="card-grid">
            {['1', '2', '3', '4', '5'].map((n) => (
              <div
                key={n}
                className="card clickable"
                onClick={() => handleMovieClick(n)}
              >
                <span>Placeholder {n}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Tus favoritos */}
        <section className="favorites-section">
          <h3>Tus Favoritos</h3>
          <div className="card-grid">
            {['6', '7', '8', '9', '10'].map((n) => (
              <div
                key={n}
                className="card clickable"
                onClick={() => handleMovieClick(n)}
              >
                <span>Placeholder {n}</span>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

