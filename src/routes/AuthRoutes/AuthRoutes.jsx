import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Start from '../../pages/AuthPage/Start/Start';
import Register from '../../pages/AuthPage/Register/Register';
import Login from '../../pages/AuthPage/Login/Login';
import Forgot from '../../pages/AuthPage/Forgot/Forgot';
import Verify from '../../pages/AuthPage/Verify/Verify';

const AuthRoutes = () => {
  return (
    <Routes>
      <Route path="/start" element={<Start />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot" element={<Forgot />} />
      <Route path="/verify" element={<Verify />} />
    </Routes>
  );
};

export default AuthRoutes;
