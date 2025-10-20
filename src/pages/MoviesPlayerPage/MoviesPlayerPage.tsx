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
    // 🔹 Fetch real (comentado por ahora)
    /*
    fetch(`${import.meta.env.VITE_API_URL}/movies/${id}`)
      .then((res) => res.json())
      .then((data) => setMovie(data))
      .catch((err) => console.error("Error cargando la película:", err));
    */

    // 🔹 Mock temporal (sin backend)
    setTimeout(() => {
      setMovie({
        _id: id || "1",
        title: `Película de prueba ${id}`,
        description:
          "Esta es una película simulada para probar la página de reproducción.",
        videoUrl: "/sample-video.mp4", // usa cualquier mp4 local o remoto
        image: "/MoovieWithoutBackground.png",
      });

      setComments([
        { user: "Carlos Pérez", text: "Increíble película, me encantó!", rating: 5 },
        { user: "Ana Gómez", text: "Buena trama, pero algo predecible.", rating: 3 },
      ]);
    }, 1000);
  }, [id]);

  const handleAddToFavorites = () => {
    setIsFavorite(!isFavorite);
    alert(
      isFavorite
        ? "Película eliminada de favoritos (mock)"
        : "Película añadida a favoritos (mock)"
    );
  };

  if (!movie) {
    return <p className="loading">Cargando película...</p>;
  }

  return (
    <div className="movie-player-page">
      {/* 🔹 Navbar */}
      <Navbar />

      {/* 🔹 Contenedor principal */}
      <div className="movie-player-container">
        {/* 🎥 Video o imagen */}
        <div className="video-wrapper">
          {movie.videoUrl ? (
            <video controls autoPlay src={movie.videoUrl} />
          ) : (
            <div className="video-placeholder">
              <img src={movie.image} alt={movie.title} />
              <p>Video no disponible</p>
            </div>
          )}
        </div>

        {/* ⭐ Botones de acción */}
        <div className="actions">
          <button className="fav-btn" onClick={handleAddToFavorites}>
            {isFavorite ? "Quitar de favoritos" : "Añadir a favoritos"}
          </button>
          <FaStar className={`fav-icon ${isFavorite ? "active" : ""}`} />
        </div>

        {/* 💬 Sección de comentarios */}
        <div className="comments-section">
          <h3>COMENTARIOS</h3>
          {comments.map((comment, index) => (
            <div key={index} className="comment-card">
              <span className="comment-user">{comment.user}</span>
              <div className="comment-rating">
                {Array.from({ length: 5 }).map((_, i) => (
                  <FaStar key={i} color={i < comment.rating ? "red" : "gray"} />
                ))}
              </div>
              <p className="comment-text">{comment.text}</p>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};
//llamen a la policia
export default MoviePlayerPage;

