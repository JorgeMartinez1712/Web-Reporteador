import { useState } from 'react';
import RegisterEnterpriseModal from '../../components/RegisterEnterprise/RegisterEnterpriseModal';
import EnterpriseTable from '../../components/RegisterEnterprise/EnterpriseTable';
import { FaSpinner } from 'react-icons/fa';
import useRegisterEnterprise from '../../hooks/useRegisterEnterprise';
import SuccessNotification from '../../components/common/SuccessNotification';

const RegisterEnterprisePage = () => {
  const {
    enterprises,
    loading,
    fetchEnterprises,
    financiers,
    docTypes,
    currencies,
    updateEnterprise,
    registerEnterprise,
    deleteEnterprise,
  } = useRegisterEnterprise({
    autoFetchEnterprises: true,
    autoFetchFinanciers: false,
    autoFetchRetailStatuses: false,
    autoFetchUnitStatuses: false,
    autoFetchDocTypes: false,
    autoFetchCurrencies: false,
  });

  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');

  const handleShowSuccess = (message) => {
    setNotificationMessage(message);
    setShowSuccessNotification(true);
    setTimeout(() => {
      setShowSuccessNotification(false);
      setNotificationMessage('');
    }, 3000);
  };

  const handleEnterpriseEdited = () => {
    fetchEnterprises();
    handleShowSuccess('¡Empresa editada exitosamente!');
  };

  const handleEnterpriseRegistered = () => {
    fetchEnterprises();
    handleShowSuccess('¡Empresa registrada exitosamente!');
  };

  return (
    <div className="min-h-screen p-8 relative">
      <SuccessNotification
        isOpen={showSuccessNotification}
        message={notificationMessage}
      />

      <div className="w-full flex justify-between items-center mb-8">
        <h2 className="text-xl font-extrabold text-fuchsia-950 tracking-tight">
          Empresas
        </h2>
        <RegisterEnterpriseModal
          docTypes={docTypes}
          currencies={currencies}
          registerEnterprise={registerEnterprise}
          fetchEnterprises={fetchEnterprises}
          onRegisterSuccess={handleEnterpriseRegistered}
        />
      </div>

      {loading ? (
        <div className="flex justify-center items-center min-h-screen">
          <FaSpinner className="animate-spin text-fuchsia-900 text-4xl" />
        </div>
      ) : (
        <EnterpriseTable
          enterprises={enterprises}
          financiers={financiers}
          loading={loading}
          fetchEnterprises={fetchEnterprises}
          updateEnterprise={updateEnterprise}
          deleteEnterprise={deleteEnterprise}
          onEnterpriseEdited={handleEnterpriseEdited}
        />
      )}
    </div>
  );
};

export default RegisterEnterprisePage;