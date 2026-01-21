import { useState, useEffect, useCallback } from 'react';
import { FaSpinner, FaTimesCircle, FaUser, FaIdCard, FaMobileAlt, FaEnvelope } from 'react-icons/fa';
import useSales from '../../hooks/useSales';
import useCustomers from '../../hooks/useCustomers';
import CustomModal from '../common/CustomModal';
import RegisterCustomerSale from './RegisterCustomerSale';

const Step1ClientData = ({ onNext, initialData, currentUser, onShowSuccess, onError }) => {
  const { fetchCustomers, customers: allCustomers, loading: customersLoading } = useCustomers();
  const { createInitialSale } = useSales({ autoFetchSales: false });

  const [selectedClient, setSelectedClient] = useState(initialData?.client || null);
  const [searchQuery, setSearchQuery] = useState(initialData?.client?.full_name || '');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUserValid, setIsUserValid] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (currentUser?.seller?.id) {
      setIsUserValid(true);
    } else {
      setIsUserValid(false);
      onError('El usuario no es válido para registrar una venta.');
    }
  }, [currentUser, onError]);

  useEffect(() => {
    if (!selectedClient && searchQuery.length > 2) {
      setIsSearching(true);
      const delayDebounceFn = setTimeout(() => {
        const lowerCaseQuery = searchQuery.toLowerCase();
        const filtered = allCustomers.filter(
          (client) =>
            client.full_name.toLowerCase().includes(lowerCaseQuery) ||
            client.document_number.toLowerCase().includes(lowerCaseQuery) ||
            client.phone_number.toLowerCase().includes(lowerCaseQuery)
        );
        const sortedFiltered = [...filtered].sort((a, b) => {
          const aFullName = a.full_name.toLowerCase();
          const bFullName = b.full_name.toLowerCase();
          const aDocNumber = a.document_number.toLowerCase();
          const bDocNumber = b.document_number.toLowerCase();
          const aPhone = a.phone_number.toLowerCase();
          const bPhone = b.phone_number.toLowerCase();

          if (aFullName < bFullName) return -1;
          if (aFullName > bFullName) return 1;
          if (aDocNumber < bDocNumber) return -1;
          if (aDocNumber > bDocNumber) return 1;
          if (aPhone < bPhone) return -1;
          if (aPhone > bPhone) return 1;
          return 0;
        });
        setSearchResults(sortedFiltered);
        setIsSearching(false);
      }, 500);
      return () => clearTimeout(delayDebounceFn);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, allCustomers, selectedClient]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const handleSelectClient = useCallback((client) => {
    setSelectedClient(client);
    setSearchQuery(client.full_name);
    setSearchResults([]);
  }, []);

  const handleRemoveSelectedClient = useCallback(() => {
    setSelectedClient(null);
    setSearchQuery('');
    setSearchResults([]);
  }, []);

  const handleNext = useCallback(async () => {
    if (!selectedClient) {
      onError('Por favor, selecciona un cliente.');
      return;
    }

    if (!isUserValid) {
      onError('El usuario no es válido para registrar ventas.');
      return;
    }

    setIsSubmitting(true);
    try {
      const salePayload = {
        customer_id: selectedClient.id,
        seller_id: currentUser?.seller?.id,
      };
      const newSale = await createInitialSale(salePayload);
      onNext(newSale.customer, newSale);
    } catch (err) {
      onError(err.message || 'Error al crear la venta inicial.');
    } finally {
      setIsSubmitting(false);
    }
  }, [selectedClient, isUserValid, currentUser, createInitialSale, onNext, onError]);

  const handleNewCustomerCreated = useCallback((newCustomer) => {
    setIsModalOpen(false);
    onShowSuccess('Cliente registrado con éxito.');
    fetchCustomers().then(() => {
      setSelectedClient(newCustomer);
      setSearchQuery(newCustomer.full_name);
    });
  }, [fetchCustomers, onShowSuccess]);

  return (
    <div className="bg-white p-8 rounded-lg max-w-full space-y-6">
      <h3 className="text-2xl font-semibold text-gray-800 border-b pb-4 mb-4 border-gray-200 text-left">
        Seleccionar cliente
      </h3>
      <div className={`${!isUserValid ? 'opacity-50 pointer-events-none' : ''}`}>
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
              disabled={!!selectedClient}
            />
          </div>
          {searchQuery.length > 2 && !selectedClient && (
            <>
              {isSearching || customersLoading ? (
                <div className="text-gray-600 mt-2 flex items-center">
                  <FaSpinner className="animate-spin inline-block mr-2" />
                  Buscando...
                </div>
              ) : allCustomers.length > 0 ? (
                <ul className="mt-2 border border-gray-200 rounded-lg shadow-sm max-h-40 overflow-y-auto">
                  {allCustomers
                    .filter(client =>
                      client.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      client.document_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      client.phone_number.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map((client) => (
                      <li
                        key={client.id}
                        className="p-3 hover:bg-fuchsia-50 cursor-pointer border-b border-gray-200 last:border-b-0 text-gray-800 text-left"
                        onClick={() => handleSelectClient(client)}
                      >
                        <span className="font-semibold">{client.full_name}</span>
                        <span className="text-gray-600 text-sm ml-2">
                          ({client.documentType?.code || ''}
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
                  {selectedClient.document_type?.code || selectedClient.documentType?.code || ''} {selectedClient.document_number}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <FaMobileAlt className="text-fuchsia-900" />
                <p className="text-fuchsia-950 text-sm">{selectedClient.phone_number}</p>
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
      </div>
      <div className="flex justify-between items-center mt-6 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="bg-fuchsia-900 text-white px-6 py-2 rounded-lg hover:bg-fuchsia-950 transition duration-300 font-medium disabled:bg-gray-400"
          disabled={!isUserValid}
        >
          Registrar cliente
        </button>
        <button
          type="button"
          onClick={handleNext}
          className="bg-fuchsia-900 text-white px-6 py-2 rounded-lg hover:bg-fuchsia-950 transition duration-300 font-medium disabled:bg-gray-400"
          disabled={!selectedClient || isSubmitting || !isUserValid}
        >
          {isSubmitting ? <FaSpinner className="animate-spin" /> : 'Siguiente'}
        </button>
      </div>
      <CustomModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Registrar Nuevo Cliente"
      >
        <RegisterCustomerSale
          onCustomerCreated={handleNewCustomerCreated}
          onCancel={() => setIsModalOpen(false)}
          onShowSuccess={onShowSuccess}
          onError={onError}
        />
      </CustomModal>
    </div>
  );
};

export default Step1ClientData;