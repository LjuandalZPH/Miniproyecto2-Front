import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";
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
}

const MoviePlayerPage = () => {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const navigate = useNavigate();

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



  const handleAddToFavorites = async () => {
  if (!movie) return;

  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/movies/${movie._id}/favorite`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) throw new Error("Error al actualizar favorito");

    const updated = await res.json();
    setIsFavorite(updated.favorite); // 👈 actualiza según backend
  } catch (error) {
    console.error("Error al cambiar favorito:", error);
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
          {comments.length > 0 ? (
            comments.map((comment, index) => (
              <div key={index} className="comment-card">
                <span className="comment-user">{comment.user}</span>
                <div className="comment-rating">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <FaStar key={i} color={i < comment.rating ? "red" : "gray"} />
                  ))}
                </div>
                <p className="comment-text">{comment.text}</p>
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

export default MoviePlayerPage;

