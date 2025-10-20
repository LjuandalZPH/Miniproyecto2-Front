import { Navbar } from '../../components/Navbar';
import { Hero } from '../../components/Hero';
import { Footer } from '../../components/Footer';
import { Carousel } from "../../components/Carousel/Carousel";
import './LandingPage.scss';

export const LandingPage = () => {
  return (
    <div className="landing-page">
      <Navbar />
      <Hero />
      <Carousel />
      <Footer />
    </div>
  );
};