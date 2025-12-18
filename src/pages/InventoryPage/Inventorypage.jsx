import { useState } from 'react';
import { FaSpinner } from 'react-icons/fa';
import SuccessNotification from '../../components/common/SuccessNotification';
import InventoryImportModal from '../../components/inventory/InventoryImportModal';
import useInventory from '../../hooks/useInventory';
import InventoryTable from '../../components/inventory/InventoryTable';

const Inventorypage = () => {
  const { productInventories, loading, fetchProductInventories, importInventory } = useInventory({
    autoFetchInitialData: true,
    autoFetchProducts: false,
    autoFetchRetailUnits: false,
    autoFetchInventoryStatuses: false,
    autoFetchAllInventories: true
  });

  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');

  const handleShowSuccess = message => {
    setNotificationMessage(message);
    setShowSuccessNotification(true);
    setTimeout(() => {
      setShowSuccessNotification(false);
      setNotificationMessage('');
    }, 3000);
  };

  const handleInventoriesImported = () => {
    fetchProductInventories();
    handleShowSuccess('¡Importación de inventario finalizada!');
  };

  return (
    <div className="min-h-screen p-8 relative">
      <SuccessNotification isOpen={showSuccessNotification} message={notificationMessage} />
      <div className="w-full flex justify-between items-center mb-8">
        <h2 className="text-xl font-extrabold text-emerald-700 tracking-tight">Inventario de Productos</h2>
        <div className="flex space-x-2">
          <InventoryImportModal importProducts={importInventory} onProductsImported={handleInventoriesImported} loading={loading} excelFieldName="file" />
        </div>
      </div>
      {loading ? (
        <div className="flex justify-center items-center min-h-screen">
          <FaSpinner className="animate-spin text-emerald-600 text-4xl" />
        </div>
      ) : (
        <InventoryTable inventories={productInventories} />
      )}
    </div>
  );
};

export default Inventorypage;