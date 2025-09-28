import React from "react";
import { useAuth } from "../contexts/AuthContext";

const DebugAuth = () => {
  const { user, isAuthenticated, token, login } = useAuth();

  // Get data from localStorage
  const localToken = localStorage.getItem("token");
  const localUser = localStorage.getItem("user");
  const localRefreshToken = localStorage.getItem("refreshToken");

  const handleTestLogin = async () => {
    try {
      console.log("Attempting test login...");
      const result = await login({
        email: "test@example.com",
        password: "password123",
      });
      console.log("Login result:", result);
      if (result.success) {
        alert("Login successful! Check console for details.");
      } else {
        alert("Login failed: " + result.error);
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Login error: " + error.message);
    }
  };

  const handleClearAuth = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("refreshToken");
    window.location.reload();
  };

  const handleSetFakeAuth = () => {
    const fakeUser = {
      id: "fake123",
      _id: "fake123",
      email: "fake@example.com",
      name: "Fake User",
      role: "renter",
    };
    const fakeToken = "fake.jwt.token.for.testing";

    localStorage.setItem("token", fakeToken);
    localStorage.setItem("user", JSON.stringify(fakeUser));
    localStorage.setItem("refreshToken", "fake.refresh.token");

    window.location.reload();
  };

  return (
    <div
      style={{
        position: "fixed",
        top: "10px",
        right: "10px",
        background: "white",
        border: "1px solid #ccc",
        padding: "10px",
        borderRadius: "5px",
        fontSize: "12px",
        maxWidth: "350px",
        zIndex: 9999,
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
      }}
    >
      <h4>Auth Debug Info</h4>

      <div>
        <strong>Context State:</strong>
      </div>
      <div>isAuthenticated: {String(isAuthenticated)}</div>
      <div>
        user: {user ? JSON.stringify(user).substring(0, 50) + "..." : "null"}
      </div>
      <div>token: {token ? token.substring(0, 20) + "..." : "null"}</div>

      <div style={{ marginTop: "10px" }}>
        <strong>localStorage:</strong>
      </div>
      <div>
        token: {localToken ? localToken.substring(0, 20) + "..." : "null"}
      </div>
      <div>user: {localUser ? localUser.substring(0, 50) + "..." : "null"}</div>
      <div>
        refreshToken:{" "}
        {localRefreshToken
          ? localRefreshToken.substring(0, 20) + "..."
          : "null"}
      </div>

      <div style={{ marginTop: "10px" }}>
        <strong>Test Actions:</strong>
      </div>
      <button
        onClick={handleTestLogin}
        style={{
          padding: "5px 10px",
          margin: "2px",
          fontSize: "11px",
          backgroundColor: "#1890ff",
          color: "white",
          border: "none",
          borderRadius: "3px",
          cursor: "pointer",
        }}
      >
        Test Login
      </button>
      <button
        onClick={handleSetFakeAuth}
        style={{
          padding: "5px 10px",
          margin: "2px",
          fontSize: "11px",
          backgroundColor: "#52c41a",
          color: "white",
          border: "none",
          borderRadius: "3px",
          cursor: "pointer",
        }}
      >
        Set Fake Auth
      </button>
      <button
        onClick={handleClearAuth}
        style={{
          padding: "5px 10px",
          margin: "2px",
          fontSize: "11px",
          backgroundColor: "#ff4d4f",
          color: "white",
          border: "none",
          borderRadius: "3px",
          cursor: "pointer",
        }}
      >
        Clear Auth
      </button>
    </div>
  );
};

export default DebugAuth;
