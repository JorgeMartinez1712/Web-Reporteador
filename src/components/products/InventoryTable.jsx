import { useState, useMemo } from 'react';
import DataTable from '../common/DataTable';
import CustomModal from '../common/CustomModal';
import EditInventory from './EditInventory';
import DeleteInventory from './DeleteInventory';
import { FaSpinner } from 'react-icons/fa';

const InventoryTable = ({
  inventories,
  retailUnits = [],
  productInventoryStatuses = [],
  updateInventory,
  deleteInventory,
  loading = false,
  onInventoryEdited,
  onInventoryDeleted,
}) => {
  const [selectedInventory, setSelectedInventory] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleEdit = (row) => {
    setSelectedInventory(row);
    setIsEditModalOpen(true);
  };

  const handleDelete = (row) => {
    setSelectedInventory(row);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      if (selectedInventory) {
        await deleteInventory(selectedInventory.id, selectedInventory.product_id);
        setIsDeleteModalOpen(false);
        setSelectedInventory(null);
        if (onInventoryDeleted) {
          onInventoryDeleted();
        }
      }
    } catch (error) {
      console.error('Error al eliminar el dispositivo:', error);
    }
  };

  const handleSaveEdit = async (updatedData) => {
    try {
      await updateInventory(updatedData);
      setIsEditModalOpen(false);
      if (onInventoryEdited) {
        onInventoryEdited();
      }
    } catch (error) {
      console.error('Error al actualizar el dispositivo:', error);
    }
  };

  const handleCancelEdit = () => {
    setIsEditModalOpen(false);
  };

  const processedInventories = useMemo(() => {
    if (!Array.isArray(inventories)) {
      return [];
    }

    return inventories.map(inventory => ({
      ...inventory,
      retailUnitName: inventory.name || 'N/A',
      productName: inventory.productname || 'N/A',
      statusName: inventory.code || 'N/A',
    }));
  }, [inventories]);

  const columns = [
    { field: 'serial_number', headerName: 'Serie', flex: 1.5, minWidth: 150 },
    { field: 'imei', headerName: 'IMEI', flex: 1.5, minWidth: 150 },
    { field: 'name', headerName: 'Sucursal', flex: 1.5, minWidth: 150 },
    { field: 'statusName', headerName: 'Estado', flex: 1.5, minWidth: 150 },
  ];

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center min-h-screen">
          <FaSpinner className="animate-spin text-fuchsia-900 text-4xl" />
        </div>
      ) : (
        <DataTable
          rows={processedInventories}
          columns={columns}
          onEdit={handleEdit}
          // onDelete={handleDelete}
        />
      )}

      <CustomModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Editar Dispositivo"
      >
        {selectedInventory && (
          <EditInventory
            inventory={selectedInventory}
            retailUnits={retailUnits}
            productInventoryStatuses={productInventoryStatuses}
            onSave={handleSaveEdit}
            onCancel={handleCancelEdit}
            loading={loading}
            onEditSuccess={onInventoryEdited}
          />
        )}
      </CustomModal>

      <CustomModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirmar Eliminación"
      >
        {selectedInventory && (
          <DeleteInventory
            inventory={selectedInventory}
            onConfirm={confirmDelete}
            onCancel={() => setIsDeleteModalOpen(false)}
          />
        )}
      </CustomModal>
    </>
  );
};

export default InventoryTable;