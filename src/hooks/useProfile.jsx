import { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom'; 

const useProfile = () => {
  const { user } = useAuth();
  const navigate = useNavigate(); 
  const [profile, setProfile] = useState(user);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailError, setEmailError] = useState(null);
  const [userTypes, setUserTypes] = useState([]); 

  useEffect(() => {
    setProfile(user);
  }, [user]);

  useEffect(() => {
    const fetchUserTypes = async () => {
      try {
        const response = await axiosInstance.get('/user-types');
        setUserTypes(response.data.data);
      } catch (err) {
        console.error('Error al cargar tipos de usuario:', err);
      }
    };
    fetchUserTypes();
  }, []); 

  const updateProfile = async (updatedData) => {
    setLoading(true);
    setError(null);
    try {
      if (!user || !user.id) {
        throw new Error("ID de usuario no disponible para la actualización del perfil.");
      }

      const dataToSend = {
        name: updatedData.name,
        phone_number: updatedData.phone_number,
      };

      const response = await axiosInstance.put(`/users/${user.id}`, dataToSend);
      const updatedProfileData = response.data.user || response.data;
      setProfile(updatedProfileData);
      return updatedProfileData;
    } catch (err) {
      setError(err.response?.data?.message || 'Error al actualizar el perfil.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const sendPasswordResetEmail = async (email) => {
    setEmailLoading(true);
    setEmailError(null);
    try {
      const dataToSend = {
        email: email,
      };
      await axiosInstance.post('/send-verification-code', dataToSend); 
      navigate('/perfil/verificacion', { state: { email: email } }); 
    } catch (err) {
      setEmailError(err.response?.data?.message || 'Error al enviar el correo de restablecimiento de contraseña.');
      throw err;
    } finally {
      setEmailLoading(false);
    }
  };

  const verifyPasswordCode = async (email, code) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.post('/verify-verification-code', { email, code });
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Código de verificación incorrecto.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email, password, code) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.post('/reset-password', { email, password, code });
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Error al restablecer la contraseña.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getUserTypeName = useCallback((typeId) => {
    const type = userTypes.find(t => t.id === typeId);
    return type ? type.name : 'Desconocido';
  }, [userTypes]);

  return {
    profile,
    loading,
    error,
    updateProfile,
    sendPasswordResetEmail,
    emailLoading,
    emailError,
    verifyPasswordCode,
    resetPassword,
    getUserTypeName, 
  };
};

export default useProfile;