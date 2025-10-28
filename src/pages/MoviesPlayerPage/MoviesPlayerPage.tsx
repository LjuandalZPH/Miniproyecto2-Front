import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";
import { getProfile, getUserFavorites, toggleFavorite } from "../../services/authService";
import api from "../../services/api";
import "./MoviesPlayerPage.scss";
import { FaStar } from "react-icons/fa";

/**
 * @interface Subtitle
 * @description Represents a single subtitle/track for a video.
 * @property {string} lang - Language code (e.g. 'es', 'en')
 * @property {string} label - Human-readable label for the track (e.g. 'Español')
 * @property {string} src - Source path or absolute URL to the .vtt file
 * @property {boolean} [default] - Whether this track should be the default
 */
interface Subtitle {
  lang: string;
  label: string;
  src: string;
  default?: boolean;
}

/**
 * @interface Movie
 * @description Movie details used by the player page
 * @property {string} _id - Movie unique identifier
 * @property {string} title - Movie title
 * @property {string} description - Movie description
 * @property {string} videoUrl - URL of the video to play
 * @property {string} image - Poster/image URL
 * @property {Comment[]} [comments] - Optional list of comments
 * @property {Subtitle[]} [subtitles] - Optional list of subtitle tracks
 */
interface Movie {
  _id: string;
  title: string;
  description: string;
  videoUrl: string;
  image: string;
  comments?: Comment[];
  subtitles?: Subtitle[];
}

/**
 * @interface Comment
 * @description User comment attached to a movie
 * @property {string} user - Display name or identifier of the commenter
 * @property {string} text - Comment text
 * @property {number} rating - Rating given by the user (1-5)
 * @property {string} [_id] - Optional comment id
 */
interface Comment {
  user: string;
  text: string;
  rating: number;
  _id?: string;
}

/**
 * @component MoviePlayerPage
 * @description Page responsible for playing a single movie, displaying
 * subtitles, description, and managing comments and favorites.
 */
const MoviePlayerPage = () => {
  /** Movie id taken from route params */
  const { id } = useParams<{ id: string }>();
  /** Currently loaded movie details (null while loading) */
  const [movie, setMovie] = useState<Movie | null>(null);
  /** Comments for the current movie */
  const [comments, setComments] = useState<Comment[]>([]);
  /** Whether the current user has this movie as favorite */
  const [isFavorite, setIsFavorite] = useState(false);
  /** Current authenticated user's display name (used to show delete buttons) */
  const [currentUserName, setCurrentUserName] = useState<string | null>(null);
  /** ID of comment currently being deleted (loading state) */
  const [deletingId, setDeletingId] = useState<string | null>(null);
  /** New comment text being composed */
  const [commentText, setCommentText] = useState("");
  /** New comment rating */
  const [commentRating, setCommentRating] = useState<number>(4);
  /** Submission flag used while sending comment to server */
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    const fetchMovieAndVideo = async () => {
      try {
        //  Obtener la película desde tu backend
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/movies/${id}`);
        if (!res.ok) throw new Error("Error al obtener la película");
        const data = await res.json();
        setMovie(data);
        setComments(data.comments || []);
        setIsFavorite(data.favorite || false);

        //  Buscar video en Pexels usando el título o género
        const searchTerm = data.title || data.genre || "movie";
        const videoRes = await fetch(
          `${import.meta.env.VITE_API_URL}/api/pexels/videos?query=${encodeURIComponent(searchTerm)}&per_page=1`
        );

        if (!videoRes.ok) throw new Error("Error al obtener video de Pexels");
        const videoData = await videoRes.json();

        if (videoData.videos && videoData.videos.length > 0) {
          const firstVideo = videoData.videos[0];
          const hdFile =
            firstVideo.video_files.find((f: any) => f.quality === "hd") || firstVideo.video_files[0];

          setMovie((prev) => (prev ? { ...prev, videoUrl: hdFile.link } : prev));
        } else {
          console.warn("No se encontraron videos en Pexels para:", searchTerm);
        }
      } catch (error) {
        console.error("Error al cargar película o video:", error);
      }
    };

    fetchMovieAndVideo();
  }, [id]);

  // Cuando cargue la película, comprobar si el usuario la tiene en favoritos
  useEffect(() => {
    const checkIfFavorite = async () => {
      if (!movie) return;
      try {
        const user = await getProfile();
        const userId = user?._id || user?.id;
        if (!userId) return;

        const favs = await getUserFavorites(userId);
        if (!Array.isArray(favs)) {
          setIsFavorite(false);
          return;
        }

        const has = favs.some((f: any) => {
          if (!f) return false;
          if (typeof f === 'string') return f === movie._id;
          if (typeof f === 'object') return (f._id ?? f.id) === movie._id;
          return false;
        });

        setIsFavorite(has);
      } catch (err) {
        console.error('Error comprobando favorito en player:', err);
      }
    };

    checkIfFavorite();
  }, [movie]);

  // load current user display name to check ownership of comments
  useEffect(() => {
    const loadUser = async () => {
      try {
        const user = await getProfile();
        const userName = (user?.firstName ? `${user.firstName} ${user.lastName ?? ""}`.trim() : user?.email) || null;
        setCurrentUserName(userName);
      } catch (err) {
        setCurrentUserName(null);
      }
    };
    loadUser();
  }, []);

  const handleAddToFavorites = async () => {
    if (!movie) return;

    try {
      const user = await getProfile();
      const userId = user?._id || user?.id;
      if (!userId) throw new Error('Usuario no autenticado');

      await toggleFavorite(userId, movie._id);
      // Alternar estado local (backend alterna en DB)
      setIsFavorite((prev) => !prev);
    } catch (error) {
      console.error('Error al cambiar favorito desde player:', error);
    }
  };

  // Delete a comment (only allowed for the comment owner)
  const handleDeleteComment = async (commentId: string) => {
    if (!movie) return;
    if (!commentId) return;

    try {
      setDeletingId(commentId);
      const res = await api.delete(`/api/movies/${movie._id}/comments/${commentId}`);
      const data = res.data;
      const updatedMovie = data.movie ?? data;
      // keep existing videoUrl to avoid interrupting playback
      setMovie((prev) => ({ ...(updatedMovie || {}), videoUrl: prev?.videoUrl ?? updatedMovie?.videoUrl }));
      setComments(updatedMovie.comments || []);
    } catch (err) {
      console.error('Error borrando comentario desde player:', err);
      const anyErr: any = err;
      const serverMsg = anyErr?.response?.data?.error ?? anyErr?.response?.data?.message ?? anyErr?.message;
      alert(serverMsg || 'No se pudo borrar el comentario');
    } finally {
      setDeletingId(null);
    }
  };

  // Handler to post a new comment (same behavior as MoviesDetails)
  const handlePostComment = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!movie) return;
    if (!commentText.trim()) {
      alert("Escribe un comentario antes de publicar.");
      return;
    }

    try {
      setSubmittingComment(true);
      const user = await getProfile();
      const userName = (user?.firstName ? `${user.firstName} ${user.lastName ?? ""}`.trim() : user?.email) || "Usuario";

      const res = await api.post(`/api/movies/${movie._id}/comments`, {
        user: userName,
        text: commentText.trim(),
        rating: commentRating,
      });

      const updated: any = res.data;
      setComments(updated.comments || []);
      // preserve currently playing video's URL so playback doesn't stop if backend omits it
      setMovie((prev) => ({ ...(updated || {}), videoUrl: prev?.videoUrl ?? updated?.videoUrl }));
      setCommentText("");
      setCommentRating(4);
    } catch (err) {
      console.error('Error publicando comentario desde player:', err);
      alert('No se pudo publicar el comentario.');
    } finally {
      setSubmittingComment(false);
    }
  };

  if (!movie) return <p className="loading">Cargando película...</p>;

  /**
   * Resolve subtitle track source.
   * If the provided src is an absolute URL it is returned as-is. If it's a relative path,
   * prefix it with the configured VITE_API_URL while avoiding duplicated slashes.
   *
   * @param {string} src - Track source (relative path or absolute URL)
   * @returns {string} Resolved absolute URL for the track
   */
  const resolveTrack = (src: string) =>
    /^https?:\/\//i.test(src)
      ? src
      : `${(import.meta.env.VITE_API_URL || "").replace(/\/+$/, "")}/${src.replace(/^\/+/, "")}`;

  /**
   * Render: video player, playback actions, description and comments section.
   * The video uses the `movie.videoUrl` if available, otherwise a placeholder is shown.
   */
  return (
    <div className="movie-player-page">
      <Navbar />

      <div className="movie-player-container">
        <h2>{movie.title}</h2>

        <div className="video-wrapper">
          {movie.videoUrl ? (
            <video
              controls
              autoPlay
              src={movie.videoUrl}  // NO se toca la lógica de video
              className="video-player"
              crossOrigin="anonymous"
            >
              {(movie.subtitles || []).map((t) => (
                <track
                  key={t.lang}
                  kind="subtitles"
                  src={resolveTrack(t.src)}
                  srcLang={t.lang}
                  label={t.label}
                  default={!!t.default}
                />
              ))}
            </video>
          ) : (
            <div className="video-placeholder">
              <img src={movie.image} alt={movie.title} />
              <p>Video no disponible</p>
            </div>
          )}
        </div>

        <div className="actions">
          <button className="fav-btn" onClick={handleAddToFavorites}>
            {isFavorite ? "Quitar de favoritos" : "Añadir a favoritos"}
          </button>
          <FaStar className={`fav-icon ${isFavorite ? "active" : ""}`} />
        </div>

        <p className="movie-description">{movie.description}</p>

        <div className="comments-section">
          <h3>COMENTARIOS</h3>

          <form className="comment-form" onSubmit={handlePostComment}>
            <textarea
              placeholder="Escribe tu comentario..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              rows={3}
              className="comment-input"
            />

            <div className="comment-controls">
              <label>
                Puntuación:
                <select value={commentRating} onChange={(e) => setCommentRating(Number(e.target.value))}>
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                  <option value={3}>3</option>
                  <option value={4}>4</option>
                  <option value={5}>5</option>
                </select>
              </label>
              {/* use type="button" and onClick to evitar recargas no deseadas */}
              <button type="button" className="btn btn--play" disabled={submittingComment} onClick={(e) => handlePostComment(e)}>
                {submittingComment ? "Enviando..." : "Publicar comentario"}
              </button>
            </div>
          </form>

          {comments.length > 0 ? (
            comments.map((comment, index) => (
              <div key={comment._id ?? index} className="comment-card">
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                  <span className="comment-user">{comment.user}</span>
                </div>
                <div className="comment-rating">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <FaStar key={i} color={i < comment.rating ? "red" : "gray"} />
                  ))}
                </div>
                <p className="comment-text">{comment.text}</p>

                {/* show delete if current user is the author */}
                {currentUserName && comment.user === currentUserName && comment._id && (
                  <button
                    className="btn--comments"
                    onClick={() => handleDeleteComment(comment._id!)}
                    disabled={deletingId === comment._id}
                  >
                    {deletingId === comment._id ? 'Borrando...' : 'Borrar'}
                  </button>
                )}
              </div>
            ))
          ) : (
            <p>No hay comentarios aún.</p>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

// Note: default export for the route. Kept as default to match existing imports elsewhere.
export default MoviePlayerPage;