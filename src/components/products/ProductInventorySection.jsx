import { useState } from 'react';
import { FaSpinner } from 'react-icons/fa';
import useInventory from '../../hooks/useInventory';
import SuccessNotification from '../common/SuccessNotification';
import ErrorNotification from '../common/ErrorNotification';
import InventoryModal from './InventoryModal';
import InventoryTable from './InventoryTable';

const ProductInventorySection = ({ devices, onInventoryUpdated, productId }) => {
  const {
    retailUnits,
    productInventoryStatuses,
    loading: inventoryLoading,
    registerInventory,
    updateInventory,
    deleteInventory,
  } = useInventory({
    autoFetchInitialData: true,
    autoFetchRetailUnits: true,
    autoFetchProducts: false,
    autoFetchInventoryStatuses: true,
  });

  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showErrorNotification, setShowErrorNotification] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleShowSuccess = (message) => {
    setSuccessMessage(message);
    setShowSuccessNotification(true);
    setTimeout(() => {
      setShowSuccessNotification(false);
      setSuccessMessage('');
    }, 3000);
  };

  const handleShowError = (message) => {
    setErrorMessage(message);
    setShowErrorNotification(true);
    setTimeout(() => {
      setShowErrorNotification(false);
      setErrorMessage('');
    }, 3000);
  };

  const handleInventoryOperationSuccess = (message) => {
    handleShowSuccess(message);
    onInventoryUpdated();
  };

  const handleInventoryOperationError = (error) => {
    console.error('Error en operación de inventario:', error);

    const apiErrors = error.response?.data?.errors;
    let message = 'Error en la operación de inventario.';

    if (apiErrors) {
      const errorKeys = Object.keys(apiErrors);
      if (errorKeys.length > 0) {
        message = apiErrors[errorKeys[0]][0];
      }
    } else {
      message = error.response?.data?.message || message;
    }

    handleShowError(message);
  };

  return (
    <div>
      <SuccessNotification isOpen={showSuccessNotification} message={successMessage} />
      <ErrorNotification isOpen={showErrorNotification} message={errorMessage} />

      <div className="w-full flex justify-between items-center mb-6">
        <h3 className="text-lg font-extrabold text-emerald-700">Dispositivos del producto</h3>
        <InventoryModal
          productId={productId}
          retailUnits={retailUnits}
          productInventoryStatuses={productInventoryStatuses}
          onInventoryCreated={() => handleInventoryOperationSuccess('¡Dispositivo registrado exitosamente!')}
          registerInventory={registerInventory}
          loading={inventoryLoading}
          onOperationError={handleInventoryOperationError}
        />
      </div>

      {inventoryLoading ? (
        <div className="flex justify-center items-center h-48">
          <FaSpinner className="animate-spin text-emerald-600 text-3xl" />
        </div>
      ) : (
        <InventoryTable
          inventories={devices}
          retailUnits={retailUnits}
          productInventoryStatuses={productInventoryStatuses}
          updateInventory={updateInventory}
          deleteInventory={deleteInventory}
          loading={inventoryLoading}
          onInventoryEdited={() => handleInventoryOperationSuccess('¡Dispositivo editado exitosamente!')}
          onInventoryDeleted={() => handleInventoryOperationSuccess('¡Dispositivo eliminado exitosamente!')}
          onOperationError={handleInventoryOperationError}
        />
      )}
    </div>
  );
};

export default ProductInventorySection;