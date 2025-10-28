import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';
import './AboutPage.scss';

/**
 * @component AboutPage
 * @description The About Us page component for the Moovies platform.
 * Presents company information, mission statement, and team details in an accessible format.
 * 
 * Features:
 * - Responsive layout with hero section
 * - Company overview and mission statement
 * - Team member listing
 * - Accessible content with proper ARIA roles and tabIndex
 * - Semantic HTML structure with main and section elements
 * - SCSS-based styling
 * 
 * Page Sections:
 * - Hero with logo and slogan
 * - "Who we are" section
 * - Mission statement
 * - "Why Moovies" value proposition
 * - Development team listing
 * 
 * @example
 * ```tsx
 * <Route path="/about" element={<AboutPage />} />
 * ```
 * 
 * @returns {JSX.Element} A complete about page with navigation, main content, and footer
 */
export const AboutPage = () => (
  <div className="about-page" role="main">
    {/* Global navigation */}
    <Navbar />
    {/* Main content area with semantic HTML5 structure */}
    <main className="about-main">
      {/* Hero section with logo and main headline */}
      <section className="about-hero">
        <img src="/MoovieNormal.png" alt="Logo de Moovies" className="about-logo" />
        <h1 tabIndex={0}>Sobre Nosotros</h1>
        <p className="about-slogan">
          Un equipo, una misión: ¡Películas libres para todas las personas!
        </p>
      </section>
      {/* Main content cards with company information */}
      <section className="about-content">
        <div className="about-card">
          <h2 tabIndex={0}>¿Quiénes somos?</h2>
          <p>
            Somos un equipo apasionado de desarrollo que busca revolucionar la forma en la que compartimos y disfrutamos películas en familia. Moovies nace como una alternativa <strong>legal y libre de copyright</strong>, donde puedes encontrar y ver contenido sin preocupaciones y con la mejor experiencia. La accesibilidad y la inclusión son parte fundamental de nuestro desarrollo.
          </p>
        </div>
        <div className="about-card">
          <h2 tabIndex={0}>Nuestra misión</h2>
          <p>
            Crear una plataforma amigable, segura y accesible, donde cada persona pueda descubrir, ver y compartir películas sin restricciones, promoviendo el entretenimiento sano, el acceso libre y el respeto por los derechos de autor.
          </p>
        </div>
        <div className="about-card">
          <h2 tabIndex={0}>¿Por qué Moovies?</h2>
          <p>
            En Moovies creemos que todas las personas merecen disfrutar del cine sin límites y sin barreras. Por eso, desarrollamos esta página con tecnología de punta y un diseño pensado para que puedas elegir tu próxima película y pasar tiempo en familia, con amigos o contigo mismo.
          </p>
        </div>
      </section>
      {/* Development team section with member listing */}
      <section className="about-team" aria-label="Equipo de desarrollo">
        <h2 tabIndex={0}>Equipo de Desarrollo</h2>
        <ul>
          <li>LjuandalZPH</li>
          <li>Mausterl26</li>
          <li>vilhood</li>
          <li>AndresRami01</li>
          <li>jachuone</li>
        </ul>
      </section>
    </main>
    <Footer />
  </div>
);