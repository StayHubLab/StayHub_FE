import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Spin } from "antd";

const RenterProtectedRoute = ({ children }) => {
  const { isAuthenticated, user, isLoading } = useAuth();

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

  // Redirect to landlord dashboard if user is landlord
  if (user?.role === "landlord") {
    return <Navigate to="/landlord/dashboard" replace />;
  }

  // Render the protected content for renter/regular user
  return children;
};

export default RenterProtectedRoute;
