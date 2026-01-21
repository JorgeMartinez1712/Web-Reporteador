import { useState } from 'react';
import CustomModal from '../common/CustomModal';
import InventoryForm from '../products/InventoryForm';

const InventoryModal = ({
  productId,
  retailUnits = [], 
  productInventoryStatuses = [], 
  onInventoryCreated,
  registerInventory,
  loading, 
  onOperationError,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleModal = () => {
    setIsOpen((prev) => !prev);
  };

  const handleSubmit = async (formData) => {
    try {
      const dataWithProductId = { ...formData, product_id: parseInt(productId) };
      await registerInventory(dataWithProductId);
      if (onInventoryCreated) onInventoryCreated();
      toggleModal(); 
    } catch (error) {
      if (onOperationError) onOperationError(error);
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
      <CustomModal isOpen={isOpen} onClose={toggleModal} title="Registrar dispositivo">
        <InventoryForm
          productId={productId}
          retailUnits={retailUnits}
          productInventoryStatuses={productInventoryStatuses}
          onSubmit={handleSubmit}
          loading={loading}
          onCancel={toggleModal}
        />
      </CustomModal>
    </>
  );
};

export default InventoryModal;