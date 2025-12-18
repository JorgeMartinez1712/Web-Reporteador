import { useState } from 'react';
import axiosInstance from '../api/axiosInstance';

const useRegisterUser = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const registerUser = async (formData) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
  
    try {
      const response = await axiosInstance.post('/register', formData);
      setSuccess(true);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Error al registrar usuario');
      throw err; 
    } finally {
      setLoading(false);
    }
  };
  return { registerUser, loading, error, success };
};

export default useRegisterUser;