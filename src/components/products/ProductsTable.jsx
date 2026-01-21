import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import DataTable from '../common/DataTable';
import CustomModal from '../common/CustomModal';
import DeleteProduct from './DeleteProduct';
import { FaSpinner } from 'react-icons/fa';

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear()).slice(2);
  return `${day}/${month}/${year}`;
};

const ProductsTable = ({
  products,
  deleteProduct,
  loading = false,
  onProductDeleted,
}) => {
  const navigate = useNavigate();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleViewDetails = (row) => {
    navigate(`/productos/${row.id}`);
  };

  const handleDelete = (row) => {
    setSelectedProduct(row);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      if (selectedProduct) {
        await deleteProduct(selectedProduct.id);
        setIsDeleteModalOpen(false);
        setSelectedProduct(null);
        if (onProductDeleted) {
          onProductDeleted();
        }
      }
    } catch (error) {
      console.error('Error al eliminar el producto:', error);
    }
  };

  const processedProducts = useMemo(() => {
    return products.map(product => {
      let finalImageUrl = null;

      if (product.image_file && product.image_file.startsWith('http')) {
        finalImageUrl = product.image_file;
      }

      return {
        ...product,
        retailerName: product.retailer?.comercial_name || 'N/A',
        categoryName: product.category?.name || 'N/A',
        brandName: product.brand?.name || 'N/A',
        statusName: product.status?.name || 'N/A',
        imageUrl: finalImageUrl,
        registration_date: formatDate(product.created_at),
      };
    });
  }, [products]);

  const columns = [
    {
      field: 'imageUrl',
      headerName: 'Imagen',
      flex: 0.5,
      minWidth: 70,
      sortable: false,
      renderCell: ({ row }) => (
        <div className="flex items-center justify-center w-full h-full">
          {row.imageUrl && (
            <img
              src={row.imageUrl}
              alt={row.name}
              className="max-h-full max-w-full object-cover rounded-md"
              onError={(e) => { e.target.style.visibility = 'hidden'; }}
            />
          )}
        </div>
      ),
    },
    { field: 'sku', headerName: 'SKU', flex: 1, minWidth: 100 },
    { field: 'name', headerName: 'Nombre', flex: 2, minWidth: 200 },
    { field: 'categoryName', headerName: 'Categoría', flex: 1.5, minWidth: 150 },
    { field: 'brandName', headerName: 'Marca', flex: 1.5, minWidth: 150 },
    { field: 'base_price', headerName: 'Precio', flex: 1, minWidth: 120 },
    { field: 'statusName', headerName: 'Estado', flex: 1, minWidth: 100 },
    { field: 'registration_date', headerName: 'Registro', flex: 1, minWidth: 100 },
  ];

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center min-h-screen">
          <FaSpinner className="animate-spin text-fuchsia-900 text-4xl" />
        </div>
      ) : (
        <DataTable
          rows={processedProducts}
          columns={columns}
          onViewDetails={handleViewDetails}
        />
      )}

      <CustomModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirmar Eliminación"
      >
        {selectedProduct && (
          <DeleteProduct
            product={selectedProduct}
            onConfirm={confirmDelete}
            onCancel={() => setIsDeleteModalOpen(false)}
          />
        )}
      </CustomModal>
    </>
  );
};

export default ProductsTable;