import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "./MoviesPage.scss";
import { resolveImageUrl } from "../../utils/images";


/**
 * @interface Movie
 * @description Movie data used in the movies listing
 * @property {string} _id - Unique identifier for the movie
 * @property {string} title - Title of the movie
 * @property {string} [description] - Optional description or synopsis
 * @property {string} [genre] - Optional genre name
 * @property {string} [image] - Optional poster/image URL
 * @property {boolean} [favorite] - Optional favorite flag for the current user
 * @property {number} [rating] - Optional average rating
 */
interface Movie {
  _id: string;
  title: string;
  description?: string;
  genre?: string;
  image?: string;
  favorite?: boolean;
  rating?: number;
}

/**
 * @component MoviesPage
 * @description Movies listing page. Fetches movies from the API, supports
 * client-side genre filtering and query string search, and shows a featured movie.
 *
 * - Fetches movie list on mount
 * - Applies genre filter and search (client-side)
 * - Displays featured movie (first in filtered list)
 * - Navigates to details or playback pages
 *
 * @returns {JSX.Element} The movies listing page
 */
export const MoviesPage = () => {
  /** Navigation function from react-router */
  const navigate = useNavigate();

  /** List of movies fetched from the API */
  const [movies, setMovies] = useState<Movie[]>([]);

  /** Loading flag while fetching movies */
  const [loading, setLoading] = useState(true);

  /** Controls visibility of the genres dropdown */
  const [showGenres, setShowGenres] = useState(false);

  /** Currently selected genre for client-side filtering */
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);

  // Read search query param (e.g. /movies?search=bunny)
  /** URL search params (reads ?search=) */
  const [searchParams] = useSearchParams();
  /** Normalized search query extracted from URL (lowercase, trimmed) */
  const searchQueryParam =
    searchParams.get("search")?.toLowerCase().trim() ?? null;

  // Apply genre + search filtering client-side (case-insensitive, partial match)
  /** Movies filtered by selected genre (if any) */
  const filteredByGenre = selectedGenre
    ? movies.filter(
        (m: Movie) => (m.genre || "").toLowerCase() === selectedGenre.toLowerCase()
      )
    : movies;

  /** Apply search query filtering on top of genre filtering */
  const filteredMovies = searchQueryParam
    ? filteredByGenre.filter(
        (m: Movie) =>
          (m.title || "").toLowerCase().includes(searchQueryParam) ||
          (m.description || "").toLowerCase().includes(searchQueryParam)
      )
    : filteredByGenre;

  // Fetch all movies (simple list)
  /**
   * Effect: fetch movies from API on mount
   * Updates `movies` and `loading` state
   */
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

  /**
   * Navigate to the movie details page
   * @param {string} id Movie id
   */
  const handleMovieClick = (id: string) => {
    navigate(`/movies/${id}`);
  };

  if (loading) return <p className="loading">Cargando películas...</p>;

  return (
    <div className="movies-page">
      <Navbar />

      {/* Featured */}
      {filteredMovies.length > 0 && (
        <section className="featured">
          <div className="featured__container">
            <div className="featured__content">
              {filteredMovies[0].image && (
                <img
                  src={resolveImageUrl(filteredMovies[0].image)}
                  alt={filteredMovies[0].title}
                  className="featured__image"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = resolveImageUrl(null);
                  }}
                />
              )}
              <h2 className="featured__title">{filteredMovies[0].title}</h2>
              <p className="featured__description">
                {filteredMovies[0].description || "Sin descripción disponible"}
              </p>
              <div className="featured__buttons">
                <button
                  className="btn btn--play"
                  onClick={() => navigate(`/watch/${filteredMovies[0]._id}`)}
                >
                  ▶ Ver ahora
                </button>
                <button
                  className="btn btn--comments"
                  onClick={() => navigate(`/movies/${filteredMovies[0]._id}`)}
                >
                  Comentarios
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      <main className="movies-content">
        
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
            {filteredMovies.length > 0 ? (
              filteredMovies.map((movie: Movie) => (
                <div
                  key={movie._id}
                  className="card clickable"
                  onClick={() => handleMovieClick(movie._id)}
                >
                  {movie.image ? (
                    <img
                      src={resolveImageUrl(movie.image)}
                      alt={movie.title}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = resolveImageUrl(null);
                      }}
                    />
                  ) : (
                    <span>{movie.title}</span>
                  )}
                  <div className="card-overlay">
                    <h4>{movie.title}</h4>
                    <p>{movie.genre}</p>
                  </div>
                </div>
              ))
            ) : movies.length > 0 ? (
              <p>No hay películas que coincidan con los filtros.</p>
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