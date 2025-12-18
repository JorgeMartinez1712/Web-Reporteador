import { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../api/axiosInstance';

const useParameters = (endpoint, dataKey = null) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get(endpoint);
      let extractedData = [];
      if (dataKey && response.data && response.data[dataKey]) {
        extractedData = response.data[dataKey];
      } else if (response.data) {
        extractedData = response.data;
      }
      setData(extractedData || []);
    } catch (err) {
      setError(err.message || `Error al cargar ${endpoint}`);
      console.error(`Error al cargar ${endpoint}:`, err);
    } finally {
      setLoading(false);
    }
  }, [endpoint, dataKey]);

  const createItem = async (newItemData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.post(endpoint, newItemData);
      fetchData();
      return response;
    } catch (err) {
      setError(err.message || `Error al crear en ${endpoint}`);
      console.error(`Error al crear en ${endpoint}:`, err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateItem = async (id, updatedData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.put(`${endpoint}/${id}`, updatedData);
      fetchData();
      return response;
    } catch (err) {
      setError(err.message || `Error al actualizar en ${endpoint}`);
      console.error(`Error al actualizar en ${endpoint}:`, err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateItem2 = async (updateEndpoint, updatedData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.post(updateEndpoint, updatedData);
      if (!response.data.success) {
        throw new Error(response.data.message || 'Error al actualizar el ítem');
      }
      fetchData();
      return response.data;
    } catch (err) {
      setError(err.message);
      console.error('Error updating item:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteItem = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await axiosInstance.delete(`${endpoint}/${id}`);
      fetchData();
    } catch (err) {
      setError(err.message || `Error al eliminar en ${endpoint}`);
      console.error(`Error al eliminar en ${endpoint}:`, err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const postUpdateItem = async (updateEndpoint, updatedData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.post(updateEndpoint, updatedData);
      if (response.data.success === false) {
        throw new Error(response.data.message || 'Error al actualizar el ítem');
      }
      fetchData();
      return response.data;
    } catch (err) {
      setError(err.message || 'Error al actualizar el ítem');
      console.error('Error updating item with POST:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    fetchData,
    createItem,
    updateItem,
    updateItem2,
    deleteItem,
    postUpdateItem,
  };
};

export default useParameters;