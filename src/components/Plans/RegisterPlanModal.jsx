import { useState } from 'react';
import CustomModal from '../common/CustomModal';
import CreatePlanForm from './CreatePlanForm';

const RegisterPlanModal = ({ onPlanRegistered, setGlobalSuccessMessage, setGlobalErrorMessage }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenModal = () => {
    setIsOpen(true);
    setGlobalSuccessMessage(null);
    setGlobalErrorMessage(null);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
  };

  const handlePlanCreated = () => {
    if (onPlanRegistered) {
      onPlanRegistered();
    }
    setIsOpen(false);
  };

  return (
    <>
      <button
        onClick={handleOpenModal}
        className="bg-oscuro text-white py-2 px-4 rounded-lg hover:bg-hover transition duration-200 ease-in-out"
      >
        Registrar
      </button>

      <CustomModal
        isOpen={isOpen}
        onClose={handleCloseModal}
        title="Registrar Nuevo Plan de Financiamiento"
      >
        <CreatePlanForm
          onPlanCreated={handlePlanCreated}
          setGlobalSuccessMessage={setGlobalSuccessMessage}
          setGlobalErrorMessage={setGlobalErrorMessage}
        />
      </CustomModal>
    </>
  );
};

export default RegisterPlanModal;