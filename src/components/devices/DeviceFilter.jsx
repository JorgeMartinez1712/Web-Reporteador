import { useState, useEffect } from 'react';
import { FaSearch, FaRedoAlt, FaSpinner } from 'react-icons/fa';

const DeviceFilter = ({ onFilter, initialFilters = {}, isLoading = false }) => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    useEffect(() => {
        if (initialFilters.fechaInicio) setStartDate(initialFilters.fechaInicio)
        if (initialFilters.fechaFin) setEndDate(initialFilters.fechaFin)
    }, [initialFilters.fechaInicio, initialFilters.fechaFin])

    const handleSubmit = (e) => {
        e.preventDefault();
        const today = new Date();
        const twoWeeksAgo = new Date(today.getTime() - 14 * 24 * 60 * 60 * 1000);
        const defaultEndDate = today.toISOString().split('T')[0];
        const defaultStartDate = twoWeeksAgo.toISOString().split('T')[0];
        const finalStartDate = startDate || defaultStartDate;
        const finalEndDate = endDate || defaultEndDate;
        onFilter({ fechaInicio: finalStartDate, fechaFin: finalEndDate });
    };

    const handleClear = () => {
        setStartDate('');
        setEndDate('');
        const today = new Date();
        const twoWeeksAgo = new Date(today.getTime() - 14 * 24 * 60 * 60 * 1000);
        const defaultEndDate = today.toISOString().split('T')[0];
        const defaultStartDate = twoWeeksAgo.toISOString().split('T')[0];
        onFilter({ fechaInicio: defaultStartDate, fechaFin: defaultEndDate });
    };

    return (
        <form onSubmit={handleSubmit} className="flex items-center space-x-4">
            <div className="flex flex-col text-left">
                <label htmlFor="startDate" className="text-sm font-semibold text-hover">
                    Fecha de inicio
                </label>
                <input
                    id="startDate"
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        disabled={isLoading}
                        className={`border border-claro rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-claro transition-colors duration-200 ${isLoading ? 'opacity-60 cursor-not-allowed' : ''}`}
                />
            </div>
            <div className="flex flex-col text-left">
                <label htmlFor="endDate" className="text-sm font-semibold text-hover">
                    Fecha de fin
                </label>
                <input
                    id="endDate"
                    type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        disabled={isLoading}
                        className={`border border-claro rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-claro transition-colors duration-200 ${isLoading ? 'opacity-60 cursor-not-allowed' : ''}`}
                />
            </div>
            <button
                type="submit"
                    className={`bg-oscuro hover:bg-hover text-white p-3 rounded-full shadow-lg transition-transform transform ${isLoading ? '' : 'hover:scale-110'}`}
                    aria-label="Buscar dispositivos"
                    disabled={isLoading}
            >
                    {isLoading ? <FaSpinner className="animate-spin" /> : <FaSearch />}
            </button>
            <button
                type="button"
                onClick={handleClear}
                    className={`bg-gray-400 hover:bg-gray-500 text-white p-3 rounded-full shadow-lg transition-transform transform ${isLoading ? '' : 'hover:scale-110'}`}
                    aria-label="Limpiar filtro"
                    disabled={isLoading}
            >
                <FaRedoAlt />
            </button>
        </form>
    );
};

export default DeviceFilter;