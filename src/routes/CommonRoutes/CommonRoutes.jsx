import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from '../../pages/CommonPage/Landing/LandingPage';

const CommonRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/landing" element={<LandingPage />} />
    </Routes>
  );
};

export default CommonRoutes;
