import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DataTable from '../common/DataTable';
import CustomModal from '../common/CustomModal';
import DeleteSale from './DeleteSale';
import useSales from '../../hooks/useSales';
import { FaSpinner } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

const SalesTable = () => {
  const navigate = useNavigate();
  const { sales, loading, fetchSales, deleteSale } = useSales();
  const { user: currentUser } = useAuth();
  const [selectedSale, setSelectedSale] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isUserValid, setIsUserValid] = useState(false);

  useEffect(() => {
    if (currentUser?.seller?.id) {
      setIsUserValid(true);
    } else {
      setIsUserValid(false);
    }
  }, [currentUser]);

  const processedSales = sales.map(sale => ({
    ...sale,
    customerName: sale.customer?.full_name || 'N/A',
    retailUnitName: sale.retail_unit?.name || 'N/A',
    saleStatusName: sale.sale_status?.name || 'N/A',
    saleDateFormatted: sale.sale_date ? new Date(sale.sale_date).toLocaleDateString() : 'N/A',
  }));

  const handleViewDetails = (row) => {
    navigate(`/ventas/${row.id}`);
  };

  const handleEdit = async (row) => {
   
    navigate(`/ventas/completar/${row.id}`);
  };

  const handleDelete = (row) => {
    setSelectedSale(row);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteSale(selectedSale.id);
      fetchSales();
      setIsDeleteModalOpen(false);
    } catch (err) {
      console.error('Error al eliminar la venta:', err);
    }
  };

  const columns = [
    {
      field: 'sale_code',
      headerName: 'Código',
      flex: 1.5,
      minWidth: 200,
    },
    {
      field: 'customerName',
      headerName: 'Cliente',
      flex: 1.5,
      minWidth: 200,
    },
    {
      field: 'retailUnitName',
      headerName: 'Sucursal',
      flex: 1.5,
      minWidth: 200,
    },
    {
      field: 'saleStatusName',
      headerName: 'Estado',
      flex: 1,
      minWidth: 120,
    },
    {
      field: 'saleDateFormatted',
      headerName: 'fecha',
      flex: 1,
      minWidth: 150,
    },
  ];

  const viewDetailsCondition = (row) => {
    return ['RECHAZADA', 'COMPLETADA'].includes(row.saleStatusName);
  };

  const editCondition = (row) => {
    return isUserValid && !['RECHAZADA', 'COMPLETADA'].includes(row.saleStatusName);
  };

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center min-h-screen">
          <FaSpinner className="animate-spin text-fuchsia-900 text-4xl" />
        </div>
      ) : (
        <DataTable
          rows={processedSales}
          columns={columns}
          onViewDetails={handleViewDetails}
          viewDetailsCondition={viewDetailsCondition}
          onEdit={handleEdit}
          editCondition={editCondition}
        // onDelete={handleDelete}
        />
      )}

      <CustomModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirmar Eliminación"
      >
        {selectedSale && (
          <DeleteSale
            sale={selectedSale}
            onConfirm={confirmDelete}
            onCancel={() => setIsDeleteModalOpen(false)}
          />
        )}
      </CustomModal>
    </>
  );
};

export default SalesTable;