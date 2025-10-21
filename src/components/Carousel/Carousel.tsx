import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/autoplay";
import { getVideosFromPexels } from "../../services/pexelsService";

export const Carousel = () => {
  const [videos, setVideos] = useState<any[]>([]);

  useEffect(() => {
    getVideosFromPexels().then(setVideos);
  }, []);

  if (!videos.length)
    return <p style={{ color: "#ccc", textAlign: "center" }}>Cargando videos...</p>;

  return (
    <section className="carousel-section">
      <Swiper
        modules={[Autoplay]}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop={videos.length > 3}
        slidesPerView={Math.min(3, videos.length)}
        spaceBetween={20}
        grabCursor
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
