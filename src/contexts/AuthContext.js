import React, { createContext, useContext, useEffect, useReducer } from "react";
import PropTypes from "prop-types";
import { authApi } from "../services/api";

// Initial state
const initialState = {
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

// Action types
const AUTH_ACTIONS = {
  LOGIN_START: "LOGIN_START",
  LOGIN_SUCCESS: "LOGIN_SUCCESS",
  LOGIN_FAILURE: "LOGIN_FAILURE",
  LOGOUT: "LOGOUT",
  SET_LOADING: "SET_LOADING",
  CLEAR_ERROR: "CLEAR_ERROR",
  UPDATE_USER: "UPDATE_USER",
  TOKEN_REFRESH_SUCCESS: "TOKEN_REFRESH_SUCCESS",
};

// Reducer function
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.LOGIN_START:
      return {
        ...state,
        isLoading: true,
        error: null,
      };

    case AUTH_ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        refreshToken: action.payload.refreshToken,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };

    case AUTH_ACTIONS.LOGIN_FAILURE:
      return {
        ...state,
        user: null,
        token: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };

    case AUTH_ACTIONS.LOGOUT:
      return {
        ...state,
        user: null,
        token: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };

    case AUTH_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };

    case AUTH_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };

    case AUTH_ACTIONS.UPDATE_USER:
      return {
        ...state,
        user: action.payload,
      };

    case AUTH_ACTIONS.TOKEN_REFRESH_SUCCESS:
      return {
        ...state,
        token: action.payload.token,
        refreshToken: action.payload.refreshToken,
      };

    default:
      return state;
  }
};

// Create context
const AuthContext = createContext();

// Auth Provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const token = localStorage.getItem("token");
        const refreshToken = localStorage.getItem("refreshToken");
        const user = localStorage.getItem("user");

        if (token && refreshToken && user) {
          dispatch({
            type: AUTH_ACTIONS.LOGIN_SUCCESS,
            payload: {
              token,
              refreshToken,
              user: JSON.parse(user),
            },
          });
        } else {
          dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
        }
      } catch (error) {
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
      }
    };

    initializeAuth();
  }, []);

  // Login function
  const login = async (credentials) => {
    dispatch({ type: AUTH_ACTIONS.LOGIN_START });

    try {
      const response = await authApi.login(credentials);
      const { token, user, refreshToken } = response.data;

      // Store in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("user", JSON.stringify(user));

      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: { token, refreshToken, user },
      });

      return { success: true, data: response.data };
    } catch (error) {
      // Get comprehensive error information
      const errorMessage = error.response?.data?.error || error.response?.data?.message || "Login failed";
      const statusCode = error.response?.status;
      
      dispatch({
        type: AUTH_ACTIONS.LOGIN_FAILURE,
        payload: errorMessage,
      });

      return { 
        success: false, 
        error: errorMessage,
        statusCode: statusCode,
        fullError: error.response?.data
      };
    }
  };

  // Register function
  const register = async (userData) => {
    dispatch({ type: AUTH_ACTIONS.LOGIN_START });

    try {
      const response = await authApi.register(userData);
      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage = error.response?.data?.error || "Registration failed";
      dispatch({
        type: AUTH_ACTIONS.LOGIN_FAILURE,
        payload: errorMessage,
      });

      return { success: false, error: errorMessage };
    }
  };

  // Google login function
  const googleLogin = async (googleData) => {
    dispatch({ type: AUTH_ACTIONS.LOGIN_START });

    try {
      const response = await authApi.googleLogin(googleData);
      const { token, user, refreshToken } = response.data;

      // Store in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("user", JSON.stringify(user));

      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: { token, refreshToken, user },
      });

      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage = error.response?.data?.error || "Google login failed";
      dispatch({
        type: AUTH_ACTIONS.LOGIN_FAILURE,
        payload: errorMessage,
      });

      return { success: false, error: errorMessage };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      // Call logout API if token exists
      if (state.token) {
        await authApi.logout();
      }
    } catch (error) {
    } finally {
      // Clear localStorage and state regardless of API call result
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");

      dispatch({ type: AUTH_ACTIONS.LOGOUT });
    }
  };

  // Update user profile
  const updateProfile = async (profileData) => {
    try {
      const response = await authApi.updateProfile(profileData);

      // The API response structure is: response.data = { success, message, data: actualUserObject }
      // But authApi.updateProfile returns response.data (which already unwrapped once)
      // So the actual user is in response.data.data OR just response.data itself
      let updatedUser;

      if (response.data.data) {
        // If there's a nested data property
        updatedUser = response.data.data;
      } else if (response.data.user) {
        // If there's a user property
        updatedUser = response.data.user;
      } else if (response.data._id) {
        // If response.data itself has user properties (_id is a user field)
        updatedUser = response.data;
      } else {
        return { success: true, data: response.data };
      }


      // Update localStorage
      localStorage.setItem("user", JSON.stringify(updatedUser));

      dispatch({
        type: AUTH_ACTIONS.UPDATE_USER,
        payload: updatedUser,
      });

      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "Profile update failed";
      return { success: false, error: errorMessage };
    }
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  };

  // Context value
  const value = {
    ...state,
    login,
    register,
    googleLogin,
    logout,
    updateProfile,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// PropTypes validation
AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
