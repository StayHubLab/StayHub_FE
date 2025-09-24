import React from 'react';
import CommonRoutes from './CommonRoutes/CommonRoutes';
import AuthRoutes from './AuthRoutes/AuthRoutes';

const AppRoutes = () => {
  return (
    <>
      <CommonRoutes />
      <AuthRoutes />
    </>
  );
};

export default AppRoutes;
