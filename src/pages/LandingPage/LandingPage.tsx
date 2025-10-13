import { Navbar } from '../../components/Navbar';
import { Hero } from '../../components/Hero';
import { Footer } from '../../components/Footer';
import './LandingPage.scss';

export const LandingPage = () => {
  return (
    <div className="landing-page">
      <Navbar />
      <Hero />
      <Footer />
    </div>
  );
};