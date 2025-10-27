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
  const [loading, setLoading] = useState(true);
  const [showGenres, setShowGenres] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  // Fetch all movies (simple list)
  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/movies`);
        if (!res.ok) throw new Error("Error al obtener las películas");
        const data: Movie[] = await res.json();
        setMovies(data);
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

      {/* Featured */}
      {movies.length > 0 && (
        <section className="featured">
          <div className="featured__container">
            <div className="featured__content">
              {movies[0].image && (
                <img src={movies[0].image} alt={movies[0].title} className="featured__image" />
              )}
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
        {/* Películas por género */}
        <section className="genre-section">
            <h3>
              <span className="tag">Género</span>
              <div className="genre-filter">
                <button
                  className="genre-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowGenres((s) => !s);
                  }}
                >
                  {selectedGenre ?? "Todas"} ▾
                </button>

                {showGenres && (
                  <div className="genre-list">
                    <button
                      className="genre-item"
                      onClick={() => {
                        setSelectedGenre(null);
                        setShowGenres(false);
                      }}
                    >
                      Todas
                    </button>
                    <button
                      className="genre-item"
                      onClick={() => {
                        setSelectedGenre("Ciencia ficción");
                        setShowGenres(false);
                      }}
                    >
                      Ciencia ficción
                    </button>
                    <button
                      className="genre-item"
                      onClick={() => {
                        setSelectedGenre("Documental");
                        setShowGenres(false);
                      }}
                    >
                      Documental
                    </button>
                    <button
                      className="genre-item"
                      onClick={() => {
                        setSelectedGenre("Acción");
                        setShowGenres(false);
                      }}
                    >
                      Acción
                    </button>
                  </div>
                )}
              </div>
              Películas disponibles
            </h3>
          <div className="card-grid">
            {movies.length > 0 ? (
              // aplicar filtro por género en cliente
              (selectedGenre ? movies.filter(m => (m.genre || '').toLowerCase() === selectedGenre.toLowerCase()) : movies)
                .map((movie) => (
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
      </main>
      <Footer />
    </div>
  );
};
