import { useState, useEffect, useCallback, useRef } from 'react';
import axiosInstance from '../api/axiosInstance';

export const useRegisterBranch = ({
    autoFetchRetails = true,
    autoFetchFinanciers = true,
    autoFetchUnitStatuses = true,
} = {}) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [branches, setBranches] = useState([]);
    const [retails, setRetails] = useState([]);
    const [financiers, setFinanciers] = useState([]);
    const [unitStatuses, setUnitStatuses] = useState([]);
    const didInitRef = useRef(false);

    const fetchBranches = useCallback(async (retailId = null) => {
        try {
            let url = '/retail-units';
            if (retailId) {
                url = `/retails/${retailId}/units`;
            }
            const response = await axiosInstance.get(url);
            setBranches(retailId ? response.data.units : response.data || []);
        } catch (err) {
            setError(err.friendlyMessage || err.response?.data?.message || 'Error al obtener las sucursales.');
        }
    }, []);

    const fetchRetails = useCallback(async () => {
        try {
            const response = await axiosInstance.post('/retails/index');
            setRetails(response.data || []);
        } catch (err) {
            setError(err.friendlyMessage || err.response?.data?.message || 'Error al obtener empresas');
        }
    }, []);

    const fetchFinanciers = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axiosInstance.post('/financiers/show', {
                financierId: 1,
            });
            setFinanciers(response.data);
        } catch (err) {
            setError(err.friendlyMessage || err.response?.data?.message || 'Error al obtener datos del financista');
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchUnitStatuses = useCallback(async () => {
        try {
            const response = await axiosInstance.get('/retail-units/status/index');
            setUnitStatuses(response.data || []);
        } catch (err) {
            setError(err.friendlyMessage || err.response?.data?.message || 'Error al obtener estados de sucursal');
        }
    }, []);

    const registerBranch = async (formData) => {
        setError(null);
        const response = await axiosInstance.post('/retail-units/store', formData);
        return response.data;
    };

    const updateBranch = async (id, formData) => {
        setError(null);
        try {
            const updatedData = {
                ...formData,
                id: id,
            };
            const response = await axiosInstance.post('/retail-units/update', updatedData);
            return response.data;
        } catch (err) {
            setError(err.friendlyMessage || err.response?.data?.message || 'Error al actualizar la sucursal');
            throw err;
        }
    };

    const deleteBranch = async (id, currentBranchData) => {
        setError(null);
        try {
            const updatedData = {
                ...currentBranchData,
                status_id: 5,
            };

            const response = await axiosInstance.put(`/retail-units/${id}`, updatedData);
            return response.data;
        } catch (err) {
            setError(err.friendlyMessage || err.response?.data?.message || 'Error al marcar la sucursal como eliminada');
            throw err;
        }
    };

    useEffect(() => {
        const fetchAllInitialData = async () => {
            if (didInitRef.current) return;
            didInitRef.current = true;
            setLoading(true);
            setError(null);
            try {
                const tasks = [];
                if (autoFetchRetails) tasks.push(fetchRetails());
                if (autoFetchFinanciers) tasks.push(fetchFinanciers());
                if (autoFetchUnitStatuses) tasks.push(fetchUnitStatuses());
                if (tasks.length) {
                    await Promise.all(tasks);
                }
            } catch {
                setError('Error al cargar datos iniciales de sucursales.');
            } finally {
                setLoading(false);
            }
        };
        fetchAllInitialData();
    }, [autoFetchRetails, autoFetchFinanciers, autoFetchUnitStatuses, fetchRetails, fetchFinanciers, fetchUnitStatuses]);

    return {
        branches,
        loading,
        error,
        fetchBranches,
        registerBranch,
        updateBranch,
        deleteBranch,
        retails,
        financiers,
        unitStatuses,
        fetchRetails,
        fetchFinanciers,
        fetchUnitStatuses,
    };
};

export default useRegisterBranch;