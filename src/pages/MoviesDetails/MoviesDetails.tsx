import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./MoviesDetails.scss";
import { FaStar } from "react-icons/fa";
import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";
import { getProfile, toggleFavorite, getUserFavorites } from "../../services/authService";
import api from "../../services/api";

interface Comment {
  user: string;
  text: string;
  rating: number;
  _id?: string;
}

interface Movie {
  _id: string;
  title: string;
  description: string;
  image: string;
  videoUrl?: string;
  genre?: string;
  rating?: number
}

const MovieDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState("");
  const [commentRating, setCommentRating] = useState<number>(4);
  const [submittingComment, setSubmittingComment] = useState(false);
  const [currentUserName, setCurrentUserName] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const navigate = useNavigate();

   
  useEffect(() => {
  const fetchMovie = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/movies/${id}`);
      if (!res.ok) throw new Error("Error al obtener los datos de la película");
      const data = await res.json();

      setMovie(data);
      setIsFavorite(data.favorite);
      setComments(data.comments || []); // Cargamos los comentarios reales
    } catch (error) {
      console.error(error);
    }
  };

  fetchMovie();
}, [id]);

  // load current user display name to check ownership of comments
  useEffect(() => {
    const loadUser = async () => {
      try {
        const user = await getProfile();
        const userName = (user?.firstName ? `${user.firstName} ${user.lastName ?? ""}`.trim() : user?.email) || null;
        setCurrentUserName(userName);
      } catch (err) {
        // not authenticated or error - ignore
        setCurrentUserName(null);
      }
    };
    loadUser();
  }, []);

  // Handler to post a new comment
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
      // update local state with new comments and movie (rating may change)
      setComments(updated.comments || []);
      setMovie(updated);
      setCommentText("");
      setCommentRating(4);
    } catch (err) {
      console.error("Error publicando comentario:", err);
      alert("No se pudo publicar el comentario.");
    } finally {
      setSubmittingComment(false);
    }
  };

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
        console.error('Error comprobando favorito:', err);
      }
    };

    checkIfFavorite();
  }, [movie]);
  
  const [isFavorite, setIsFavorite] = useState(false);

  const handleAddToFavorites = async () => {
  if (!movie) return;

  try {
    const user = await getProfile();
    const userId = user?._id || user?.id;
    if (!userId) throw new Error("Usuario no autenticado");

    // Llamamos al endpoint centralizado que alterna el favorito
    await toggleFavorite(userId, movie._id);

    // Actualizamos estado local
    setIsFavorite((prev) => !prev);
  } catch (error) {
    console.error("Error al marcar favorito:", error);
    alert("No se pudo cambiar el estado de favorito");
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
      // controller returns { message: 'Comment deleted', movie }
      const updatedMovie = data.movie ?? data;
      setMovie(updatedMovie);
      setComments(updatedMovie.comments || []);
    } catch (err) {
      // Show detailed server error when available
      console.error('Error borrando comentario:', err);
      // Axios error may contain response data with message
      const anyErr: any = err;
      const serverMsg = anyErr?.response?.data?.error ?? anyErr?.response?.data?.message ?? anyErr?.message;
      console.error('Server response:', anyErr?.response?.data);
      alert(serverMsg || 'No se pudo borrar el comentario');
    } finally {
      setDeletingId(null);
    }
  };

  
  const handlePlayNow = () => {
    navigate(`/watch/${movie?._id}`);
  };

  if (!movie) return <p className="loading">Cargando detalles...</p>;

  return (
    <div className="movie-details-container">
      <Navbar />
      <div className="movie-details-content">
        {/* 🎞️ Imagen / Video */}
        <div className="movie-left">
          {movie.videoUrl ? (
            <video controls src={movie.videoUrl} />
          ) : (
            <img src={movie.image} alt={movie.title} className="movie-poster" />
          )}
          <h2 className="featured-title">{movie.title}</h2>

          {/*  Botón que navega al reproductor */}
          <button className="play-btn" onClick={handlePlayNow}>▶ Play Now</button>

          <div className="fav-section">
            <button className="fav-btn" onClick={handleAddToFavorites}>
              {isFavorite ? "Quitar de favoritos" : "Añadir a favoritos"}
            </button>
            <FaStar className={`fav-icon ${isFavorite ? "active" : ""}`} />
          </div>
        </div>

        {/*  Descripción */}
        <div className="movie-right">
          <h3 className="movie-title">{movie.title}</h3>
          <p className="movie-rating">Promedio: {movie.rating?.toFixed(1) ?? 0}/5</p>
          <div className="movie-desc">{movie.description || "Sin descripción disponible."}</div>
        </div>
      </div>

      {/*  Sección de comentarios */}
      <div className="comments-section">
        <h3>Comentarios</h3>
        {/* Form to post a new comment */}
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
            <button type="submit" className="btn btn--play" disabled={submittingComment}>
              {submittingComment ? "Enviando..." : "Publicar comentario"}
            </button>
          </div>
        </form>
        {comments.map((comment, index) => (
          <div key={comment._id ?? index} className="comment-card">
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <div className="comment-user">{comment.user}</div>
            </div>
            <div className="comment-rating">
              {Array.from({ length: 5 }).map((_, i) => (
                <FaStar
                  key={i}
                  color={i < comment.rating ? "red" : "gray"}
                  className="star"
                />
              ))}
            </div>
            <div className="comment-text">{comment.text}</div>

            {/* Render delete button as a direct child of .comment-card so absolute positioning works
                Use only the specific className `btn--comments` to avoid global `.btn` overrides */}
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
        ))}
      </div>
      <Footer />
    </div>
  );
};

export default MovieDetailPage;
