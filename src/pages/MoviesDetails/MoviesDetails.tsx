import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./MoviesDetails.scss";
import { FaStar } from "react-icons/fa";
import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";

interface Comment {
  user: string;
  text: string;
  rating: number;
}

interface Movie {
  _id: string;
  title: string;
  description: string;
  image: string;
  videoUrl?: string;
  genre?: string;
}

const MovieDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
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
  
/*
  // 🔹 Simulación de carga (sin backend)
  useEffect(() => {
    setTimeout(() => {
      setMovie({
        _id: id || "1",
        title: `Película de prueba ${id}`,
        description: "Esta es una descripción simulada para probar la vista MovieDetailPage.",
        image: "/MoovieWithoutBackground.png",
        videoUrl: "",
        genre: "Acción",
      });
    }, 800);

    // 🔹 Comentarios simulados
    setComments([
      { user: "John Doe", text: "Excelente película", rating: 5 },
      { user: "Jane Smith", text: "Entretenida, pero algo lenta", rating: 3 },
    ]);
  }, [id]);
*/
  const [isFavorite, setIsFavorite] = useState(false);

  const handleAddToFavorites = async () => {
  if (!movie) return;

  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/movies/${movie._id}/favorite`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) throw new Error("Error al actualizar favorito");

    //  Cambiamos el estado local para reflejar el nuevo valor
    setIsFavorite((prev) => !prev);
  } catch (error) {
    console.error("Error al marcar favorito:", error);
    alert("No se pudo cambiar el estado de favorito");
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
              Añadir a favoritos
            </button>
            <FaStar className={`fav-icon ${isFavorite ? "active" : ""}`} />
          </div>
        </div>

        {/*  Descripción */}
        <div className="movie-right">
          <h3 className="movie-title">{movie.title}</h3>
          <div className="movie-desc">{movie.description || "Sin descripción disponible."}</div>
        </div>
      </div>

      {/*  Sección de comentarios */}
      <div className="comments-section">
        <h3>Comentarios</h3>
        {comments.map((comment, index) => (
          <div key={index} className="comment-card">
            <div className="comment-user">{comment.user}</div>
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
          </div>
        ))}
      </div>
      <Footer />
    </div>
  );
};

export default MovieDetailPage;
