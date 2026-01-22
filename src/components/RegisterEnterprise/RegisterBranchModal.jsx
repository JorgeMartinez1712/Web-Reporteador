import { useState } from 'react';
import CustomModal from '../common/CustomModal';
import RegisterBranchForm from './RegisterBranchForm';

const RegisterBranchModal = ({
  retails = [],
  financiers = [],
  unitStatuses = [],
  registerBranch,
  loading,
  onRegisterSuccess,
  onRegisterError,
  retailId,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleModal = () => {
    setIsOpen((prev) => !prev);
  };

  const handleSubmit = async (formData) => {
    try {
      await registerBranch(formData);
      toggleModal();
      if (onRegisterSuccess) {
        onRegisterSuccess();
      }
    } catch (error) {
      if (onRegisterError) {
        onRegisterError(error);
      }
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
      <CustomModal isOpen={isOpen} onClose={toggleModal} title="Registrar Sucursal">
        <RegisterBranchForm
          retails={retails}
          financiers={financiers}
          unitStatuses={unitStatuses}
          onSubmit={handleSubmit}
          loading={loading}
          retailId={retailId}
          onCancel={() => setIsOpen(false)}
        />
      </CustomModal>
    </>
  );
};

export default RegisterBranchModal;