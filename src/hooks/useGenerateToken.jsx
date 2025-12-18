import { useState } from 'react';
import axiosInstance from '../api/axiosInstance'; 

const useGenerateToken = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);

  const generateToken = async () => {
    setLoading(true);
    setError(null);

    try {
      const payload = {
        email: 'john@example.com',
        password: 'QmFyY2Vsb25hNTc2Kg==',
      };

      const response = await axiosInstance.post('/Usuario/GetToken', payload); 
      const generatedToken = response.data.data.token; 
      setToken(generatedToken); 
      return generatedToken; 
    } catch (err) {
      setError(err.response?.data?.message || 'Error al generar el token');
      throw err; 
    } finally {
      setLoading(false);
    }
  };

  return { generateToken, token, loading, error };
};

export default useGenerateToken;