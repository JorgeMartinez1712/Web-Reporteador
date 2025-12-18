import { useState } from 'react';
import CustomModal from '../common/CustomModal';
import BrandsForm from './BrandsForm';

const BrandsModal = ({
  onBrandCreated,
  registerBrand,
  loading,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleModal = () => {
    setIsOpen((prev) => !prev);
  };

  const handleSubmit = async (formData) => {
    try {
      await registerBrand(formData);
      if (onBrandCreated) onBrandCreated();
      toggleModal();
    } catch (error) {
      console.error('Error al registrar la marca:', error);
    }
  };

  return (
    <>
      <button
        onClick={toggleModal}
        className="bg-emerald-600 text-white py-2 px-4 rounded-lg hover:bg-emerald-700 cursor-pointer"
      >
        Registrar
      </button>
      <CustomModal isOpen={isOpen} onClose={toggleModal} title="Registrar Marca">
        <BrandsForm
          onSubmit={handleSubmit}
          loading={loading}
          onCancel={toggleModal}
        />
      </CustomModal>
    </>
  );
};

export default BrandsModal;