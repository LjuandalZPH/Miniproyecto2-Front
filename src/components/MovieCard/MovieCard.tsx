import { useState } from "react";
import "./MovieCard.scss";

interface Movie {
  _id: string;
  title: string;
  genre?: string;
  image?: string;
}

export const MovieCard = ({ movie }: { movie: Movie }) => {
  const [trailerUrl] = useState<string | null>(null);



  return (
    <div className="movie-card">
      <img
        src={movie.image || "/placeholder.jpg"}
        alt={movie.title}
        className="thumb"
      />

      {trailerUrl && (
        <video
          className="preview"
          src={trailerUrl}
          muted
          loop
          playsInline
          preload="metadata"
        />
      )}

      <div className="overlay">
        <h4>{movie.title}</h4>
        {movie.genre && <p>{movie.genre}</p>}
      </div>
    </div>
  );
};
