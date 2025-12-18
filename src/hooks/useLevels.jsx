import { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../api/axiosInstance';

const useLevels = () => {
    const [levels, setLevels] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const endpoint = '/niveles';

    const fetchLevels = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axiosInstance.get(endpoint);
            if (response.data && Array.isArray(response.data.data)) {
                setLevels(response.data.data);
            } else {
                setLevels([]);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Error al obtener los niveles');
        } finally {
            setLoading(false);
        }
    }, []);

    const createLevel = useCallback(async (levelData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axiosInstance.post(endpoint, levelData);
            return response.data;
        } catch (err) {
            setError(err.response?.data?.message || 'Error al crear el nivel');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const updateLevel = useCallback(async (id, levelData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axiosInstance.put(`${endpoint}/${id}`, levelData);
            return response.data;
        } catch (err) {
            setError(err.response?.data?.message || 'Error al actualizar el nivel');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const deleteLevel = useCallback(async (id) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axiosInstance.delete(`${endpoint}/${id}`);
            return response.data;
        } catch (err) {
            setError(err.response?.data?.message || 'Error al eliminar el nivel');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchLevels();
    }, [fetchLevels]);

    return {
        levels,
        loading,
        error,
        fetchLevels,
        createLevel,
        updateLevel,
        deleteLevel,
    };
};

export default useLevels;