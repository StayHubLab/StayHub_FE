// Google OAuth Configuration
const CLIENT_ID =
  process.env.REACT_APP_GOOGLE_CLIENT_ID ||
  "1077048636457-q05ublii1k70le5q934edqt4ar0eq7s4.apps.googleusercontent.com";

export const GOOGLE_CONFIG = {
  CLIENT_ID: CLIENT_ID,
  // Add other Google OAuth settings here if needed
};

export default GOOGLE_CONFIG;
