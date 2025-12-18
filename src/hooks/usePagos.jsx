import { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../api/axiosInstance';

const usePagos = (endpoint = '/pagos/history', options = {}) => {
  const { autoFetch = true } = options;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagos, setPagos] = useState([]);

  const fetchPagos = useCallback(async () => {
    if (!endpoint) return;
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get(endpoint);
      const body = response.data;
      if (Array.isArray(body)) {
        setPagos(body);
      } else if (body && body.success && Array.isArray(body.data)) {
        setPagos(body.data);
      } else if (body && Array.isArray(body.data)) {
        setPagos(body.data);
      } else {
        setPagos([]);
      }
    } catch (err) {
      setError(err.friendlyMessage || err.message || 'Error al cargar los pagos.');
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    if (autoFetch) fetchPagos();
  }, [fetchPagos, autoFetch]);

  const fetchPagoById = useCallback(async (id) => {
    try {
      const response = await axiosInstance.get(`/payments/${id}`);
      const body = response.data;
      if (body && body.data) return body.data;
      return body;
    } catch (err) {
      const message = err.friendlyMessage || err.message || 'Error al obtener el detalle del pago.';
      throw new Error(message);
    }
  }, []);

  return {
    pagos,
    loading,
    error,
    fetchPagos,
    fetchPagoById,
  };
};

export default usePagos;