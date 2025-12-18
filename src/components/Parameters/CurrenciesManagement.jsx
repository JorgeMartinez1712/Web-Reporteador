import { useState, useEffect } from 'react';
import useParameters from '../../hooks/useParameters';
import { FaSpinner } from 'react-icons/fa';
import WarningNotification from '../common/WarningNotification';

const CurrenciesManagement = () => {
    const { data, loading, error, fetchData, createItem, updateItem, deleteItem } = useParameters('/currencies');
    const [currencies, setCurrencies] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentCurrency, setCurrentCurrency] = useState(null);
    const [name, setName] = useState('');
    const [code, setCode] = useState('');
    const [symbol, setSymbol] = useState('');
    const [showWarning, setShowWarning] = useState(false);
    const [warningMessage, setWarningMessage] = useState('');

    useEffect(() => {
        if (data && Array.isArray(data)) {
            setCurrencies(data);
        } else {
            setCurrencies([]);
        }
    }, [data]);

    useEffect(() => {
        if (currentCurrency) {
            setName(currentCurrency.name || '');
            setCode(currentCurrency.code || '');
            setSymbol(currentCurrency.symbol || '');
        } else {
            setName('');
            setCode('');
            setSymbol('');
        }
    }, [currentCurrency]);

    const handleShowWarning = (message) => {
        setWarningMessage(message);
        setShowWarning(true);
        setTimeout(() => {
            setShowWarning(false);
            setWarningMessage('');
        }, 3000);
    };

    const handleCreateOrUpdate = async (e) => {
        e.preventDefault();

        if (!name.trim() || !code.trim() || !symbol.trim()) {
            handleShowWarning('Por favor, ingresa el Nombre, el Código y el Símbolo de la moneda.');
            return;
        }

        if (code.length !== 3) {
            handleShowWarning('El campo Código debe tener exactamente 3 caracteres.');
            return;
        }

        if (/\d/.test(code)) {
            handleShowWarning('El campo Código no puede contener números.');
            return;
        }

        try {
            const currencyData = {
                name,
                code: code.toUpperCase(),
                symbol,
            };

            if (isEditing) {
                await updateItem(currentCurrency.id, currencyData);
            } else {
                await createItem(currencyData);
            }
            setName('');
            setCode('');
            setSymbol('');
            setIsEditing(false);
            setCurrentCurrency(null);
            fetchData();
        } catch (err) {
            console.error('Error al guardar la moneda:', err);
            handleShowWarning(`Error al guardar la moneda: ${err.response?.data?.message || err.message}`);
        }
    };

    const handleEdit = (item) => {
        setIsEditing(true);
        setCurrentCurrency(item);
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar esta moneda?')) {
            try {
                await deleteItem(id);
                fetchData();
            } catch (err) {
                console.error('Error al eliminar moneda:', err);
                handleShowWarning(`Error al eliminar la moneda: ${err.response?.data?.message || err.message}`);
            }
        }
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setCurrentCurrency(null);
        setName('');
        setCode('');
        setSymbol('');
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <FaSpinner className="animate-spin text-emerald-600 text-4xl" />
            </div>
        );
    }

    if (error) return <div className="text-center py-4 text-red-600">Error: {error}</div>;

    return (
        <div className="p-4">
            <WarningNotification isOpen={showWarning} message={warningMessage} onClose={() => setShowWarning(false)} />
            <form onSubmit={handleCreateOrUpdate} className="mb-6 p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                        <label htmlFor="code" className="block text-gray-700 text-sm font-bold mb-2">
                            Código:
                        </label>
                        <input
                            type="text"
                            id="code"
                            className="border border-gray-300 rounded-lg p-2 w-full text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            disabled={isEditing}
                            placeholder="Ej: USD"
                            maxLength="3"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
                            Nombre:
                        </label>
                        <input
                            type="text"
                            id="name"
                            className="border border-gray-300 rounded-lg p-2 w-full text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Ej: Dólar estadounidense"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="symbol" className="block text-gray-700 text-sm font-bold mb-2">
                            Símbolo:
                        </label>
                        <input
                            type="text"
                            id="symbol"
                            className="border border-gray-300 rounded-lg p-2 w-full text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            value={symbol}
                            onChange={(e) => setSymbol(e.target.value)}
                            placeholder="Ej: $"
                            required
                        />
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
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
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
                                    Símbolo
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {Array.isArray(currencies) && currencies.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-4 whitespace-nowrap text-center text-gray-500">
                                        No hay monedas.
                                    </td>
                                </tr>
                            ) : (
                                Array.isArray(currencies) && currencies.map((currencyItem, index) => (
                                    <tr key={currencyItem.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{currencyItem.code}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{currencyItem.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{currencyItem.symbol}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium flex items-center space-x-2">
                                            <button
                                                onClick={() => handleEdit(currencyItem)}
                                                className="w-6 h-6 flex items-center justify-center rounded-full p-0 cursor-pointer bg-blue-200 hover:bg-blue-300 text-blue-500"
                                            >
                                                <i className="bi bi-pencil-square text-base"></i>
                                            </button>
                                            {/* <button
                                                onClick={() => handleDelete(currencyItem.id)}
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

export default CurrenciesManagement;