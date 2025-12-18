import { useState, useEffect } from 'react';
import useParameters from '../../hooks/useParameters';
import { FaSpinner } from 'react-icons/fa';
import WarningNotification from '../common/WarningNotification';

const BcvCurrenciesManagement = () => {
    const {
        data: bcvCurrenciesData,
        loading: bcvCurrenciesLoading,
        error: bcvCurrenciesError,
        fetchData: fetchBcvCurrencies,
        createItem,
        updateItem
    } = useParameters('/bcv-currencies', 'data');

    const {
        data: bcvRatesOptions,
        loading: bcvRatesLoading,
        error: bcvRatesError,
        fetchData: fetchBcvRates
    } = useParameters('/bcv-rates', 'data');

    const {
        data: currenciesOptions,
        loading: currenciesLoading,
        error: currenciesError,
        fetchData: fetchCurrencies
    } = useParameters('/currencies', 'data');

    const [bcvCurrencies, setBcvCurrencies] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentBcvCurrency, setCurrentBcvCurrency] = useState(null);

    const [name, setName] = useState('');
    const [code, setCode] = useState('');
    const [symbol, setSymbol] = useState('');
    const [bcvRateId, setBcvRateId] = useState('');
    const [currencyId, setCurrencyId] = useState('');
    const [rate, setRate] = useState('');
    const [count, setCount] = useState('');

    const [showWarning, setShowWarning] = useState(false);
    const [warningMessage, setWarningMessage] = useState('');

    useEffect(() => {
        if (Array.isArray(bcvCurrenciesData)) {
            setBcvCurrencies(bcvCurrenciesData);
        } else if (bcvCurrenciesData === null || bcvCurrenciesData === undefined) {
            setBcvCurrencies([]);
        }
    }, [bcvCurrenciesData]);

    useEffect(() => {
        fetchBcvRates();
        fetchCurrencies();
    }, [fetchBcvRates, fetchCurrencies]);

    useEffect(() => {
        if (currentBcvCurrency) {
            setName(currentBcvCurrency.name || '');
            setCode(currentBcvCurrency.code || '');
            setSymbol(currentBcvCurrency.symbol || '');
            setBcvRateId(currentBcvCurrency.bcv_rate_id || '');
            setCurrencyId(currentBcvCurrency.currency_id || '');
            setRate(currentBcvCurrency.rate || '');
            setCount(currentBcvCurrency.count || '');
        } else {
            setName('');
            setCode('');
            setSymbol('');
            setBcvRateId('');
            setCurrencyId('');
            setRate('');
            setCount('');
        }
    }, [currentBcvCurrency]);

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

        if (!name.trim() || !code.trim() || !symbol.trim() || !bcvRateId || !currencyId || rate === '' || count === '') {
            handleShowWarning('Por favor, completa todos los campos obligatorios.');
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
            const bcvCurrencyData = {
                name,
                code: code.toUpperCase(),
                symbol,
                bcv_rate_id: bcvRateId,
                currency_id: currencyId,
                rate: parseFloat(rate),
                count: parseInt(count, 10),
            };

            if (isEditing) {
                await updateItem(currentBcvCurrency.id, bcvCurrencyData);
            } else {
                await createItem(bcvCurrencyData);
            }
            setName('');
            setCode('');
            setSymbol('');
            setBcvRateId('');
            setCurrencyId('');
            setRate('');
            setCount('');
            setIsEditing(false);
            setCurrentBcvCurrency(null);
            fetchBcvCurrencies();
        } catch (err) {
            console.error('Error al guardar la moneda BCV:', err);
            if (err.response && err.response.data && err.response.data.errors) {
                const apiErrors = err.response.data.errors;
                let errorMessage = 'Error al guardar la moneda BCV:';
                for (const key in apiErrors) {
                    errorMessage += `\n- ${apiErrors[key].join(', ')}`;
                }
                handleShowWarning(errorMessage);
            } else {
                handleShowWarning('Error al guardar la moneda BCV. Inténtalo de nuevo.');
            }
        }
    };

    const handleEdit = (item) => {
        setIsEditing(true);
        setCurrentBcvCurrency(item);
    };

    // delete functionality removed for now; re-enable when needed

    const handleCancelEdit = () => {
        setIsEditing(false);
        setCurrentBcvCurrency(null);
        setName('');
        setCode('');
        setSymbol('');
        setBcvRateId('');
        setCurrencyId('');
        setRate('');
        setCount('');
    };

    if (bcvCurrenciesLoading || bcvRatesLoading || currenciesLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <FaSpinner className="animate-spin text-emerald-600 text-4xl" />
            </div>
        );
    }

    if (bcvCurrenciesError) return <div className="text-center py-4 text-red-600">Error BCV Currencies: {bcvCurrenciesError}</div>;
    if (bcvRatesError) return <div className="text-center py-4 text-red-600">Error BCV Rates: {bcvRatesError}</div>;
    if (currenciesError) return <div className="text-center py-4 text-red-600">Error Currencies: {currenciesError}</div>;

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
                            placeholder="Ej: VES"
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
                            placeholder="Ej: Bolívar Digital"
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
                            placeholder="Ej: Bs"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="bcvRateId" className="block text-gray-700 text-sm font-bold mb-2">
                            Tasa BCV:
                        </label>
                        <select
                            id="bcvRateId"
                            className="border border-gray-300 rounded-lg p-2 w-full text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            value={bcvRateId}
                            onChange={(e) => setBcvRateId(e.target.value)}
                            required
                        >
                            <option value="">--seleccionar--</option>
                            {Array.isArray(bcvRatesOptions) && bcvRatesOptions.map((option) => (
                                <option key={option.id} value={option.id}>
                                    {option.name} - {option.rate}
                                </option>
                            ))}
                        </select>
                        {bcvRatesLoading && <p className="text-sm text-gray-500">Cargando tasas BCV...</p>}
                    </div>

                    <div>
                        <label htmlFor="currencyId" className="block text-gray-700 text-sm font-bold mb-2">
                            Moneda:
                        </label>
                        <select
                            id="currencyId"
                            className="border border-gray-300 rounded-lg p-2 w-full text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            value={currencyId}
                            onChange={(e) => setCurrencyId(e.target.value)}
                            required
                        >
                            <option value="">--seleccionar--</option>
                            {Array.isArray(currenciesOptions) && currenciesOptions.map((option) => (
                                <option key={option.id} value={option.id}>
                                    {option.name} ({option.code})
                                </option>
                            ))}
                        </select>
                        {currenciesLoading && <p className="text-sm text-gray-500">Cargando monedas...</p>}
                    </div>

                    <div>
                        <label htmlFor="rate" className="block text-gray-700 text-sm font-bold mb-2">
                            Tasa:
                        </label>
                        <input
                            type="number"
                            id="rate"
                            className="border border-gray-300 rounded-lg p-2 w-full text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            value={rate}
                            onChange={(e) => setRate(e.target.value)}
                            placeholder="Ej: 36.50"
                            step="0.01"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="count" className="block text-gray-700 text-sm font-bold mb-2">
                            Conteo:
                        </label>
                        <input
                            type="number"
                            id="count"
                            className="border border-gray-300 rounded-lg p-2 w-full text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            value={count}
                            onChange={(e) => setCount(e.target.value)}
                            placeholder="Ej: 1"
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

            <div className="border border-gray-300 rounded-lg overflow-hidden shadow-sm overflow-x-auto">
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
                                Tasa
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">
                                Conteo
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">
                                Acciones
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {Array.isArray(bcvCurrencies) && bcvCurrencies.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="px-6 py-4 whitespace-nowrap text-center text-gray-500">
                                    No hay monedas BCV.
                                </td>
                            </tr>
                        ) : (
                            Array.isArray(bcvCurrencies) && bcvCurrencies.map((bcvCurrencyItem, index) => (
                                <tr key={bcvCurrencyItem.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{bcvCurrencyItem.currency?.code || 'N/A'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{bcvCurrencyItem.currency?.name || 'N/A'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{bcvCurrencyItem.symbol}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{bcvCurrencyItem.rate}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{bcvCurrencyItem.count}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium flex items-center space-x-2">
                                        <button
                                            onClick={() => handleEdit(bcvCurrencyItem)}
                                            className="w-6 h-6 flex items-center justify-center rounded-full p-0 cursor-pointer bg-blue-200 hover:bg-blue-300 text-blue-500"
                                        >
                                            <i className="bi bi-pencil-square text-base"></i>
                                        </button>
                                        {/* <button
                                            onClick={() => handleDelete(bcvCurrencyItem.id)}
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
    );
};

export default BcvCurrenciesManagement;