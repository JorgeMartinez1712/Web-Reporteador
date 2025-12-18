import { useState } from 'react'; 
import RegisterBranchModal from '../../components/RegisterEnterprise/RegisterBranchModal';
import BranchTable from '../../components/RegisterEnterprise/BranchTable';
import { FaSpinner } from 'react-icons/fa';
import useRegisterBranch from '../../hooks/useRegisterBranch';
import SuccessNotification from '../../components/common/SuccessNotification'; 

const RegisterBranchPage = () => {
  const {
    branches,
    loading,
    retails,
    financiers,
    userStatuses,
    fetchBranches,
    registerBranch,
    updateBranch,
    deleteBranch,
  } = useRegisterBranch();

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

  const handleBranchEdited = () => {
    fetchBranches(); 
    handleShowSuccess('¡Sucursal editada exitosamente!');
  };

  const handleBranchCreated = () => {
    fetchBranches(); 
    handleShowSuccess('¡Sucursal registrada exitosamente!');
  };

  return (
    <div className="min-h-screen p-8 relative">
      <SuccessNotification
        isOpen={showSuccessNotification}
        message={notificationMessage}
      />

      <div className="w-full flex justify-between items-center mb-8">
        <h2 className="text-xl font-extrabold text-emerald-700 tracking-tight">
          Registro de Sucursales
        </h2>
        <RegisterBranchModal
          retails={retails}
          financiers={financiers}
          userStatuses={userStatuses}
          onBranchCreated={handleBranchCreated} 
          registerBranch={registerBranch}
          loading={loading}
          onRegisterSuccess={handleBranchCreated} 
        />
      </div>

      {loading ? (
        <div className="flex justify-center items-center min-h-screen">
          <FaSpinner className="animate-spin text-emerald-600 text-4xl" />
        </div>
      ) : (
        <BranchTable
          branches={branches}
          retails={retails}
          financiers={financiers}
          userStatuses={userStatuses}
          updateBranch={updateBranch}
          fetchBranches={fetchBranches}
          deleteBranch={deleteBranch}
          loading={loading}
          onBranchEdited={handleBranchEdited} 
        />
      )}
    </div>
  );
};

export default RegisterBranchPage;