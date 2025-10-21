import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./MoviesPage.scss";

interface Movie {
  _id: string;
  title: string;
  description?: string;
  genre?: string;
  image?: string;
  favorite?: boolean;
  rating?: number;
}

export const MoviesPage = () => {
  const navigate = useNavigate();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [favorites, setFavorites] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
console.log(" API_URL usada:", import.meta.env.VITE_API_URL);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/movies`);
        if (!res.ok) throw new Error("Error al obtener las películas");
        const data = await res.json();
        setMovies(data);
        setFavorites(data.filter((m: Movie) => m.favorite)); // filtramos las favoritas
      } catch (error) {
        console.error("Error cargando películas:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  const handleMovieClick = (id: string) => {
    navigate(`/movies/${id}`);
  };

  if (loading) return <p className="loading">Cargando películas...</p>;

  return (
    <div className="movies-page">
      <Navbar />

      {/* 🔹 Película destacada (usa la primera del listado si existe) */}
      {movies.length > 0 && (
        <section className="featured">
          <div className="featured__container">
            <div className="featured__content">
              <h2 className="featured__title">{movies[0].title}</h2>
              <p className="featured__description">
                {movies[0].description || "Sin descripción disponible"}
              </p>
              <div className="featured__buttons">
                <button
                  className="btn btn--play"
                  onClick={() => navigate(`/watch/${movies[0]._id}`)}
                >
                  ▶ Play Now
                </button>
                <button
                  className="btn btn--comments"
                  onClick={() => navigate(`/movies/${movies[0]._id}`)}
                >
                  Comentarios
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      <main className="movies-content">
        {/* 🎬 Películas por género */}
        <section className="genre-section">
          <h3>
            <span className="tag">Género</span> Películas disponibles
          </h3>
          <div className="card-grid">
            {movies.length > 0 ? (
              movies.map((movie) => (
                <div
                  key={movie._id}
                  className="card clickable"
                  onClick={() => handleMovieClick(movie._id)}
                >
                  {movie.image ? (
                    <img src={movie.image} alt={movie.title} />
                  ) : (
                    <span>{movie.title}</span>
                  )}
                  <div className="card-overlay">
                    <h4>{movie.title}</h4>
                    <p>{movie.genre}</p>
                  </div>
                </div>
              ))
            ) : (
              <p>No hay películas disponibles.</p>
            )}
          </div>
        </section>

        {/* Tus favoritos */}
        <section className="favorites-section">
          <h3>Tus Favoritos</h3>
          <div className="card-grid">
            {favorites.length > 0 ? (
              favorites.map((movie) => (
                <div
                  key={movie._id}
                  className="card clickable"
                  onClick={() => handleMovieClick(movie._id)}
                >
                  {movie.image ? (
                    <img src={movie.image} alt={movie.title} />
                  ) : (
                    <span>{movie.title}</span>
                  )}
                  <div className="card-overlay">
                    <h4>{movie.title}</h4>
                    <p>{movie.genre}</p>
                  </div>
                </div>
              ))
            ) : (
              <p>No tienes favoritos aún.</p>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

