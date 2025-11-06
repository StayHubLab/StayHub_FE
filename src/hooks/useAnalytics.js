/**
 * @fileoverview Hook for Google Analytics 4
 * @created 2025-11-06
 * @file useAnalytics.js
 * @description Custom hook to track page views and events with GA4
 */

import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { trackPageView } from "../utils/analytics";

/**
 * Hook to automatically track page views
 */
export const usePageTracking = () => {
  const location = useLocation();

  useEffect(() => {
    const pageTitle = document.title;
    const pagePath = location.pathname + location.search;

    // Track page view
    trackPageView(pagePath, pageTitle);
  }, [location]);
};

export default usePageTracking;
