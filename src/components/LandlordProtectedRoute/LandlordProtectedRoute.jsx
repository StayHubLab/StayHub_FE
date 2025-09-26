import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Spin } from "antd";
import LandlordBuildingCheck from "../LandlordBuildingCheck/LandlordBuildingCheck";

const LandlordProtectedRoute = ({ children }) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Redirect to main page if not landlord
  if (user?.role !== "landlord") {
    return <Navigate to="/main/home" replace />;
  }

  // For create-building page, don't apply building check
  if (location.pathname === "/create-building") {
    return children;
  }

  // For all other landlord routes, apply building check
  return <LandlordBuildingCheck>{children}</LandlordBuildingCheck>;
};

export default LandlordProtectedRoute;
