import React from "react";
import CommonRoutes from "./CommonRoutes/CommonRoutes";
import AuthRoutes from "./AuthRoutes/AuthRoutes";
import LandlordRoute from "./LandlordRoute/LandlordRoute";

const AppRoutes = () => {
  return (
    <>
      <CommonRoutes />
      <AuthRoutes />
      <LandlordRoute />
    </>
  );
};

export default AppRoutes;
