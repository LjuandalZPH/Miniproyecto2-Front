import { Navbar } from '../../components/Navbar';
import { Hero } from '../../components/Hero';
import { Footer } from '../../components/Footer';
import { Carousel } from "../../components/Carousel/Carousel";
import './LandingPage.scss';

/**
 * @component LandingPage
 * @description The main landing page component of the Moovies platform.
 * Composes the main sections of the home page in a structured layout.
 * 
 * Component Structure:
 * - Navbar: Top navigation bar with authentication and search
 * - Hero: Main banner section with platform introduction
 * - Carousel: Featured movies/content slider
 * - Footer: Site-wide footer with links and information
 * 
 * Features:
 * - Responsive layout with SCSS styling
 * - Component-based architecture
 * - Main entry point for user interaction
 * 
 * @example
 * ```tsx
 * <Route path="/" element={<LandingPage />} />
 * ```
 * 
 * @returns {JSX.Element} The complete landing page layout with all main sections
 */
export const LandingPage = () => {
  /**
   * @returns {JSX.Element} Landing page container with main components
   */
  return (
    <div className="landing-page">
      {/* Global navigation */}
      <Navbar />
      {/* Main hero banner */}
      <Hero />
      {/* Featured content carousel */}
      <Carousel />
      {/* Global footer */}
      <Footer />
    </div>
  );
};