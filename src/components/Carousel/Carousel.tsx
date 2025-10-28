import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/autoplay";
import { getVideosFromPexels } from "../../services/pexelsService";

/**
 * @component Carousel
 * @description A video carousel component that displays a collection of auto-playing videos from Pexels.
 * The carousel automatically rotates through videos with a 5-second delay and supports touch/mouse interaction.
 * 
 * Features:
 * - Auto-plays videos with sound muted
 * - Displays up to 3 videos simultaneously (responsive)
 * - Auto-rotates every 5 seconds
 * - Supports touch/mouse drag interaction
 * - Shows loading state while fetching videos
 * 
 * @example
 * ```tsx
 * <Carousel />
 * ```
 * 
 * @returns {JSX.Element} A section containing the video carousel or a loading message
 */
export const Carousel = () => {
  /** @type {[Array<any>, React.Dispatch<React.SetStateAction<any[]>>]} State for storing fetched video data */
  const [videos, setVideos] = useState<any[]>([]);

  /** 
   * Effect hook to fetch videos from Pexels API when component mounts
   * @effect
   * @fires getVideosFromPexels
   */
  useEffect(() => {
    getVideosFromPexels().then(setVideos);
  }, []);

  // Display loading state when no videos are available
  if (!videos.length)
    return <p style={{ color: "#ccc", textAlign: "center" }}>Cargando videos...</p>;

  /**
   * @returns {JSX.Element} The carousel section with configured Swiper component and video slides
   */
  return (
    <section className="carousel-section">
      {/* Swiper component configuration with autoplay and responsive settings */}
      <Swiper
        modules={[Autoplay]} // Enable autoplay functionality
        autoplay={{ delay: 5000, disableOnInteraction: false }} // 5 second delay between slides
        loop={videos.length > 3} // Enable infinite loop if there are more than 3 videos
        slidesPerView={Math.min(3, videos.length)} // Show up to 3 slides, or less if fewer videos
        spaceBetween={20} // 20px gap between slides
        grabCursor // Show grab cursor on hover
      >
        {videos.map((video) => (
          <SwiperSlide key={video.id}>
            <div className="carousel-item">
              <video
                src={video.video_files[0]?.link}
                poster={video.image}
                muted
                autoPlay
                loop
                style={{
                  width: "100%",
                  height: "300px",
                  objectFit: "cover",
                  borderRadius: "10px",
                }}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};
