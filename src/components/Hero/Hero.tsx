import './Hero.scss';

/**
 * @component Hero
 * @description A prominent hero section component for the Moovies streaming platform's landing page.
 * Features a background image with overlay, main title, description, and call-to-action button.
 * 
 * Features:
 * - Responsive background image with overlay
 * - Platform headline and descriptive text
 * - Call-to-action button with play icon
 * - SCSS-based styling for enhanced visual effects
 * - Accessible image alt text
 * 
 * @example
 * ```tsx
 * <Hero />
 * ```
 * 
 * @returns {JSX.Element} A hero section with background image, content, and CTA
 */
export const Hero = () => {
  /**
   * @returns {JSX.Element} Structured hero section with background and content
   */
  return (
    <section className="hero">
      <div className="hero__container">
        {/* Background image with overlay effect */}
        <div className="hero__background">
          <img 
            src="/MoovieWithoutBackground.png" 
            alt="Featured Movie" 
            className="hero__image"
          />
          <div className="hero__overlay"></div>
        </div>

        {/* Main content section with title, description and CTA */}
        <div className="hero__content">
          <h1 className="hero__title">
            La mejor plataforma de streaming
          </h1>
          <p className="hero__description">
            Con Moovies puedes tener acceso 24/7 a todos tus shows favoritos cuando quieras, 
            donde quieras y en el dispositivo que quieras.
          </p>

          {/* Call-to-action link styled as a button */}
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
            Empezar
          </a>
        </div>
      </div>
    </section>
  );
};
