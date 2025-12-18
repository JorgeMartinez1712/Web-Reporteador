import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CreatePlanForm from '../../components/Plans/CreatePlanForm';
import ErrorNotification from '../../components/common/ErrorNotification';
import SuccessNotification from '../../components/common/SuccessNotification';
import PlanDetail from '../../components/Plans/PlanDetail.jsx';

const CreatePlanPage = () => {
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const handlePlanCreated = () => {
    setSuccessMessage('Plan registrado exitosamente.');
    setTimeout(() => {
      navigate('/planes');
    }, 2000);
  };

  return (
    <div className="p-8">
      <PlanDetail
        title="Registrar Nuevo Plan de Financiamiento"
        showSaveButton={false}
      />

      <ErrorNotification isOpen={!!errorMessage} message={errorMessage} />
      <SuccessNotification isOpen={!!successMessage} message={successMessage} />

      <CreatePlanForm
        onPlanCreated={handlePlanCreated}
        setGlobalSuccessMessage={setSuccessMessage}
        setGlobalErrorMessage={setErrorMessage}
      />
    </div>
  );
};

export default CreatePlanPage;