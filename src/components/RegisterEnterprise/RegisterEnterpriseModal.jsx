import { useEffect, useState } from 'react';
import CustomModal from '../common/CustomModal';
import RegisterEnterpriseForm from './RegisterEnterpriseForm';
import ErrorNotification from '../common/ErrorNotification';
import useRegisterEnterprise from '../../hooks/useRegisterEnterprise';

const RegisterEnterpriseModal = ({
  docTypes = [],
  currencies = [],
  registerEnterprise,
  onRegisterSuccess,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showErrorNotification, setShowErrorNotification] = useState(false);

  const {
    docTypes: hookDocTypes,
    currencies: hookCurrencies,
    fetchDocTypes,
    fetchCurrencies,
  } = useRegisterEnterprise({
    autoFetchEnterprises: false,
    autoFetchFinanciers: false,
    autoFetchRetailStatuses: false,
    autoFetchUnitStatuses: false,
    autoFetchDocTypes: false,
    autoFetchCurrencies: false,
  });

  const toggleModal = async () => {
    const nextOpen = !isOpen;
    setIsOpen(nextOpen);
    setError('');
    setShowErrorNotification(false);
    if (nextOpen) {
      try {
        await Promise.all([fetchDocTypes(), fetchCurrencies()]);
      } catch (_) {}
    }
  };

  const handleShowError = (message) => {
    setError(message);
    setShowErrorNotification(true);
  };

  const handleSubmit = async (formData) => {
    setLoading(true);
    setError('');
    setShowErrorNotification(false);
    try {
      const response = await registerEnterprise(formData);
      toggleModal();
      if (onRegisterSuccess) {
        onRegisterSuccess();
      }
    } catch (err) {
      const errorMessage = err.message || 'Error al registrar la empresa';
      handleShowError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={toggleModal}
        className="bg-fuchsia-900 text-white py-2 px-4 rounded-lg hover:bg-fuchsia-950 cursor-pointer"
        disabled={loading}
      >
        Registrar
      </button>
      <CustomModal isOpen={isOpen} onClose={toggleModal} title="Registrar Empresa">
        <RegisterEnterpriseForm
          docTypes={docTypes.length ? docTypes : hookDocTypes}
          currencies={currencies.length ? currencies : hookCurrencies}
          onSubmit={handleSubmit}
          onCancel={toggleModal}
          loading={loading}
        />
      </CustomModal>
  <ErrorNotification isOpen={showErrorNotification} message={error} onClose={() => setShowErrorNotification(false)} />
    </>
  );
};

export default RegisterEnterpriseModal;