import { useState, useEffect } from 'react';
import useParameters from '../../hooks/useParameters';
import { FaSpinner } from 'react-icons/fa';

const PaymentMethodManagement = () => {
    const {
        data: methods,
        loading: methodsLoading,
        error: methodsError,
        fetchData: fetchMethods,
        createItem: createMethod,
        updateItem: updateMethod,
        deleteItem: deleteMethod
    } = useParameters('/payment-methods');
    const {
        data: statuses,
        loading: statusesLoading,
        error: statusesError,
        fetchData: fetchStatuses
    } = useParameters('/payment-method-statuses');
    const [isEditing, setIsEditing] = useState(false);
    const [currentMethod, setCurrentMethod] = useState(null);
    const [methodCode, setMethodCode] = useState('');
    const [methodName, setMethodName] = useState('');
    const [methodType, setMethodType] = useState('');
    const [methodStatusId, setMethodStatusId] = useState('');

    useEffect(() => {
        if (currentMethod) {
            setMethodCode(currentMethod.code || '');
            setMethodName(currentMethod.name || '');
            setMethodType(currentMethod.type || '');
            setMethodStatusId(currentMethod.status_id || '');
        } else {
            setMethodCode('');
            setMethodName('');
            setMethodType('');
            setMethodStatusId('');
        }
    }, [currentMethod]);

    const handleCreateOrUpdate = async (e) => {
        e.preventDefault();
        const code = String(methodCode).trim();
        const name = String(methodName).trim();
        const type = String(methodType).trim();

        if (!code || !name || !type) {
            alert('Por favor, completa el Código, Nombre y Tipo del método de pago.');
            return;
        }

        const payload = {
            code: code,
            name: name,
            type: type,
            status_id: isEditing ? Number(methodStatusId) : 2,
            financier_id: 1,
        };

        try {
            if (isEditing) {
                await updateMethod(currentMethod.id, payload);
            } else {
                await createMethod(payload);
            }
            handleCancelEdit();
            fetchMethods();
        } catch (err) {
            console.error('Error al guardar método de pago:', err);
            alert(`Error al guardar método de pago: ${err.response?.data?.message || err.message}`);
        }
    };

    const handleEdit = (method) => {
        setIsEditing(true);
        setCurrentMethod(method);
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este método de pago?')) {
            try {
                await deleteMethod(id);
                fetchMethods();
            } catch (err) {
                console.error('Error al eliminar método de pago:', err);
                alert(`Error al eliminar método de pago: ${err.response?.data?.message || err.message}`);
            }
        }
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setCurrentMethod(null);
        setMethodCode('');
        setMethodName('');
        setMethodType('');
        setMethodStatusId('');
    };

    if (methodsLoading || statusesLoading) return (
        <div className="flex justify-center items-center">
            <FaSpinner className="animate-spin text-fuchsia-900 text-4xl min-h-screen" />
        </div>
    );
    if (methodsError) return <div className="text-center py-4 text-red-600">Error: {methodsError}</div>;
    if (statusesError) return <div className="text-center py-4 text-red-600">Error: {statusesError}</div>;

    return (
        <div className="p-4">
            <form onSubmit={handleCreateOrUpdate} className="mb-6 p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label htmlFor="methodCode" className="block text-gray-700 text-sm font-bold mb-2">
                            Código:
                        </label>
                        <input
                            type="text"
                            id="methodCode"
                            className="border border-gray-300 rounded-lg p-2 w-full text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                            value={methodCode}
                            onChange={(e) => setMethodCode(e.target.value)}
                            disabled={isEditing}
                            placeholder="Ej: CREDIT_CARD"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="methodName" className="block text-gray-700 text-sm font-bold mb-2">
                            Nombre:
                        </label>
                        <input
                            type="text"
                            id="methodName"
                            className="border border-gray-300 rounded-lg p-2 w-full text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                            value={methodName}
                            onChange={(e) => setMethodName(e.target.value)}
                            placeholder="Ej: Tarjeta de Crédito"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="methodType" className="block text-gray-700 text-sm font-bold mb-2">
                            Tipo:
                        </label>
                        <input
                            type="text"
                            id="methodType"
                            className="border border-gray-300 rounded-lg p-2 w-full text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                            value={methodType}
                            onChange={(e) => setMethodType(e.target.value)}
                            placeholder="Ej: TYPE_001"
                            required
                        />
                    </div>
                    {isEditing && (
                        <div>
                            <label htmlFor="methodStatus" className="block text-gray-700 text-sm font-bold mb-2">
                                Estatus:
                            </label>
                            <select
                                id="methodStatus"
                                className="border border-gray-300 rounded-lg p-2 w-full text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                                value={methodStatusId}
                                onChange={(e) => setMethodStatusId(e.target.value)}
                            >
                                <option value="">Seleccione un estatus</option>
                                {statuses.map((status) => (
                                    <option key={status.id} value={status.id}>{status.name}</option>
                                ))}
                            </select>
                        </div>
                    )}
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
                        className="bg-fuchsia-900 hover:bg-fuchsia-950 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
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
                                    Tipo
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">
                                    Estatus
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {methods && methods.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-4 whitespace-nowrap text-center text-gray-500">
                                        No hay métodos de pago.
                                    </td>
                                </tr>
                            ) : (
                                methods && methods.map((method, index) => (
                                    <tr key={method.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{method.code}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{method.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{method.type}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{method.status.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium flex items-center space-x-2">
                                            <button
                                                onClick={() => handleEdit(method)}
                                                className="w-6 h-6 flex items-center justify-center rounded-full p-0 cursor-pointer bg-blue-200 hover:bg-blue-300 text-blue-500"
                                            >
                                                <i className="bi bi-pencil-square text-base"></i>
                                            </button>
                                            {/* <button
                                                onClick={() => handleDelete(method.id)}
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

export default PaymentMethodManagement;