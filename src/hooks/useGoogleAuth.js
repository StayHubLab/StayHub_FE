import { useEffect, useRef } from "react";
import { GOOGLE_CONFIG } from "../config/google";

const useGoogleAuth = (onSuccess, onError) => {
  const googleButtonRef = useRef(null);

  useEffect(() => {
    const initializeGoogleAuth = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CONFIG.CLIENT_ID,
          callback: handleGoogleResponse,
          auto_select: false,
          cancel_on_tap_outside: true,
        });

        if (googleButtonRef.current) {
          window.google.accounts.id.renderButton(googleButtonRef.current, {
            theme: "outline",
            size: "large",
            width: "100%",
            text: "continue_with",
            shape: "rectangular",
          });
        }
      }
    };

    const handleGoogleResponse = (response) => {
      try {
        // Decode the JWT token
        const tokenData = JSON.parse(atob(response.credential.split(".")[1]));

        const userData = {
          email: tokenData.email,
          name: tokenData.name,
          picture: tokenData.picture,
          googleId: tokenData.sub,
          emailVerified: tokenData.email_verified,
        };

        onSuccess(userData);
      } catch (error) {
        console.error("Error processing Google response:", error);
        onError("Failed to process Google authentication");
      }
    };

    // Load Google Identity Services script
    const loadGoogleScript = () => {
      if (!window.google) {
        const script = document.createElement("script");
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.defer = true;
        script.onload = initializeGoogleAuth;
        document.head.appendChild(script);
      } else {
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
