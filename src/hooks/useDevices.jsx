import { useState, useCallback } from 'react';
import axiosInstance from '../api/axiosInstance';

const useDevices = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [devices, setDevices] = useState([]);

    const fetchDevices = useCallback(async ({ fechaInicio, fechaFin }) => {
        setLoading(true);
        setError(null);
        try {
            const payload = {
                fechaInicio,
                fechaFin
            };
            const response = await axiosInstance.post('/ListDevices', payload);
            setDevices(response.data || []);
        } catch (err) {
            console.error('Error al obtener los dispositivos:', err);
            setError('Error al cargar los dispositivos.');
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        devices,
        loading,
        error,
        fetchDevices,
    };
};

export default useDevices;