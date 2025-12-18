import { useState, useCallback } from 'react';
import axiosInstance from '../api/axiosInstance';

const REPORT_ENDPOINTS = {
  accounts: '/cuentasPorCobrar',
  operations: '/reporteOrdenes',
  shopPayments: '/cuentasXpagar',
  retails: '/retails/index',
  retailUnits: '/retails', 
  profitability: '/rentabilidad',
};

const extractData = response => {
  if (!response) return []
  if (Array.isArray(response.data)) return response.data
  if (response.data?.data) return response.data.data
  if (response.data?.units) return response.data.units
  return []
}

const useReportes = () => {
  const [accounts, setAccounts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [shopPayments, setShopPayments] = useState([]);
  const [retails, setRetails] = useState([]);
  const [retailUnits, setRetailUnits] = useState([]);
  const [profitability, setProfitability] = useState([]);
  const [loading, setLoading] = useState({
    accounts: false,
    orders: false,
    shopPayments: false,
    retails: false,
    retailUnits: false,
    profitability: false,
  });
  const [errors, setErrors] = useState({
    accounts: null,
    orders: null,
    shopPayments: null,
    retails: null,
    retailUnits: null,
    profitability: null,
  });

  const setLoadingFor = useCallback((key, value) => {
    setLoading((prev) => ({ ...prev, [key]: value }));
  }, []);

  const setErrorFor = useCallback((key, value) => {
    setErrors((prev) => ({ ...prev, [key]: value }));
  }, []);

  const fetchRetailUnits = useCallback(async retailId => {
    if (!retailId) {
      setRetailUnits([])
      return []
    }
    setLoadingFor('retailUnits', true)
    setErrorFor('retailUnits', null)
    try {
      const response = await axiosInstance.get(`${REPORT_ENDPOINTS.retailUnits}/${retailId}/units`)
      const data = extractData(response)
      setRetailUnits(Array.isArray(data) ? data : [])
      return data
    } catch (error) {
      console.error('Error al obtener las sucursales:', error)
      setErrorFor('retailUnits', 'No se pudieron cargar las sucursales.')
      setRetailUnits([])
      return []
    } finally {
      setLoadingFor('retailUnits', false)
    }
  }, [setLoadingFor, setErrorFor])

  const fetchRetails = useCallback(async () => {
    setLoadingFor('retails', true)
    setErrorFor('retails', null)
    try {
      const response = await axiosInstance.post(REPORT_ENDPOINTS.retails)
      const data = extractData(response)
      setRetails(Array.isArray(data) ? data : [])
      return data
    } catch (error) {
      console.error('Error al obtener las empresas:', error)
      setErrorFor('retails', 'No se pudieron cargar las empresas.')
      setRetails([])
      return []
    } finally {
      setLoadingFor('retails', false)
    }
  }, [setLoadingFor, setErrorFor])

  const fetchAccountsReport = useCallback(async (params = {}) => {
    setLoadingFor('accounts', true)
    setErrorFor('accounts', null)
    try {
      const response = await axiosInstance.post(REPORT_ENDPOINTS.accounts, params)
      const data = extractData(response)
      setAccounts(Array.isArray(data) ? data : [])
      return data
    } catch (error) {
      const message = error?.friendlyMessage || error?.response?.data?.message || 'No se pudo cargar el reporte de cuentas por cobrar.'
      console.error('Error al obtener el reporte de cuentas por cobrar:', error)
      setErrorFor('accounts', message)
      setAccounts([])
      return []
    } finally {
      setLoadingFor('accounts', false)
    }
  }, [setLoadingFor, setErrorFor])

  const fetchOrdersReport = useCallback(async (params = {}) => {
    setLoadingFor('orders', true)
    setErrorFor('orders', null)
    try {
      const response = await axiosInstance.post(REPORT_ENDPOINTS.operations, params)
      const data = extractData(response)
      setOrders(Array.isArray(data) ? data : [])
      return data
    } catch (error) {
      const message = error?.friendlyMessage || error?.response?.data?.message || 'No se pudo cargar el reporte de órdenes.'
      console.error('Error al obtener el reporte de órdenes:', error)
      setErrorFor('orders', message)
      setOrders([])
      return []
    } finally {
      setLoadingFor('orders', false)
    }
  }, [setLoadingFor, setErrorFor])

  const fetchShopPaymentsReport = useCallback(async (params = {}) => {
    setLoadingFor('shopPayments', true)
    setErrorFor('shopPayments', null)
    try {
      const response = await axiosInstance.post(REPORT_ENDPOINTS.shopPayments, params)
      const data = extractData(response)
      setShopPayments(Array.isArray(data) ? data : [])
      return data
    } catch (error) {
      const message = error?.friendlyMessage || error?.response?.data?.message || 'No se pudo cargar el reporte de pagos en tiendas.'
      console.error('Error al obtener el reporte de pagos en tiendas:', error)
      setErrorFor('shopPayments', message)
      setShopPayments([])
      return []
    } finally {
      setLoadingFor('shopPayments', false)
    }
  }, [setLoadingFor, setErrorFor])

  const fetchProfitabilityReport = useCallback(async (params = {}) => {
    setLoadingFor('profitability', true)
    setErrorFor('profitability', null)
    try {
      const response = await axiosInstance.post(REPORT_ENDPOINTS.profitability, params)
      if (response?.data && response.data.success === false) {
        const msg = response.data.message || 'No se pudo cargar el reporte de rentabilidad.'
        const err = new Error(msg)
        err.friendlyMessage = msg
        throw err
      }
      const data = extractData(response)
      setProfitability(Array.isArray(data) ? data : [])
      return data
    } catch (error) {
      const message = error?.friendlyMessage || error?.response?.data?.message || 'No se pudo cargar el reporte de rentabilidad.'
      console.error('Error al obtener el reporte de rentabilidad:', error)
      setErrorFor('profitability', message)
      setProfitability([])
      return []
    } finally {
      setLoadingFor('profitability', false)
    }
  }, [setLoadingFor, setErrorFor])

  return {
    accounts,
    orders,
    shopPayments,
    profitability,
    loading,
    errors,
    fetchAccountsReport,
    fetchOrdersReport,
    fetchShopPaymentsReport,
    fetchProfitabilityReport,
    retails,
    fetchRetails,
    retailUnits,
    fetchRetailUnits,
  };
};

export default useReportes;
