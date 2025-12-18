import { useState, useEffect } from 'react';
import useParameters from '../../hooks/useParameters';
import { FaSpinner } from 'react-icons/fa';

const BcvCurrenciesHistory = () => {
  const { data, loading, error } = useParameters('/bcv-currencies', 'data');
  const [rates, setRates] = useState([]);

  useEffect(() => {
    if (Array.isArray(data)) setRates(data);
    else setRates([]);
  }, [data]);

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (isNaN(d)) return dateStr; 
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = String(d.getFullYear()).slice(-2);
    return `${day}/${month}/${year}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <FaSpinner className="animate-spin text-emerald-600 text-4xl" />
      </div>
    );
  }

  if (error) return <div className="text-center py-4 text-red-600">Error BCV Currencies: {error}</div>;

  return (
    <div className="p-4">
      <div className="border border-gray-300 rounded-lg overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">#</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">Fecha</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">Moneda</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">Cantidad</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">Tasa</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Array.isArray(rates) && rates.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 whitespace-nowrap text-center text-gray-500">No hay registros.</td>
                </tr>
              ) : (
                Array.isArray(rates) && rates.map((item, index) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatDate(item.rate_date)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{(item.currency?.code || '') + (item.currency?.symbol ? ` (${item.currency.symbol})` : '')}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.count}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.rate}</td>
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

export default BcvCurrenciesHistory;