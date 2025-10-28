import { useState } from "react";
import "./MovieCard.scss";

/**
 * @interface Movie
 * @description Interface representing a movie's data structure
 * @property {string} _id - Unique identifier for the movie
 * @property {string} title - Title of the movie
 * @property {string} [genre] - Optional genre classification
 * @property {string} [image] - Optional URL to movie poster image
 */
interface Movie {
  _id: string;
  title: string;
  genre?: string;
  image?: string;
}

/**
 * @component MovieCard
 * @description A card component that displays movie information with an image and overlay details.
 * Features hover effects and optional trailer preview functionality.
 * 
 * Features:
 * - Displays movie poster image with fallback
 * - Shows movie title and optional genre in overlay
 * - Supports video trailer preview (when URL is provided)
 * - Responsive design with SCSS styling
 * - Accessible image alt text
 * 
 * @param {Object} props - Component props
 * @param {Movie} props.movie - Movie object containing title, genre, and image information
 * 
 * @example
 * ```tsx
 * const movie = {
 *   _id: "123",
 *   title: "Movie Title",
 *   genre: "Action",
 *   image: "path/to/image.jpg"
 * };
 * 
 * <MovieCard movie={movie} />
 * ```
 * 
 * @returns {JSX.Element} A movie card with image and overlay information
 */
export const MovieCard = ({ movie }: { movie: Movie }) => {
  /** 
   * @state
   * @description State for storing the movie trailer URL
   * @type {string | null}
   */
  const [trailerUrl] = useState<string | null>(null);

  /**
   * @returns {JSX.Element} Movie card with image and overlay information
   */

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
