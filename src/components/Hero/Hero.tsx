import './Hero.scss';

export const Hero = () => {
  return (
    <section className="hero">
      <div className="hero__container">
        {/* Imagen de fondo con overlay */}
        <div className="hero__background">
          <img 
            src="/MoovieWithoutBackground.png" 
            alt="Featured Movie" 
            className="hero__image"
          />
          <div className="hero__overlay"></div>
        </div>

        {/* Contenido */}
        <div className="hero__content">
          <h1 className="hero__title">
            La mejor plataforma de streaming
          </h1>
          <p className="hero__description">
            Con Moovies puedes tener acceso 24/7 a todos tus shows favoritos cuando quieras, 
            donde quieras y en el dispositivo que quieras.
          </p>

          {/* Enlace en lugar de botón */}
          <a href="/movies" className="hero__cta">
            <svg 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="currentColor"
              className="hero__cta-icon"
            >
              <path d="M8 5v14l11-7z"/>
            </svg>
            Iniciar sesión
          </a>
        </div>
      </div>
    </section>
  );
};
