import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { loginStart, loginSuccess, loginFailure, logout } from '../store/slices/authSlice';
import api from '../services/api';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, loading, error } = useSelector((state: RootState) => state.auth);

  const login = async (email: string, password: string) => {
    try {
      dispatch(loginStart());
      const response = await api.post('/auth/login', { email, password });
      dispatch(loginSuccess(response.data));
    } catch (error: any) {
      dispatch(loginFailure(error.response?.data?.message || 'Login failed'));
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      dispatch(loginStart());
      const response = await api.post('/auth/register', { name, email, password });
      dispatch(loginSuccess(response.data));
    } catch (error: any) {
      dispatch(loginFailure(error.response?.data?.message || 'Registration failed'));
    }
  };

  const logoutUser = () => {
    dispatch(logout());
  };

  return {
    user,
    isAuthenticated,
    loading,
    error,
    login,
    register,
    logout: logoutUser,
  };
};
