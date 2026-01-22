import { useState } from 'react';
import DataTable from '../common/DataTable';
import CustomModal from '../common/CustomModal';
import EditBrand from './EditBrand';
import DeleteBrand from './DeleteBrand';
import { FaSpinner } from 'react-icons/fa';
import { IMAGE_BASE_URL } from '../../api/axiosInstance';

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear()).slice(2);
  return `${day}/${month}/${year}`;
};

const BrandsTable = ({
  brands,
  updateBrand,
  deleteBrand,
  loading = false,
  onBrandEdited,
  onBrandDeleted,
}) => {
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const processedBrands = brands.map((brand) => ({
    ...brand,
    registration_date: formatDate(brand.created_at),
  }));

  const handleEdit = (row) => {
    setSelectedBrand(row);
    setIsEditModalOpen(true);
  };

  const handleDelete = (row) => {
    setSelectedBrand(row);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      if (selectedBrand) {
        await deleteBrand(selectedBrand.id);
        setIsDeleteModalOpen(false);
        setSelectedBrand(null);
        if (onBrandDeleted) {
          onBrandDeleted();
        }
      }
    } catch (error) {
      console.error('Error al eliminar la marca:', error);
    }
  };

  const handleSaveEdit = async (id, updatedData) => {
    try {
      await updateBrand(id, updatedData);
      setIsEditModalOpen(false);
      if (onBrandEdited) {
        onBrandEdited();
      }
    } catch (error) {
      console.error('Error al actualizar la marca:', error);
    }
  };

  const handleCancelEdit = () => {
    setIsEditModalOpen(false);
  };

  const columns = [
    { field: 'code', headerName: 'Código', flex: 1, minWidth: 100 },
    { field: 'name', headerName: 'Nombre', flex: 2, minWidth: 200 },
    { field: 'description', headerName: 'Descripción', flex: 3, minWidth: 300 },
    {
      field: 'logo',
      headerName: 'Logo',
      flex: 0.5,
      minWidth: 80,
      headerClassName: 'justify-start',
      renderCell: ({ row }) => {
        const logoPath = row.logo;

        const baseLogoUrl = logoPath
          ? (logoPath.startsWith('http')
            ? logoPath
            : `${IMAGE_BASE_URL}${logoPath.startsWith('/') ? logoPath.substring(1) : logoPath}`)
          : '/assets/no-image.svg';

        const finalLogoUrl = logoPath ? baseLogoUrl : '/assets/no-image.svg';

        return (
          <div className="flex items-center justify-center w-full h-full">
            <img
              src={finalLogoUrl}
              alt="Logo"
              className="h-8 w-8 max-h-full max-w-full object-contain"
              onError={(e) => { e.target.src = '/assets/no-image.svg'; }}
            />
          </div>
        );
      },
      sortable: false,
      filterable: false,
    },
    { field: 'registration_date', headerName: 'Registro', flex: 1, minWidth: 100 },
  ];

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center min-h-screen">
          <FaSpinner className="animate-spin text-oscuro text-4xl" />
        </div>
      ) : (
        <DataTable
          rows={processedBrands}
          columns={columns}
          onEdit={handleEdit}
          onDelete={null}
        />
      )}
      <CustomModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Editar Marca"
      >
        {selectedBrand && (
          <EditBrand
            brand={selectedBrand}
            onSave={handleSaveEdit}
            onCancel={handleCancelEdit}
            loading={loading}
          />
        )}
      </CustomModal>
      <CustomModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirmar Eliminación"
      >
        {selectedBrand && (
          <DeleteBrand
            brand={selectedBrand}
            onConfirm={confirmDelete}
            onCancel={() => setIsDeleteModalOpen(false)}
          />
        )}
      </CustomModal>
    </>
  );
};

export default BrandsTable;