import { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../api/axiosInstance';

const useBrands = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [brands, setBrands] = useState([]);

  const fetchBrands = useCallback(async () => {
    try {
      const response = await axiosInstance.post('/brands/index');
      setBrands(response.data || []);
    } catch (err) {
      console.error('Error al obtener las marcas:', err);
      setError('Error al cargar las marcas.');
    } finally {
      setLoading(false);
    }
  }, []);

  const registerBrand = async (formData) => {
    setError(null);
    try {
      const response = await axiosInstance.post('/brands/store', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setBrands(prev => [...prev, response.data.data]);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Error al registrar la marca');
      throw err;
    }
  };

  const updateBrand = async (id, updatedData) => {
    setError(null);
    try {
      const headers = updatedData instanceof FormData
        ? { 'Content-Type': 'multipart/form-data' }
        : { 'Content-Type': 'application/json' };

      const response = await axiosInstance.post(`/brands/update`, updatedData, {
        headers,
      });

      const updatedBrand = { ...response.data.data, id: id };

      setBrands(prev =>
        prev.map(brand => (brand.id === id ? updatedBrand : brand))
      );
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Error al actualizar la marca');
      throw err;
    }
  };

  const deleteBrand = async (id) => {
    setError(null);
    try {
      await axiosInstance.post(`/brands/destroy/${id}`);
      setBrands(prev => prev.filter(brand => brand.id !== id));
    } catch (err) {
      setError(err.response?.data?.message || 'Error al eliminar la marca');
      throw err;
    }
  };

  useEffect(() => {
    fetchBrands();
  }, [fetchBrands]);

  return {
    brands,
    loading,
    error,
    fetchBrands,
    registerBrand,
    updateBrand,
    deleteBrand,
  };
};

export default useBrands;