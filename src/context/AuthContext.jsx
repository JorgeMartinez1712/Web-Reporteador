import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const fetchUserDetail = async (userId) => {
    if (!userId) {
      return null;
    }
    try {
      const response = await axiosInstance.get(`/users/${userId}`);
      const raw = response.data;
      const normalized = (raw && (raw.user || raw.data?.user)) || (raw && raw.data?.data) || raw?.data || raw;
      return normalized;
    } catch (err) {
      return null;
    }
  };

  const clearAuthData = useCallback(() => {
    setIsAuthenticated(false);
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
  }, []);

  const showSuccessMessage = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const logout = useCallback(() => {
    clearAuthData();
    showSuccessMessage('Cerraste sesión correctamente');
    navigate('/login');
  }, [clearAuthData, navigate, showSuccessMessage]);

  useEffect(() => {
    const checkAuth = async () => {
      let storedToken = localStorage.getItem('token');
      let storedUser = localStorage.getItem('user');
      if (!storedToken || !storedUser) {
        const sessionToken = sessionStorage.getItem('token');
        const sessionUser = sessionStorage.getItem('user');
        if (sessionToken && sessionUser) {
          localStorage.setItem('token', sessionToken);
          localStorage.setItem('user', sessionUser);
          sessionStorage.removeItem('token');
          sessionStorage.removeItem('user');
          storedToken = sessionToken;
          storedUser = sessionUser;
        }
      }

      let authenticated = false;

      if (storedToken && storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          const baseUser = parsed?.id || parsed?.user?.id ? (parsed.id ? parsed : parsed.user) : (parsed?.data?.id ? parsed.data : parsed?.data?.data ? parsed.data.data : parsed || null);
          if (baseUser) {
            let finalUser = baseUser;
            const shouldFetchDetail = baseUser.id && !baseUser.isBypassUser;
            if (shouldFetchDetail) {
              const detailedUser = await fetchUserDetail(baseUser.id);
              if (detailedUser && detailedUser.id) {
                finalUser = detailedUser;
              }
            }
            setIsAuthenticated(true);
            setToken(storedToken);
            setUser(finalUser);
            authenticated = true;
          }
        } catch (e) {}
      }

      if (!authenticated) {
        clearAuthData();
      }

      setAuthLoading(false);
    };

    checkAuth();
  }, [clearAuthData]);

  const login = async (authToken, userData, options = {}) => {
    const { skipUserDetail = false } = options;
    localStorage.setItem('token', authToken);
    localStorage.setItem('user', JSON.stringify(userData));
    let finalUser = userData;
    if (!skipUserDetail && userData?.id && !userData?.isBypassUser) {
      const detailedUser = await fetchUserDetail(userData.id);
      if (detailedUser && detailedUser.id) {
        finalUser = detailedUser;
      }
    }
    setIsAuthenticated(true);
    setToken(authToken);
    setUser(finalUser);
    localStorage.setItem('user', JSON.stringify(finalUser));
    showSuccessMessage('Iniciaste sesión correctamente');
    navigate('/');
  };

  const updateUser = (updatedUserData) => {
    setUser(updatedUserData);
    if (localStorage.getItem('token')) {
      localStorage.setItem('user', JSON.stringify(updatedUserData));
    } else if (sessionStorage.getItem('token')) {
      sessionStorage.setItem('user', JSON.stringify(updatedUserData));
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, token, authLoading, successMessage, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);