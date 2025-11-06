/**
 * @fileoverview Google Analytics 4 Utility
 * @created 2025-11-06
 * @file analytics.js
 * @description Utility functions for Google Analytics 4 tracking
 */

// GA4 Measurement ID
export const GA_MEASUREMENT_ID = "G-TXJK67FRLK";

/**
 * Check if gtag is available
 */
const isGtagAvailable = () => {
  return typeof window !== "undefined" && typeof window.gtag === "function";
};

/**
 * Track page view
 * @param {string} url - The page URL
 * @param {string} title - The page title
 */
export const trackPageView = (url, title) => {
  if (!isGtagAvailable()) {
    console.warn("Google Analytics is not loaded");
    return;
  }

  window.gtag("config", GA_MEASUREMENT_ID, {
    page_path: url,
    page_title: title,
  });

  console.log("GA4 Page View:", { url, title });
};

/**
 * Track custom event
 * @param {string} eventName - The name of the event
 * @param {object} eventParams - Additional parameters for the event
 */
export const trackEvent = (eventName, eventParams = {}) => {
  if (!isGtagAvailable()) {
    console.warn("Google Analytics is not loaded");
    return;
  }

  window.gtag("event", eventName, eventParams);
  console.log("GA4 Event:", eventName, eventParams);
};

/**
 * Track user login
 * @param {string} method - Login method (e.g., 'email', 'google')
 * @param {string} userId - User ID
 */
export const trackLogin = (method, userId = null) => {
  trackEvent("login", {
    method,
    ...(userId && { user_id: userId }),
  });
};

/**
 * Track user signup
 * @param {string} method - Signup method (e.g., 'email', 'google')
 * @param {string} userRole - User role (e.g., 'renter', 'landlord')
 */
export const trackSignup = (method, userRole = null) => {
  trackEvent("sign_up", {
    method,
    ...(userRole && { user_role: userRole }),
  });
};

/**
 * Track room search
 * @param {object} searchParams - Search parameters
 */
export const trackSearch = (searchParams = {}) => {
  trackEvent("search", {
    search_term: searchParams.searchTerm || "",
    location: searchParams.location || "",
    price_range: searchParams.priceRange || "",
    ...searchParams,
  });
};

/**
 * Track room view
 * @param {string} roomId - Room ID
 * @param {string} roomName - Room name
 * @param {number} price - Room price
 */
export const trackRoomView = (roomId, roomName, price) => {
  trackEvent("view_item", {
    item_id: roomId,
    item_name: roomName,
    price: price,
    currency: "VND",
  });
};

/**
 * Track booking creation
 * @param {string} roomId - Room ID
 * @param {string} roomName - Room name
 * @param {number} price - Booking price
 */
export const trackBooking = (roomId, roomName, price) => {
  trackEvent("begin_checkout", {
    item_id: roomId,
    item_name: roomName,
    value: price,
    currency: "VND",
  });
};

/**
 * Track contract creation
 * @param {string} contractId - Contract ID
 * @param {number} value - Contract value
 */
export const trackContractCreation = (contractId, value) => {
  trackEvent("purchase", {
    transaction_id: contractId,
    value: value,
    currency: "VND",
  });
};

/**
 * Track payment
 * @param {string} paymentId - Payment ID
 * @param {number} amount - Payment amount
 * @param {string} method - Payment method
 */
export const trackPayment = (paymentId, amount, method) => {
  trackEvent("payment", {
    transaction_id: paymentId,
    value: amount,
    currency: "VND",
    payment_method: method,
  });
};

/**
 * Track review submission
 * @param {string} roomId - Room ID
 * @param {number} rating - Rating value
 */
export const trackReview = (roomId, rating) => {
  trackEvent("review_submitted", {
    item_id: roomId,
    rating: rating,
  });
};

/**
 * Track contact request
 * @param {string} requestType - Type of contact request
 */
export const trackContactRequest = (requestType) => {
  trackEvent("contact_request", {
    request_type: requestType,
  });
};

/**
 * Track feature usage
 * @param {string} featureName - Name of the feature used
 * @param {object} params - Additional parameters
 */
export const trackFeatureUsage = (featureName, params = {}) => {
  trackEvent("feature_used", {
    feature_name: featureName,
    ...params,
  });
};

/**
 * Set user properties
 * @param {object} properties - User properties to set
 */
export const setUserProperties = (properties) => {
  if (!isGtagAvailable()) {
    console.warn("Google Analytics is not loaded");
    return;
  }

  window.gtag("set", "user_properties", properties);
  console.log("GA4 User Properties:", properties);
};

/**
 * Set user ID
 * @param {string} userId - User ID
 */
export const setUserId = (userId) => {
  if (!isGtagAvailable()) {
    console.warn("Google Analytics is not loaded");
    return;
  }

  window.gtag("config", GA_MEASUREMENT_ID, {
    user_id: userId,
  });

  console.log("GA4 User ID set:", userId);
};

/**
 * Track exceptions
 * @param {string} description - Error description
 * @param {boolean} fatal - Whether the error is fatal
 */
export const trackException = (description, fatal = false) => {
  if (!isGtagAvailable()) {
    console.warn("Google Analytics is not loaded");
    return;
  }

  window.gtag("event", "exception", {
    description: description,
    fatal: fatal,
  });
};

const analytics = {
  trackPageView,
  trackEvent,
  trackLogin,
  trackSignup,
  trackSearch,
  trackRoomView,
  trackBooking,
  trackContractCreation,
  trackPayment,
  trackReview,
  trackContactRequest,
  trackFeatureUsage,
  setUserProperties,
  setUserId,
  trackException,
};

export default analytics;
