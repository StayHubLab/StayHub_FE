import React, { useState } from "react";
import { GOOGLE_CONFIG } from "../config/google";
import useGoogleAuth from "../hooks/useGoogleAuth";

const GoogleAuthTest = () => {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleGoogleSuccess = (userData) => {
    setResult(userData);
    setError(null);
  };

  const handleGoogleError = (error) => {
    setError(error);
    setResult(null);
  };

  const googleButtonRef = useGoogleAuth(handleGoogleSuccess, handleGoogleError);

  return (
    <div style={{ padding: "20px", maxWidth: "500px", margin: "0 auto" }}>
      <h2>Google OAuth Test</h2>

      <div style={{ marginBottom: "20px" }}>
        <strong>Client ID:</strong> {GOOGLE_CONFIG.CLIENT_ID}
      </div>

      <div style={{ marginBottom: "20px" }}>
        <strong>Environment Variable:</strong>{" "}
        {process.env.REACT_APP_GOOGLE_CLIENT_ID || "Not found"}
      </div>

      <div style={{ marginBottom: "20px" }}>
        <div
          ref={googleButtonRef}
          style={{ width: "100%", display: "flex", justifyContent: "center" }}
        />
      </div>

      {error && (
        <div style={{ color: "red", marginBottom: "20px" }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {result && (
        <div style={{ color: "green", marginBottom: "20px" }}>
          <strong>Success!</strong>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}

      <div style={{ marginTop: "20px", fontSize: "12px", color: "#666" }}>
        <strong>Debug Info:</strong>
        <br />
        - Check browser console for detailed logs
        <br />
        - Make sure localhost:3000 is added to Google Cloud Console
        <br />- Verify Client ID is correct in .env file
      </div>
    </div>
  );
};

export default GoogleAuthTest;
