import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import LandingPage from "../../pages/CommonPage/Landing/LandingPage";

const ProtectedRedirect = () => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Only redirect if not loading and user is authenticated
    if (!isLoading && isAuthenticated && user) {
      if (user.role === "landlord") {
        navigate("/landlord/dashboard", { replace: true });
      } else {
        navigate("/main/home", { replace: true });
      }
    }
  }, [isAuthenticated, user, isLoading, navigate]);

  // Show loading while checking authentication
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
        <div>Đang tải...</div>
      </div>
    );
  }

  // Show landing page if not authenticated
  if (!isAuthenticated) {
    return <LandingPage />;
  }

  // This should not render as useEffect will redirect
  return null;
};

export default ProtectedRedirect;
