import { useState, useEffect, useCallback, useRef } from 'react';
import axiosInstance from '../api/axiosInstance';

const useRegisterEnterprise = ({
  autoFetchEnterprises = true,
  autoFetchFinanciers = true,
  autoFetchRetailStatuses = true,
  autoFetchUnitStatuses = true,
  autoFetchDocTypes = true,
  autoFetchCurrencies = true,
} = {}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [enterprises, setEnterprises] = useState([]);
  const [financiers, setFinanciers] = useState([]);
  const [retailStatuses, setRetailStatuses] = useState([]);
  const [unitStatuses, setUnitStatuses] = useState([]);
  const [docTypes, setDocTypes] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const didInitRef = useRef(false);

  const fetchFinanciers = useCallback(async () => {
    try {
      const response = await axiosInstance.post('/financiers/show', {
        financierId: 1,
      });
      setFinanciers(response.data || []);
    } catch (err) {
      setError(err.friendlyMessage || err.message || 'Error al obtener datos del financista');
    }
  }, []);

  const fetchRetailStatuses = useCallback(async () => {
    try {
      const response = await axiosInstance.get('/retail-status');
      setRetailStatuses(response.data || []);
    } catch (err) {
      setError(err.friendlyMessage || err.message || 'Error al obtener estados de la empresa');
    }
  }, []);

  const fetchUnitStatuses = useCallback(async () => {
    try {
      const response = await axiosInstance.get('/retail-units/status/index');
      setUnitStatuses(response.data || []);
    } catch (err) {
      setError(err.friendlyMessage || err.message || 'Error al obtener estados de la sucursal');
    }
  }, []);

  const fetchDocTypes = useCallback(async () => {
    try {
      const response = await axiosInstance.get('/doc-type');
      setDocTypes(response.data || []);
    } catch (err) {
      setError(err.friendlyMessage || err.message || 'Error al obtener tipos de documento');
    }
  }, []);

  const fetchEnterprises = useCallback(async () => {
    try {
      const response = await axiosInstance.post('/retails/index');
      setEnterprises(response.data || []);
    } catch (err) {
      setError(err.friendlyMessage || err.message || 'Error al obtener las empresas');
    }
  }, []);

  const fetchCurrencies = useCallback(async () => {
    try {
      const response = await axiosInstance.get('/currencies');
      setCurrencies(response.data.data || []);
    } catch (err) {
      setError(err.friendlyMessage || err.message || 'Error al obtener las monedas');
    }
  }, []);

  const fetchEnterpriseDetail = useCallback(async (retailId) => {
    try {
      const response = await axiosInstance.post('/retails/show', { retailId });
      return response.data[0];
    } catch (err) {
      setError(err.friendlyMessage || err.message || 'Error al cargar los detalles de la empresa.');
      throw err;
    }
  }, []);

  const registerEnterprise = async (formData) => {
    setError(null);
    try {
      const response = await axiosInstance.post('/retails/store', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      await fetchEnterprises();
      return response.data;
    } catch (err) {
      setError(err.friendlyMessage || err.message || err.response?.data?.message || 'Error al registrar la empresa');
      throw err;
    }
  };


  const updateEnterprise = async (payload) => {
    setError(null);
    try {
      const response = await axiosInstance.post('/retails/update', payload, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      await fetchEnterprises();
      return response.data;
    } catch (err) {
      setError(err.friendlyMessage || err.message || err.response?.data?.message || 'Error al actualizar la empresa');
      throw err;
    }
  };

  const deleteEnterprise = async (id, currentEnterpriseData) => {
    setError(null);
    try {
      const updatedData = {
        ...currentEnterpriseData,
        status_id: 3,
      };
      const payload = {
        id,
        ...updatedData
      };
      const response = await axiosInstance.post('/retails/update', payload);
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      await fetchEnterprises();
    } catch (err) {
      setError(err.friendlyMessage || err.message || err.response?.data?.message || 'Error al marcar la empresa como eliminada');
      throw err;
    }
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      if (didInitRef.current) return;
      didInitRef.current = true;
      setLoading(true);
      setError(null);
      try {
        const tasks = [];
        if (autoFetchEnterprises) tasks.push(fetchEnterprises());
        if (autoFetchFinanciers) tasks.push(fetchFinanciers());
        if (autoFetchRetailStatuses) tasks.push(fetchRetailStatuses());
        if (autoFetchUnitStatuses) tasks.push(fetchUnitStatuses());
        if (autoFetchDocTypes) tasks.push(fetchDocTypes());
        if (autoFetchCurrencies) tasks.push(fetchCurrencies());
        if (tasks.length) {
          await Promise.all(tasks);
        }
      } catch {
        setError('Error al cargar los datos iniciales.');
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, [
    autoFetchEnterprises,
    autoFetchFinanciers,
    autoFetchRetailStatuses,
    autoFetchUnitStatuses,
    autoFetchDocTypes,
    autoFetchCurrencies,
    fetchEnterprises,
    fetchFinanciers,
    fetchRetailStatuses,
    fetchUnitStatuses,
    fetchDocTypes,
    fetchCurrencies,
  ]);

  return {
    enterprises,
    financiers,
    retailStatuses,
    unitStatuses,
    docTypes,
    currencies,
    loading,
    error,
    setError,
    fetchEnterprises,
    fetchFinanciers,
    fetchRetailStatuses,
    fetchUnitStatuses,
    fetchDocTypes,
    fetchCurrencies,
    fetchEnterpriseDetail,
    registerEnterprise,
    updateEnterprise,
    deleteEnterprise,
  };
};

export default useRegisterEnterprise;