import { useState } from 'react';
import CustomModal from '../common/CustomModal';
import RegisterUserForm from './RegisterUserForm';
import SuccessNotification from '../common/SuccessNotification';

const RegisterUserModal = ({ onUserRegistered }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const toggleModal = () => {
    setIsOpen((prev) => !prev);
  };

  const handleUserCreated = () => {
    toggleModal();
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
    if (onUserRegistered) {
      onUserRegistered();
    }
  };

  return (
    <>
      <button
        onClick={toggleModal}
        className="bg-oscuro text-white py-2 px-4 rounded-lg hover:bg-hover cursor-pointer"
      >
        Registrar
      </button>
      <CustomModal isOpen={isOpen} onClose={toggleModal} title="Registrar Usuario">
        <RegisterUserForm
          onUserCreated={handleUserCreated}
          onCancel={toggleModal}
        />
      </CustomModal>
      <SuccessNotification
        isOpen={showSuccess}
        message="¡Usuario creado exitosamente!"
      />
    </>
  );
};

export default RegisterUserModal;