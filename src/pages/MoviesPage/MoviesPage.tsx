import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Navbar } from "../../components/Navbar";
import "./MoviesPage.scss";

interface Movie {
  _id: string;
  title: string;
  description?: string;
  image?: string;
  genre?: string;
  favorite?: boolean;
}

/**
 * Movies page that lists movies.
 * - Reads "search" query param and requests filtered results from backend.
 */
export const MoviesPage = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [favorites, setFavorites] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const search = (searchParams.get("search") || "").trim();

  useEffect(() => {
    /**
     * Fetch movies from backend.
     * If "search" exists, appends it as a query parameter.
     */
    const fetchMovies = async () => {
      setLoading(true);
      try {
        const qs = search ? `?search=${encodeURIComponent(search)}` : "";
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/movies${qs}`);
        if (!res.ok) throw new Error("Error al obtener las películas");
        const data: Movie[] = await res.json();
        setMovies(data);
        setFavorites(data.filter((m) => m.favorite));
      } catch (error) {
        console.error("Error cargando películas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [search]);

  /**
   * Navigate to movie details by ID.
   */
  const handleMovieClick = (id: string) => {
    navigate(`/movies/${id}`);
  };

  if (loading) return <p className="loading">Cargando películas...</p>;

  return (
    <div className="movies-page">
      <Navbar />

      {/* Featured movie (first item if exists) */}
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
        {/* Results or full list header */}
        <section className="genre-section">
          <h3>
            {search ? (
              <>
                <span className="tag">Resultados</span> para “{search}”
              </>
            ) : (
              <>
                <span className="tag">Género</span> Películas disponibles
              </>
            )}
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
              <p>No se encontraron películas.</p>
            )}
          </div>
        </section>

        {/* Favorites only when no active search */}
        {!search && (
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
                <p>No tienes películas favoritas aún.</p>
              )}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};