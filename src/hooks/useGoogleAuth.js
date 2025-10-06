import { useEffect, useRef } from "react";
import { GOOGLE_CONFIG } from "../config/google";

const useGoogleAuth = (onSuccess, onError) => {
  const googleButtonRef = useRef(null);

  useEffect(() => {
    // Guard: block init if client id is missing or placeholder
    const isInvalidClientId =
      !GOOGLE_CONFIG.CLIENT_ID ||
      GOOGLE_CONFIG.CLIENT_ID === "YOUR_GOOGLE_CLIENT_ID_HERE";

    if (isInvalidClientId) {
      console.groupCollapsed("[GoogleAuth] Invalid Client ID");
      console.error(
        "Google Client ID is missing or placeholder. Please set REACT_APP_GOOGLE_CLIENT_ID."
      );
      console.log(
        "Env REACT_APP_GOOGLE_CLIENT_ID:",
        process.env.REACT_APP_GOOGLE_CLIENT_ID
      );
      console.log("Resolved GOOGLE_CONFIG.CLIENT_ID:", GOOGLE_CONFIG.CLIENT_ID);
      console.groupEnd();
      if (onError) {
        onError("Google Client ID is not configured");
      }
      return;
    }

    const initializeGoogleAuth = () => {
      if (window.google) {
        console.groupCollapsed("[GoogleAuth] Initialize");
        console.log("Client ID:", GOOGLE_CONFIG.CLIENT_ID);
        console.log("Origin:", window.location.origin);

        window.google.accounts.id.initialize({
          client_id: GOOGLE_CONFIG.CLIENT_ID,
          callback: handleGoogleResponse,
          auto_select: false,
          cancel_on_tap_outside: true,
        });

        if (googleButtonRef.current) {
          console.log("Rendering Google button");
          window.google.accounts.id.renderButton(googleButtonRef.current, {
            theme: "outline",
            size: "large",
            width: "100%",
            text: "continue_with",
            shape: "rectangular",
          });
        }
        console.groupEnd();
      } else {
        console.error("[GoogleAuth] Google Identity Services not loaded");
      }
    };

    const handleGoogleResponse = (response) => {
      try {
        console.groupCollapsed("[GoogleAuth] Response");
        console.log("Raw response:", response);

        // Decode the JWT token
        const tokenData = JSON.parse(atob(response.credential.split(".")[1]));
        console.log("Decoded token data:", tokenData);

        const userData = {
          email: tokenData.email,
          name: tokenData.name,
          picture: tokenData.picture,
          googleId: tokenData.sub,
          emailVerified: tokenData.email_verified,
        };

        console.log("Processed user data:", userData);
        console.groupEnd();
        onSuccess(userData);
      } catch (error) {
        console.error("[GoogleAuth] Error processing Google response:", error);
        onError("Failed to process Google authentication");
      }
    };

    // Load Google Identity Services script
    const loadGoogleScript = () => {
      if (!window.google) {
        console.groupCollapsed("[GoogleAuth] Load Script");
        console.log("Loading Google Identity Services script");
        const script = document.createElement("script");
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.defer = true;
        script.onload = () => {
          console.log("Google Identity Services script loaded successfully");
          initializeGoogleAuth();
          console.groupEnd();
        };
        script.onerror = (error) => {
          console.error(
            "[GoogleAuth] Failed to load Google Identity Services script:",
            error
          );
          onError("Failed to load Google authentication service");
          console.groupEnd();
        };
        document.head.appendChild(script);
      } else {
        console.log("[GoogleAuth] Google Identity Services already loaded");
        initializeGoogleAuth();
      }
    };

    loadGoogleScript();

    return () => {
      // Cleanup if needed
    };
  }, [onSuccess, onError]);

  return googleButtonRef;
};

export default useGoogleAuth;
