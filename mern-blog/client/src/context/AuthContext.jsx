import { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // NEW: Added error state
  const navigate = useNavigate();

  // NEW: Added cleanup for auth token
  useEffect(() => {
    let isMounted = true; // Flag to prevent state updates after unmount

    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          api.defaults.headers.common['x-auth-token'] = token;
          const res = await api.get('/auth/me');
          if (isMounted) { // Only update state if component is mounted
            setUser(res.data);
            setIsAuthenticated(true);
          }
        }
      } catch (err) {
        console.error('Auth check failed:', err);
        if (isMounted) {
          setError(err.response?.data?.message || 'Authentication error'); // NEW: Set error
          logout();
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    checkAuth();

    return () => {
      isMounted = false; // Cleanup function
    };
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true); // NEW: Set loading state
      setError(null); // NEW: Clear previous errors
      const res = await api.post('/auth/login', { email, password });
      
      localStorage.setItem('token', res.data.token);
      api.defaults.headers.common['x-auth-token'] = res.data.token;
      
      const userRes = await api.get('/auth/me');
      setUser(userRes.data);
      setIsAuthenticated(true);
      navigate('/');
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Login failed';
      setError(errorMsg); // NEW: Set error state
      throw errorMsg;
    } finally {
      setLoading(false);
    }
  };

  const register = async (username, email, password) => {
    try {
      setLoading(true); // NEW: Set loading state
      setError(null); // NEW: Clear previous errors
      const res = await api.post('/auth/register', { username, email, password });
      
      localStorage.setItem('token', res.data.token);
      api.defaults.headers.common['x-auth-token'] = res.data.token;
      
      const userRes = await api.get('/auth/me');
      setUser(userRes.data);
      setIsAuthenticated(true);
      navigate('/');
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Registration failed';
      setError(errorMsg); // NEW: Set error state
      throw errorMsg;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['x-auth-token'];
    setUser(null);
    setIsAuthenticated(false);
    setError(null); // NEW: Clear errors on logout
    navigate('/login');
  };

  return (
    <AuthContext.Provider
      value={{ 
        user, 
        isAuthenticated, 
        loading,
        error, // NEW: Added error to context value
        login, 
        register, 
        logout 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider'); // NEW: Better error
  }
  return context;
};

