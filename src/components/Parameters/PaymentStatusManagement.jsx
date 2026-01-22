import { useState, useEffect } from 'react';
import useParameters from '../../hooks/useParameters';
import { FaSpinner } from 'react-icons/fa';

const PaymentStatusManagement = () => {
    const { data, loading, error, fetchData, createItem, updateItem, deleteItem } = useParameters('/payment-statuses', 'data');
    const [paymentStatuses, setPaymentStatuses] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentStatus, setCurrentStatus] = useState(null);
    const [statusName, setStatusName] = useState('');
    const [statusDescription, setStatusDescription] = useState('');
    const [statusCode, setStatusCode] = useState('');

    useEffect(() => {
        setPaymentStatuses(data);
    }, [data]);

    useEffect(() => {
        if (currentStatus) {
            setStatusName(currentStatus.name || '');
            setStatusDescription(currentStatus.description || '');
            setStatusCode(currentStatus.code || '');
        } else {
            setStatusName('');
            setStatusDescription('');
            setStatusCode('');
        }
    }, [currentStatus]);

    const handleCreateOrUpdate = async (e) => {
        e.preventDefault();
        if (!statusName.trim() || !statusCode.trim()) {
            alert('Por favor, ingresa el Nombre y el Código del estado de pago.');
            return;
        }

        try {
            if (isEditing) {
                await updateItem(currentStatus.id, { name: statusName, description: statusDescription, code: statusCode });
            } else {
                await createItem({ name: statusName, description: statusDescription, code: statusCode });
            }
            setStatusName('');
            setStatusDescription('');
            setStatusCode('');
            setIsEditing(false);
            setCurrentStatus(null);
            fetchData();
        } catch (err) {
            console.error('Error al guardar estado de pago:', err);
            alert(`Error al guardar estado de pago: ${err.response?.data?.message || err.message}`);
        }
    };

    const handleEdit = (status) => {
        setIsEditing(true);
        setCurrentStatus(status);
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este estado de pago?')) {
            try {
                await deleteItem(id);
                fetchData();
            } catch (err) {
                console.error('Error al eliminar estado de pago:', err);
                alert(`Error al eliminar estado de pago: ${err.response?.data?.message || err.message}`);
            }
        }
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setCurrentStatus(null);
        setStatusName('');
        setStatusDescription('');
        setStatusCode('');
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <FaSpinner className="animate-spin text-oscuro text-4xl" />
            </div>
        );
    }

    if (error) return <div className="text-center py-4 text-red-600">Error: {error}</div>;

    return (
        <div className="p-4">
            <form onSubmit={handleCreateOrUpdate} className="mb-6 p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label htmlFor="statusCode" className="block text-gray-700 text-sm font-bold mb-2">
                            Código:
                        </label>
                        <input
                            type="text"
                            id="statusCode"
                            className="border border-gray-300 rounded-lg p-2 w-full text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-claro"
                            value={statusCode}
                            onChange={(e) => setStatusCode(e.target.value)}
                            disabled={isEditing}
                            placeholder="Ej: PENDING, PAID, CANCELLED"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="statusName" className="block text-gray-700 text-sm font-bold mb-2">
                            Nombre:
                        </label>
                        <input
                            type="text"
                            id="statusName"
                            className="border border-gray-300 rounded-lg p-2 w-full text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-claro"
                            value={statusName}
                            onChange={(e) => setStatusName(e.target.value)}
                            placeholder="Ej: Pendiente, Pagado, Cancelado"
                            required
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label htmlFor="statusDescription" className="block text-gray-700 text-sm font-bold mb-2">
                            Descripción:
                        </label>
                        <textarea
                            id="statusDescription"
                            className="border border-gray-300 rounded-lg p-2 w-full text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-claro resize-none h-[42px]"
                            value={statusDescription}
                            onChange={(e) => setStatusDescription(e.target.value)}
                            placeholder="Una breve descripción del estado de pago"
                        ></textarea>
                    </div>
                </div>
                <div className="flex justify-end gap-2">
                    {isEditing && (
                        <button
                            type="button"
                            onClick={handleCancelEdit}
                            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            Cancelar
                        </button>
                    )}
                    <button
                        type="submit"
                        className="bg-oscuro hover:bg-hover text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Guardar
                    </button>
                </div>
            </form>

            <div className="border border-gray-300 rounded-lg overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">
                                    #
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">
                                    Código
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">
                                    Nombre
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">
                                    Descripción
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {paymentStatuses && paymentStatuses.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-4 whitespace-nowrap text-center text-gray-500">
                                        No hay estados de pago.
                                    </td>
                                </tr>
                            ) : (
                                paymentStatuses && paymentStatuses.map((status, index) => (
                                    <tr key={status.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{status.code}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{status.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{status.description}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium flex items-center space-x-2">
                                            <button
                                                onClick={() => handleEdit(status)}
                                                className="w-6 h-6 flex items-center justify-center rounded-full p-0 cursor-pointer bg-blue-200 hover:bg-blue-300 text-blue-500"
                                            >
                                                <i className="bi bi-pencil-square text-base"></i>
                                            </button>
                                            {/* <button
                                                onClick={() => handleDelete(status.id)}
                                                className="w-6 h-6 flex items-center justify-center rounded-full p-0 cursor-pointer bg-red-200 hover:bg-red-300 text-red-500"
                                            >
                                                <i className="bi bi-trash text-base"></i>
                                            </button> */}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default PaymentStatusManagement;