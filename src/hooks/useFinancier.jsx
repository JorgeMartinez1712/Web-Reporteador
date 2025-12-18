import { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../api/axiosInstance';

const useFinancier = () => {
  const [financier, setFinancier] = useState(null);
  const [docTypes, setDocTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFinancier = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.post('/financiers/show', {
        financierId: 1
      });
      setFinancier(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al obtener datos del financista');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchDocTypes = useCallback(async () => {
    setError(null);
    try {
      const response = await axiosInstance.get('/doc-type');
      if (Array.isArray(response.data)) {
        setDocTypes(response.data);
      } else if (response.data && Array.isArray(response.data.data)) {
        setDocTypes(response.data.data);
      } else {
        setDocTypes([]);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error al obtener tipos de documento');
    }
  }, []);

  const updateFinancier = async (updatedData) => {
    setLoading(true);
    setError(null);
    try {
      const headers = updatedData instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : { 'Content-Type': 'application/json' };
      const response = await axiosInstance.post(`/financiers/update`, updatedData, {
        headers,
      });

      setFinancier(response.data);
      return response;
    } catch (err) {
      setError(err.response?.data?.message || 'Error al actualizar grupo financiero');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFinancier();
    fetchDocTypes();
  }, [fetchFinancier, fetchDocTypes]);

  return {
    financier,
    docTypes,
    loading,
    error,
    fetchFinancier,
    fetchDocTypes,
    updateFinancier,
  };
};

export default useFinancier;