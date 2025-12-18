import { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../api/axiosInstance';

const useSales = (options = {}) => {
  const { autoFetchSales = true } = options;
  const [sales, setSales] = useState([]);
  const [saleToEdit, setSaleToEdit] = useState(null);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [methodsLoading, setMethodsLoading] = useState(false);
  const [methodsError, setMethodsError] = useState(null);

  const fetchSales = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get('/sales');
      setSales(response.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al obtener las ventas');
      console.error("Error fetching sales:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSaleById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get(`/sales/${id}`);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || `Error al obtener la venta con ID ${id}`);
      console.error("Error fetching sale by ID:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSaleForEdit = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get(`/sales/edit/${id}`);
      setSaleToEdit(response.data);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || `Error al obtener la venta para editar con ID ${id}`);
      console.error("Error fetching sale for edit:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPaymentMethods = useCallback(async () => {
    setMethodsLoading(true);
    setMethodsError(null);
    try {
      const response = await axiosInstance.get('/payment-methods');
      setPaymentMethods(response.data || []);
    } catch (err) {
      setMethodsError(err.response?.data?.message || 'Error al obtener los métodos de pago');
      console.error("Error fetching payment methods:", err);
    } finally {
      setMethodsLoading(false);
    }
  }, []);

  const createInitialSale = useCallback(async (salePayload) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.post('/sales/create', salePayload);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Error al crear la venta inicial');
      console.error("Error creating initial sale:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const verifySaleStepTwo = useCallback(async (saleId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.post('/sales/stepTwo', { id: saleId });
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Error al verificar el paso dos');
      console.error("Error verifying sale step two:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createSaleItemStepThree = useCallback(async (saleItemPayload) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.post('/sales/stepThree', saleItemPayload);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Error al crear el ítem de venta');
      console.error("Error creating sale item for step three:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPlanConditions = useCallback(async (payload) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.post('/sales/planCondicionesVentas', payload);
      setLoading(false);
      return response.data;
    } catch (err) {
      if (err.response?.data?.errors?.brand_id) {
        setLoading(false);
        return null;
      }
      setError(err.response?.data?.message || 'Error al obtener las condiciones del plan de venta');
      setLoading(false);
      throw err;
    }
  }, []);

  const submitSaleStepFour = useCallback(async (salePayload) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.post('/sales/stepFour', salePayload);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Error al enviar los datos del paso 4');
      console.error("Error submitting sale step four:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const submitInitialPayment = useCallback(async (payload) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.post('/payments/initialInstallmentPayment', payload);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Error al procesar el pago inicial');
      console.error("Error submitting initial payment:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const submitInitialPaymentRegistered = useCallback(async (payload) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.post('/payments/initialInstallmentPayment/registred', payload);
      if (response.data.status === 'error') {
        const errorMessage = response.data.message || 'Error desconocido';
        throw new Error(errorMessage);
      }
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al registrar el pago inicial';
      setError(errorMessage);
      console.error("Error submitting initial registered payment:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const completeSale = useCallback(async (saleId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.post('/sales/stepFive', { id: saleId });
      if (response.data?.error) {
        throw new Error(response.data.error);
      }
      return response.data;
    } catch (err) {
      setError(err.message || err.response?.data?.message || 'Error al finalizar la venta');
      console.error("Error completing sale:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteSale = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      await axiosInstance.delete(`/sales/${id}`);
      setSales(prevSales => prevSales.filter(sale => sale.id !== id));
    } catch (err) {
      setError(err.response?.data?.message || 'Error al eliminar la venta');
      console.error("Error deleting sale:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const cancelSale = useCallback(async (saleId, notes) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.post('/sales/updateStatus/cancelar', {
        sale_id: saleId,
        notes: notes,
      });
      return response.data;
    } catch (err) {
      const message = err.friendlyMessage || err.response?.data?.message || 'Error al cancelar la orden';
      setError(message);
      console.error('Error cancelling sale:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (autoFetchSales) {
      fetchSales();
    }
  }, [fetchSales, autoFetchSales]);

  return {
    sales,
    saleToEdit,
    paymentMethods,
    loading,
    error,
    methodsLoading,
    methodsError,
    fetchSales,
    fetchSaleById,
    fetchSaleForEdit,
    fetchPaymentMethods,
    createInitialSale,
    verifySaleStepTwo,
    createSaleItemStepThree,
    fetchPlanConditions,
    submitSaleStepFour,
    submitInitialPayment,
    submitInitialPaymentRegistered,
    completeSale,
    deleteSale,
    cancelSale,
    setSaleToEdit,
  };
};

export default useSales;