import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LandingPage } from '../pages/LandingPage/LandingPage';

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/movies" element={<div>Movies Page (Coming soon)</div>} />
      </Routes>
    </BrowserRouter>
  );
};