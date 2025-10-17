import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

const ROLE_ROUTES = {
  admin: '/admin/dashboard',
  dispatcher: '/dispatcher/dashboard',
  collector: '/collector/dashboard',
  householder: '/householder/dashboard'
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      authAPI.getProfile()
        .then(response => {
          setUser(response.data);
          // Redirect to role-specific dashboard if on login page
          if (window.location.pathname === '/login') {
            navigate(ROLE_ROUTES[response.data.role]);
          }
        })
        .catch(() => {
          localStorage.removeItem('token');
          navigate('/login');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [navigate]);

  const login = async (credentials) => {
    try {
      const response = await authAPI.login(credentials);
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      setUser(user);
      // Redirect to role-specific dashboard
      navigate(ROLE_ROUTES[user.role]);
      return user;
    } catch (error) {
      throw error.response?.data?.message || 'Login failed';
    }
  };

  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData);
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      setUser(user);
      // Redirect to role-specific dashboard
      navigate(ROLE_ROUTES[user.role]);
      return user;
    } catch (error) {
      throw error.response?.data?.message || 'Registration failed';
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};