import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserFavorites, getProfile, toggleFavorite } from "../../services/authService";
import { Navbar } from "../../components/Navbar/Navbar";
import { Footer } from "../../components/Footer/Footer";
import "./FavoritesPage.scss";

/**
 * @interface Movie
 * @description Interface for movie data in favorites list
 * @property {string} _id - Unique identifier for the movie
 * @property {string} title - Movie title
 * @property {string} [genre] - Optional genre of the movie
 * @property {string} [image] - Optional URL to movie poster
 */
interface Movie {
  _id: string;
  title: string;
  genre?: string;
  image?: string;
}

/**
 * @component FavoritesPage
 * @description Page component that displays and manages user's favorite movies.
 * Allows users to view their favorite movies, remove them from favorites,
 * and navigate to movie details.
 * 
 * @returns {JSX.Element} The favorites page component
 */
export default function FavoritesPage() {
  /** Navigation hook for routing */
  const navigate = useNavigate();
  /** State to store user's favorite movies */
  const [favorites, setFavorites] = useState<Movie[]>([]);
  /** Loading state while fetching favorites */
  const [loadingFavs, setLoadingFavs] = useState(true);

  /**
   * Fetches user's favorite movies on component mount
   */
  useEffect(() => {
    /**
     * Retrieves user profile and their favorite movies from the API
     */
    const fetchFavorites = async () => {
        try {
        const user = await getProfile(); 
        const userId = user?._id || user?.id;
        if (!userId) return;

        const data = await getUserFavorites(userId); 
        setFavorites(data || []);
        } catch (err) {
        console.error("Error al obtener favoritos:", err);
        } finally {
        setLoadingFavs(false);
        }
    };

    fetchFavorites();
    }, []);

    /**
     * Removes a movie from user's favorites
     * @param {string} movieId - The ID of the movie to remove
     */
    const handleRemoveFavorite = async (movieId: string) => {
        try {
            const user = await getProfile();
            const userId = user?._id || user?.id;
            if (!userId) return;

            await toggleFavorite(userId, movieId);

            
            setFavorites((prev) => prev.filter((m) => m._id !== movieId));
        } catch (err) {
            console.error("Error al quitar de favoritos:", err);
            alert("No se pudo quitar de favoritos");
        }
    };


  return (
    <div className="favorites-layout">
      <Navbar />

      <main className="favorites-page">
        <div className="favorites-page__header">
          <h1 className="favorites-page__title">Tus Favoritos</h1>
          <p className="favorites-page__subtitle">
            Disfruta de tus películas y series guardadas
          </p>
        </div>

        {loadingFavs ? (
          <p className="loading">Cargando favoritos...</p>
        ) : favorites.length > 0 ? (
          <div className="card-grid">
            {favorites.map((movie) => (
              <div key={movie._id} className="card clickable">
                <button
                    className="fav-remove-btn"
                    onClick={(e) => {
                    e.stopPropagation(); 
                    handleRemoveFavorite(movie._id);
                    }}
                >
                    Eliminar
                </button>

                {movie.image ? (
                    <img
                    src={movie.image}
                    alt={movie.title}
                    onClick={() => navigate(`/movies/${movie._id}`)}
                    />
                ) : (
                    <span onClick={() => navigate(`/movies/${movie._id}`)}>
                    {movie.title}
                    </span>
                )}

                <div className="card-overlay">
                    <h4>{movie.title}</h4>
                    <p>{movie.genre}</p>
                </div>
                </div>
            ))}
          </div>
        ) : (
          <p>No tienes favoritos aún.</p>
        )}
      </main>

      <Footer />
    </div>
  );
}
