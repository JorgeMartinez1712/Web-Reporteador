import { useState } from 'react';
import DataTable from '../common/DataTable';
import CustomModal from '../common/CustomModal';
import DeleteCustomer from './DeleteCustomer';
import useCustomers from '../../hooks/useCustomers';
import { useNavigate } from 'react-router-dom';

const CustomersTable = ({ customers, onEditSuccess }) => {
  const { fetchCustomers, deleteCustomer } = useCustomers({ autoFetchLookups: false, fetchStatuses: false });

  const navigate = useNavigate();

  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleViewDetails = (row) => {
    navigate(`/clientes/${row.id}`);
  };

  const _handleDelete = (row) => {
    setSelectedCustomer(row);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteCustomer(selectedCustomer.id);
      fetchCustomers();
      setIsDeleteModalOpen(false);
      if (onEditSuccess) {
        onEditSuccess('Cliente eliminado exitosamente.');
      }
    } catch (err) {
      console.error('Error al eliminar el cliente:', err);
      alert(err.response?.data?.message || 'Error al eliminar el cliente. Intenta de nuevo.');
    }
  };

  const columns = [
    {
      field: 'document',
      headerName: 'Documento',
      flex: 1.5,
      minWidth: 180,
      valueGetter: (value, row) => `${row?.documentType?.code || ''}-${row?.document_number || ''}`,
    },
    { field: 'full_name', headerName: 'Nombre', flex: 1, minWidth: 150 },
    { field: 'email', headerName: 'Correo', flex: 1, minWidth: 150 },
    { field: 'phone_number', headerName: 'Teléfono', flex: 1, minWidth: 150 },
  ];

  return (
    <>
      <DataTable
        rows={customers}
        columns={columns}
        onViewDetails={handleViewDetails}
        // onDelete={handleDelete}
      />

      <CustomModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirmar Eliminación"
      >
        {selectedCustomer && (
          <DeleteCustomer
            customer={selectedCustomer}
            onConfirm={confirmDelete}
            onCancel={() => setIsDeleteModalOpen(false)}
          />
        )}
      </CustomModal>
    </>
  );
};

export default CustomersTable;