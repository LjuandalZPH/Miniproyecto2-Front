import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { getPostersFromPexels } from "../../services/pexelsService";

export const Carousel = () => {
  const [photos, setPhotos] = useState<any[]>([]);

  useEffect(() => {
    getPostersFromPexels().then(setPhotos);
  }, []);

  if (!photos.length)
    return <p style={{ color: "#ccc", textAlign: "center" }}>Cargando cartelera...</p>;

  return (
    <section className="carousel-section">
      <h2 className="carousel-title">Cartelera de películas</h2>

      <Swiper
        modules={[Autoplay]}
        autoplay={{ delay: 3000 }}
        loop
        slidesPerView={5}        
        spaceBetween={20}
        grabCursor={true}         
        style={{ padding: "10px 0" }}
      >
        {photos.map((photo) => (
          <SwiperSlide key={photo.id}>
            <div className="carousel-item">
              <img
                src={photo.src.large}
                alt={photo.photographer}
                style={{
                  width: "100%",
                  height: "300px",
                  objectFit: "cover",
                  borderRadius: "10px",
                  cursor: "pointer",
                  transition: "transform 0.3s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1.0)")}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};