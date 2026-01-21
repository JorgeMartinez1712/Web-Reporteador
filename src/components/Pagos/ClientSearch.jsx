import React, { useState, useEffect, useCallback } from 'react';
import { FaSearch, FaSpinner, FaTimesCircle, FaUser, FaIdCard, FaMobileAlt, FaEnvelope, FaArrowRight } from 'react-icons/fa';

const ClientSearch = ({ onClientFound, findClientAndSales, hookError, fetchCustomers, allCustomers, customersLoading }) => {
    const [selectedClient, setSelectedClient] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loadingLocal, setLoadingLocal] = useState(false);
    const [errorLocal, setErrorLocal] = useState(null);

    useEffect(() => {
        if (allCustomers.length === 0 && !customersLoading) {
            fetchCustomers();
        }
    }, [fetchCustomers, allCustomers, customersLoading]);

    useEffect(() => {
        if (!selectedClient && searchQuery.length > 2) {
            setLoadingLocal(true);
            const delayDebounceFn = setTimeout(() => {
                const lowerCaseQuery = searchQuery.toLowerCase();
                const filtered = allCustomers.filter(
                    (client) =>
                        client.full_name.toLowerCase().includes(lowerCaseQuery) ||
                        client.document_number.toLowerCase().includes(lowerCaseQuery) ||
                        client.phone_number.toLowerCase().includes(lowerCaseQuery)
                );

                setSearchResults(filtered);
                setLoadingLocal(false);
            }, 500);
            return () => clearTimeout(delayDebounceFn);
        } else {
            setSearchResults([]);
            setLoadingLocal(false);
        }
    }, [searchQuery, allCustomers, selectedClient]);

    const handleSelectClient = useCallback((client) => {
        setSelectedClient(client);
        setSearchQuery(client.full_name);
        setSearchResults([]);
        setErrorLocal(null);
    }, []);

    const handleRemoveSelectedClient = useCallback(() => {
        setSelectedClient(null);
        setSearchQuery('');
        setSearchResults([]);
        setErrorLocal(null);
    }, []);

    const handleNext = async (e) => {
        e.preventDefault();
        setErrorLocal(null);

        if (!selectedClient) {
            setErrorLocal('Por favor, selecciona un cliente de la lista para continuar.');
            return;
        }

        setLoadingLocal(true);

        const result = await findClientAndSales(selectedClient.id);

        if (result) {
            onClientFound(result);
        } else {
            setErrorLocal(hookError || 'Error al buscar ventas. Inténtalo de nuevo.');
        }

        setLoadingLocal(false);
    };

    const currentError = hookError || errorLocal;
    const isLoading = loadingLocal || customersLoading;

    return (
        <form onSubmit={handleNext} className="space-y-6">
            <h3 className="text-2xl font-semibold text-gray-800 border-b pb-4 mb-4 border-gray-200 text-left">
                Seleccionar cliente
            </h3>
            <div>
                <label htmlFor="clientSearch" className="block text-sm font-medium text-gray-700 mb-2 text-left">
                    Buscar cliente por nombre, documento o teléfono
                </label>
                <div className="flex items-center space-x-2">
                    <input
                        type="text"
                        id="clientSearch"
                        className="flex-1 border border-gray-300 p-2 rounded-lg focus:ring-fuchsia-500 focus:border-fuchsia-500"
                        value={searchQuery}
                        onChange={(e) => !selectedClient && setSearchQuery(e.target.value)}
                        placeholder="Escribe nombre, documento o teléfono del cliente"
                        disabled={!!selectedClient || isLoading}
                    />
                </div>

                {searchQuery.length > 2 && !selectedClient && (
                    <>
                        {isLoading && customersLoading ? (
                            <div className="text-gray-600 mt-2 flex items-center">
                                <FaSpinner className="animate-spin inline-block mr-2" />
                                Cargando datos de clientes...
                            </div>
                        ) : loadingLocal ? (
                            <div className="text-gray-600 mt-2 flex items-center">
                                <FaSpinner className="animate-spin inline-block mr-2" />
                                Filtrando...
                            </div>
                        ) : searchResults.length > 0 ? (
                            <ul className="mt-2 border border-gray-200 rounded-lg shadow-sm max-h-40 overflow-y-auto">
                                {searchResults.map((client) => (
                                    <li
                                        key={client.id}
                                        className="p-3 hover:bg-fuchsia-50 cursor-pointer border-b border-gray-200 last:border-b-0 text-gray-800 text-left"
                                        onClick={() => handleSelectClient(client)}
                                    >
                                        <span className="font-semibold">{client.full_name}</span>
                                        <span className="text-gray-600 text-sm ml-2">
                                            ({client.document_type?.code || ''}
                                            {client.document_number || 'N/A'})
                                        </span>
                                        <span className="text-gray-600 text-sm ml-2">{client.phone_number || 'N/A'}</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="text-gray-600 p-3 bg-gray-50 rounded-lg mt-2 border border-gray-200 text-left">
                                No se encontraron resultados.
                            </div>
                        )}
                    </>
                )}
            </div>

            {selectedClient && (
                <div className="bg-fuchsia-50 p-4 rounded-lg border border-fuchsia-200 flex items-start justify-between text-left mt-4">
                    <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                            <FaUser className="text-fuchsia-900" />
                            <p className="font-semibold text-fuchsia-800">{selectedClient.full_name}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                            <FaIdCard className="text-fuchsia-900" />
                            <p className="text-fuchsia-950 text-sm">
                                {selectedClient.document_type?.code || ''} {selectedClient.document_number}
                            </p>
                        </div>
                        <div className="flex items-center space-x-2">
                            <FaMobileAlt className="text-fuchsia-900" />
                            <p className="text-fuchsia-950 text-sm">{selectedClient.phone_number || 'N/A'}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                            <FaEnvelope className="text-fuchsia-900" />
                            <p className="text-fuchsia-950 text-sm">{selectedClient.email || 'N/A'}</p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={handleRemoveSelectedClient}
                        className="text-red-500 hover:text-red-700 p-2 rounded-full transition duration-300"
                        title="Eliminar Cliente Seleccionado"
                    >
                        <FaTimesCircle size={24} />
                    </button>
                </div>
            )}

            {currentError && (
                <p className="text-sm text-red-600 bg-red-50 p-3 rounded-md border border-red-300">
                    {currentError}
                </p>
            )}

            <div className="flex justify-end items-center pt-6 border-t border-gray-200">
                <button
                    type="submit"
                    className={`flex items-center text-white font-medium rounded-lg text-sm w-auto px-5 py-2.5 text-center transition duration-150 ${!selectedClient || isLoading
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-fuchsia-900 hover:bg-fuchsia-950 focus:ring-4 focus:outline-none focus:ring-fuchsia-300'
                        }`}
                    disabled={!selectedClient || isLoading}
                >
                    {isLoading ? (
                        <FaSpinner className="animate-spin me-2" />
                    ) : (
                        <>
                            Siguiente
                            <FaArrowRight className="w-3.5 h-3.5 ms-2" />
                        </>
                    )}
                </button>
            </div>
        </form>
    );
};

export default ClientSearch;