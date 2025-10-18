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

//VERSION QUE HACE FETCH A BACKEND (AUN NO HAY PELICULAS POR LO QUE ESTE BLOQUE QUEDARA COMENTADO OKAY~?)

  /*useEffect(() => {
    const fetchMovie = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/movies/${id}`);
        if (!res.ok) throw new Error("Error al obtener los datos de la película");
        const data = await res.json();
        setMovie(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchMovie();
*/
  useEffect(() => {
  // 🔹 Simulación de carga (sin backend)
  setTimeout(() => {
    setMovie({
      _id: id || "1",
      title: `Película de prueba ${id}`,
      description: "Esta es una descripción simulada para probar la vista MovieDetailPage.",
      image: "/MoovieWithoutBackground.png",
      videoUrl: "",
      genre: "Acción",
    });
  }, 800); // Simula un pequeño retardo de red

  // 🔹 Comentarios simulados
  setComments([
    { user: "John Doe", text: "Excelente película", rating: 5 },
    { user: "Jane Smith", text: "Entretenida, pero algo lenta", rating: 3 },
  ]);
}, [id]);


  const [isFavorite, setIsFavorite] = useState(false);

const handleAddToFavorites = () => {
  setIsFavorite(!isFavorite); // alterna el estado
  alert("Película añadida a favoritos (pendiente conexión backend)");
  // aquí luego puedes conectar con tu backend
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
          <button className="play-btn">▶ Play Now</button>

          <div className="fav-section">
            <button className="fav-btn" onClick={handleAddToFavorites}>
                Añadir a favoritos
            </button>
            <FaStar className={`fav-icon ${isFavorite ? "active" : ""}`} />
            </div>
        </div>

        {/* 📝 Descripción */}
        <div className="movie-right">
          <h3 className="movie-title">{movie.title}</h3>
          <div className="movie-desc">{movie.description || "Sin descripción disponible."}</div>
        </div>
      </div>

      {/* 💬 Sección de comentarios */}
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
