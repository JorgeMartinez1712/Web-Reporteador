import { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../api/axiosInstance';

const usePlans = (options = {}) => {
    const { autoLoad = true, initial: initialProp = ['plans', 'planStatuses', 'brands', 'levels'] } = options;
    const initial = initialProp;
    const [plans, setPlans] = useState([]);
    const [planStatuses, setPlanStatuses] = useState([]);
    const [brands, setBrands] = useState([]);
    const [levels, setLevels] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchPlans = useCallback(async () => {
        setError(null);
        try {
            const response = await axiosInstance.get('/financing-plans');
            setPlans(response.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Error al obtener los planes de financiamiento.');
        }
    }, []);

    const fetchPlanStatuses = useCallback(async () => {
        setError(null);
        try {
            const response = await axiosInstance.get('/financing-plan-statuses');
            setPlanStatuses(response.data.data);
        } catch (err) {
            setError(err.response?.data?.data?.message || 'Error al obtener los estados de los planes.');
        }
    }, []);

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

    const fetchLevels = useCallback(async () => {
        setError(null);
        try {
            const response = await axiosInstance.get('/niveles');
            setLevels(response.data.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Error al obtener los niveles.');
        }
    }, []);

    const initialKey = (initial && typeof initial.join === 'function') ? initial.join(',') : String(initial);

    useEffect(() => {
        if (!autoLoad) return;

        const loadInitialData = async () => {
            setLoading(true);
            try {
                const tasks = [];
                const initialArray = initialKey ? initialKey.split(',') : [];
                if (initialArray.includes('plans')) tasks.push(fetchPlans());
                if (initialArray.includes('planStatuses')) tasks.push(fetchPlanStatuses());
                if (initialArray.includes('brands')) tasks.push(fetchBrands());
                if (initialArray.includes('levels')) tasks.push(fetchLevels());

                if (initialArray.length === 0) {
                    await Promise.all([fetchPlans(), fetchPlanStatuses(), fetchBrands(), fetchLevels()]);
                } else {
                    await Promise.all(tasks);
                }
            } catch (err) {
                setError(err?.message || 'Error al cargar datos iniciales.');
            } finally {
                setLoading(false);
            }
        };

        loadInitialData();
    }, [fetchPlans, fetchPlanStatuses, fetchBrands, fetchLevels, autoLoad, initialKey]); // Se eliminó 'initial' y se dejó 'initialKey'

    const createPlan = async (newPlanData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axiosInstance.post('/financing-plans', newPlanData);
            await fetchPlans();
            return response;
        } catch (err) {
            setError(err.response?.data?.message || 'Error al crear el plan de financiamiento.');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const updatePlan = async (id, updatedData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axiosInstance.put(`/financing-plans/${id}`, updatedData);
            await fetchPlans();
            return response;
        } catch (err) {
            setError(err.response?.data?.message || 'Error al actualizar el plan de financiamiento.');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const deletePlan = async (id) => {
        setLoading(true);
        setError(null);
        try {
            await axiosInstance.delete(`/financing-plans/${id}`);
            await fetchPlans();
        } catch (err) {
            setError(err.response?.data?.message || 'Error al eliminar el plan de financiamiento.');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        plans,
        planStatuses,
        brands,
        levels,
        loading,
        error,
        fetchPlans,
        fetchPlanStatuses,
        fetchBrands,
        fetchLevels,
        createPlan,
        updatePlan,
        deletePlan,
    };
};

export default usePlans;