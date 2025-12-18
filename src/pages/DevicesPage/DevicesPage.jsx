import { useState, useEffect } from 'react';
import DevicesTable from '../../components/devices/DevicesTable';
import DeviceFilter from '../../components/devices/DeviceFilter';
import { FaSpinner } from 'react-icons/fa';
import useDevices from '../../hooks/usedevices';
import SuccessNotification from '../../components/common/SuccessNotification';

const DevicesPage = () => {
    const { devices, loading, fetchDevices } = useDevices();
    const [showSuccessNotification, setShowSuccessNotification] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState('');
    const [currentFilters, setCurrentFilters] = useState(() => {
        const today = new Date();
        const twoWeeksAgo = new Date(today.getTime() - 14 * 24 * 60 * 60 * 1000);
        return {
            fechaFin: today.toISOString().split('T')[0],
            fechaInicio: twoWeeksAgo.toISOString().split('T')[0],
        }
    })

    useEffect(() => {
        const { fechaInicio, fechaFin } = currentFilters
        fetchDevices({ fechaInicio, fechaFin });
    }, [fetchDevices, currentFilters]);

    const handleShowSuccess = (message) => {
        setNotificationMessage(message);
        setShowSuccessNotification(true);
        setTimeout(() => {
            setShowSuccessNotification(false);
            setNotificationMessage('');
        }, 3000);
    };

    const handleDeviceAction = () => {
        const today = new Date();
        const twoWeeksAgo = new Date(today.getTime() - 14 * 24 * 60 * 60 * 1000);
        const fechaFin = today.toISOString().split('T')[0];
        const fechaInicio = twoWeeksAgo.toISOString().split('T')[0];
        setCurrentFilters({ fechaInicio, fechaFin })
        handleShowSuccess('¡Dispositivos actualizados exitosamente!');
    };

    const handleFilter = ({ fechaInicio, fechaFin }) => {
        setCurrentFilters({ fechaInicio, fechaFin })
    };

    return (
        <div className="min-h-screen p-8 relative">
            <SuccessNotification
                isOpen={showSuccessNotification}
                message={notificationMessage}
            />
            <div className="w-full flex justify-between items-center mb-8">
                <h1 className="text-xl font-extrabold text-emerald-700 tracking-tight">
                    Dispositivos
                </h1>
                <DeviceFilter onFilter={handleFilter} initialFilters={currentFilters} isLoading={loading} />
            </div>
            {loading ? (
                <div className="flex justify-center items-center min-h-screen">
                    <FaSpinner className="animate-spin text-emerald-600 text-4xl" />
                </div>
            ) : (
                <DevicesTable
                    devices={devices}
                    loading={loading}
                    onDeviceAction={handleDeviceAction}
                />
            )}
        </div>
    );
};

export default DevicesPage;