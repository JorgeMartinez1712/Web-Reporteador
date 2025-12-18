import { useState, useEffect } from 'react';
import useParameters from '../../hooks/useParameters';
import { FaSpinner } from 'react-icons/fa';
import WarningNotification from '../common/WarningNotification';

const BcvRatesManagement = () => {
  const { data, loading, fetchData, createItem, updateItem } = useParameters('/bcv-rates', 'data');
  const [bcvRates, setBcvRates] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentRate, setCurrentRate] = useState(null);
  const [currency, setCurrency] = useState('');
  const [rate, setRate] = useState('');
  const [rateDate, setRateDate] = useState('');

  const [showWarning, setShowWarning] = useState(false);
  const [warningMessage, setWarningMessage] = useState('');

  useEffect(() => {
    setBcvRates(data);
  }, [data]);

  useEffect(() => {
    if (currentRate) {
      setCurrency(currentRate.currency || '');
      setRate(currentRate.rate || '');
      setRateDate(currentRate.rate_date ? new Date(currentRate.rate_date).toISOString().split('T')[0] : '');
    } else {
      setCurrency('');
      setRate('');
      setRateDate('');
    }
  }, [currentRate]);

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
    if (!currency.trim() || !rate || !rateDate.trim()) {
      handleShowWarning('Por favor, ingresa la Moneda, la Tasa y la Fecha de la tasa.');
      return;
    }

    try {
      const rateData = {
        currency,
        rate: parseFloat(rate),
        rate_date: rateDate,
      };

      if (isEditing) {
        await updateItem(currentRate.id, rateData);
      } else {
        await createItem(rateData);
      }
      setCurrency('');
      setRate('');
      setRateDate('');
      setIsEditing(false);
      setCurrentRate(null);
      fetchData();
    } catch (err) {
      console.error('Error al guardar la tasa BCV:', err);
      if (err.response && err.response.data && err.response.data.errors) {
        const apiErrors = err.response.data.errors;
        let errorMessage = 'Error al guardar la tasa BCV:';
        for (const key in apiErrors) {
          errorMessage += `\n- ${apiErrors[key].join(', ')}`;
        }
        handleShowWarning(errorMessage);
      } else {
        handleShowWarning('Error al guardar la tasa BCV. Inténtalo de nuevo.');
      }
    }
  };

  const handleEdit = (item) => {
    setIsEditing(true);
    setCurrentRate(item);
  };

  // delete functionality intentionally removed - uncomment UI and implement delete when needed

  const handleCancelEdit = () => {
    setIsEditing(false);
    setCurrentRate(null);
    setCurrency('');
    setRate('');
    setRateDate('');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <FaSpinner className="animate-spin text-emerald-600 text-4xl" />
      </div>
    );
  }

  return (
    <div className="p-4">
      <WarningNotification isOpen={showWarning} message={warningMessage} onClose={() => setShowWarning(false)} />
      <form onSubmit={handleCreateOrUpdate} className="mb-6 p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label htmlFor="currency" className="block text-gray-700 text-sm font-bold mb-2">
              Moneda:
            </label>
            <input
              type="text"
              id="currency"
              className="border border-gray-300 rounded-lg p-2 w-full text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-emerald-500"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              placeholder="Ej: USD, EUR"
              required
            />
          </div>
          <div>
            <label htmlFor="rate" className="block text-gray-700 text-sm font-bold mb-2">
              Tasa:
            </label>
            <input
              type="number"
              step="0.0001"
              id="rate"
              className="border border-gray-300 rounded-lg p-2 w-full text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-emerald-500"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              placeholder="Ej: 36.50"
              required
            />
          </div>
          <div>
            <label htmlFor="rateDate" className="block text-gray-700 text-sm font-bold mb-2">
              Fecha de tasa:
            </label>
            <input
              type="date"
              id="rateDate"
              className="border border-gray-300 rounded-lg p-2 w-full text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-emerald-500"
              value={rateDate}
              onChange={(e) => setRateDate(e.target.value)}
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
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">
                #
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">
                Moneda
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">
                Tasa
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">
                Fecha
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {bcvRates.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-4 whitespace-nowrap text-center text-gray-500">
                  No hay tasas BCV.
                </td>
              </tr>
            ) : (
              bcvRates.map((rateItem, index) => (
                <tr key={rateItem.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{rateItem.currency}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{rateItem.rate}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(rateItem.rate_date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium">
                    <button
                      onClick={() => handleEdit(rateItem)}
                      className="text-blue-500 hover:text-blue-700 mr-3"
                    >
                      <i className="bi bi-pencil-square text-base"></i>
                    </button>
                    {/* <button
                      onClick={() => handleDelete(rateItem.id)}
                      className="text-red-500 hover:text-red-700"
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

export default BcvRatesManagement;