import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";
import { getProfile, getUserFavorites, toggleFavorite } from "../../services/authService";
import api from "../../services/api";
import "./MoviesPlayerPage.scss";
import { FaStar } from "react-icons/fa";

interface Movie {
  _id: string;
  title: string;
  description: string;
  videoUrl: string;
  image: string;
  comments?: Comment[];
}

interface Comment {
  user: string;
  text: string;
  rating: number;
  _id?: string;
}

const MoviePlayerPage = () => {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [currentUserName, setCurrentUserName] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState("");
  const [commentRating, setCommentRating] = useState<number>(4);
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
        const hdFile = firstVideo.video_files.find((f: any) => f.quality === "hd") || firstVideo.video_files[0];

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
      src={movie.videoUrl}
      className="video-player"
    />
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

          {/* Form to post a new comment (same markup/behavior as MoviesDetails) */}
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
              {/* use type="button" and onClick to avoid any unexpected native form navigation that may reload the page */}
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
//llamen a la policia
export default MoviePlayerPage;

