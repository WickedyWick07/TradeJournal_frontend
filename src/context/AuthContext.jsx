import { useState, useEffect, useContext, createContext } from 'react';
import api from '../services/api';
import axios from 'axios';

const AuthContext = createContext(null);
const API_URL = import.meta.env.VITE_API_URL;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [tokens, setTokens] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  const fetchCurrentUser = async () => {
    try {
      const response = await api.get('api/current-user');
      setCurrentUser(response.data);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        // Attempt to refresh token if unauthorized
        await refreshToken();
        // Retry fetching current user after refreshing the token
        await fetchCurrentUser();
      } else {
        console.log('Error fetching the user:', error);
      }
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedTokens = localStorage.getItem('tokens');
    if (storedUser && storedTokens) {
      setUser(JSON.parse(storedUser));
      setTokens(JSON.parse(storedTokens));

      
    }
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/api/login/`, { email, password });
      const { access, refresh } = response.data;
      setCurrentUser(response.data);

      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      localStorage.setItem('user', JSON.stringify({ username: email }));
      localStorage.setItem('tokens', JSON.stringify({ access, refresh }));

      setUser({ username: email });
      setTokens({ access, refresh });

      return { success: true, message: 'Login successful' };
    } catch (error) {
      console.error('Login error:', error.response ? error.response.data : error.message);
      return {
        success: false,
        error: error.response ? error.response.data : 'Network error',
      };
    }
  };

  const register = async (username, first_name, last_name, email, password) => {
    try {
      const response = await axios.post(`${API_URL}/api/register/`, { username, first_name, last_name, email, password });
      return {
        success: true,
        message: 'Registration successful',
        data: response.data
      };

   
  
    } catch (error) {
      console.error('Registration error:', error.response ? error.response.data : error.message);
      return {
        success: false,
        error: error.response ? error.response.data.message : 'Network error',
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    localStorage.removeItem('tokens');
    setUser(null);
    setTokens(null);
   
    return { success: true, message: 'Logout successful' };
  };

 

  const refreshToken = async () => {
    try {
      const refresh = localStorage.getItem('refresh_token');
      if (!refresh) throw new Error('No refresh token found');

      console.log('Refreshing token with:', refresh); // Debug log


      const response = await api.post(`token/refresh/`, { refresh });
      const { access, refresh: newRefresh } = response.data;

      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', newRefresh);
      localStorage.setItem('tokens', JSON.stringify({ access, refresh: newRefresh }));

      setTokens({ access, refresh: newRefresh });
      console.log('Token refreshed:', access);
    } catch (error) {
      console.log('Error refreshing token:', error);
      logout(); // Log out if refresh fails
    }
  };

  const value = {
    user,
    tokens,
    login,
    register,
    logout,
    fetchCurrentUser,
    currentUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
