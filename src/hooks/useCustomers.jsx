import { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../api/axiosInstance';

const useCustomers = ({ autoFetchLookups = true, fetchStatuses = true } = {}) => {
  const [customers, setCustomers] = useState([]);
  const [customerTypes, setCustomerTypes] = useState([]);
  const [documentTypes, setDocumentTypes] = useState([]);
  const [customerStatuses, setCustomerStatuses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get('/customers');
      setCustomers(response.data || []);
    } catch (err) {
      setError(err.friendlyMessage || err.response?.data?.message || 'Error al obtener los clientes');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCustomerTypes = useCallback(async () => {
    try {
      const response = await axiosInstance.get('/custo-type');
      setCustomerTypes(response.data || []);
    } catch (err) {
      setError(err.friendlyMessage || err.response?.data?.message || 'Error al obtener tipos de cliente');
    }
  }, []);

  const fetchDocumentTypes = useCallback(async () => {
    try {
      const response = await axiosInstance.get('/doc-type');
      setDocumentTypes(response.data || []);
    } catch (err) {
      setError(err.friendlyMessage || err.response?.data?.message || 'Error al obtener tipos de documento');
    }
  }, []);

  const fetchCustomerStatuses = useCallback(async () => {
    try {
      const response = await axiosInstance.get('/custo-status');
      setCustomerStatuses(response.data || []);
    } catch (err) {
      setError(err.friendlyMessage || err.response?.data?.message || 'Error al obtener estados de cliente');
    }
  }, []);

  const fetchCustomerDetails = useCallback(async (customerId) => {
    setError(null);
    try {
      const response = await axiosInstance.get(`/customers/${customerId}`);
      return response.data.customer;
    } catch (err) {
      setError(err.friendlyMessage || err.response?.data?.message || 'Error al obtener los detalles del cliente');
      throw err;
    }
  }, []);

  const registerCustomerOnly = useCallback(async (customerData) => {
    setLoading(true);
    setError(null);
    try {
      const customerResponse = await axiosInstance.post('/register', customerData);
      return customerResponse.data;
    } catch (err) {
      setError(err.friendlyMessage || err.response?.data?.message || 'Error en el proceso de registro del cliente');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateCustomer = useCallback(async (id, updatedData) => {
    setLoading(true);
    setError(null);
    try {
      const payload = { ...updatedData };
      delete payload.password;
      delete payload.password_confirmation;
      const response = await axiosInstance.put(`/customers/${id}`, payload);
      const updatedCustomer = response.data;
      return updatedCustomer;
    } catch (err) {
      setError(err.friendlyMessage || err.response?.data?.message || 'Error al actualizar el cliente');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteCustomer = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      await axiosInstance.delete(`/customers/${id}`);
      return true;
    } catch (err) {
      setError(err.friendlyMessage || err.response?.data?.message || 'Error al eliminar el cliente');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (autoFetchLookups) {
      fetchCustomerTypes();
      fetchDocumentTypes();
      if (fetchStatuses) {
        fetchCustomerStatuses();
      }
    }
  }, [autoFetchLookups, fetchStatuses, fetchCustomerTypes, fetchDocumentTypes, fetchCustomerStatuses]);

  return {
    customers,
    customerTypes,
    documentTypes,
    customerStatuses,
    loading,
    error,
    fetchCustomers,
    fetchCustomerDetails,
    registerCustomerOnly,
    updateCustomer,
    deleteCustomer,
  };
};

export default useCustomers;