import { useState, useCallback } from 'react';
import axiosInstance from '../api/axiosInstance';

const useRegisterPayment = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [customers, setCustomers] = useState([]);

    const fetchCustomers = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axiosInstance.get('/customers');
            setCustomers(response.data || []);
            return response.data || [];
        } catch (err) {
            const msg = err.friendlyMessage || err.message || 'Error al obtener los clientes';
            setError(msg);
            return [];
        } finally {
            setLoading(false);
        }
    }, []);

    const findClientAndSales = async (documentNumber) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axiosInstance.post('/sales/findByCliente', {
                customer_id: String(documentNumber),
            });

            if (response.data.success && response.data.data) {
                return response.data.data;
            } else {
                throw new Error(response.data.message || 'Cliente no encontrado o sin ventas pendientes.');
            }
        } catch (err) {
            const msg = err.friendlyMessage || err.message || 'Error al buscar el cliente.';
            setError(msg);
            return null;
        } finally {
            setLoading(false);
        }
    };

    const fetchPaymentOptions = async (saleId) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axiosInstance.post('/payments/paymentOptions', {
                sale_id: saleId,
            });

            if (response.data.success && response.data.data) {
                return response.data.data;
            } else {
                throw new Error(response.data.message || 'No se pudieron cargar las opciones de pago.');
            }
        } catch (err) {
            const msg = err.friendlyMessage || err.message || 'Error al obtener opciones de pago.';
            setError(msg);
            return null;
        } finally {
            setLoading(false);
        }
    };

    const registerPayment = async (payload) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axiosInstance.post('/payments/registerPayment', payload);

            if (response.data.success) {
                return response.data;
            } else {
                return response.data;
            }
        } catch (err) {
            const errorMessage = err.friendlyMessage || err.message || 'Error de conexión o validación al registrar el pago.';
            setError(errorMessage);
            return { success: false, message: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    const requestPaymentMobileToken = async ({ customer_id, sale_id, retail_unit_id, processed_by_seller_id }) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axiosInstance.post('/payments/paymentMobile/token/request', {
                customer_id,
                sale_id,
                retail_unit_id,
                processed_by_seller_id,
            });

            if (response.data && response.data.success) {
                return response.data;
            }

            return { success: false, message: response.data?.message || 'No response data' };
        } catch (err) {
            const errorMessage = err.friendlyMessage || err.message || 'Error requesting payment mobile token.';
            setError(errorMessage);
            return { success: false, message: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        error,
        customers,
        fetchCustomers,
        findClientAndSales,
        fetchPaymentOptions,
        registerPayment,
        requestPaymentMobileToken,
    };
};

export default useRegisterPayment;