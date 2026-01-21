import { useState } from 'react';
import ProductsModal from '../../components/products/ProductsModal';
import ProductsTable from '../../components/products/ProductsTable';
import { FaSpinner } from 'react-icons/fa';
import useProducts from '../../hooks/useProducts';
import SuccessNotification from '../../components/common/SuccessNotification';
import ProductsImportModal from '../../components/products/ProductsImportModal';

const ProductPage = () => {
  const {
    products,
    categories,
    brands,
    loading,
    fetchProducts,
    registerProduct,
    updateProduct,
    deleteProduct,
    importProducts,
  } = useProducts({
    autoFetchProducts: true,
    autoFetchCategories: true,
    autoFetchBrands: true,
    autoFetchStatuses: false,
  });

  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');

  const handleShowSuccess = (message) => {
    setNotificationMessage(message);
    setShowSuccessNotification(true);
    setTimeout(() => {
      setShowSuccessNotification(false);
      setNotificationMessage('');
    }, 3000);
  };

  const handleProductEdited = () => {
    fetchProducts();
    handleShowSuccess('¡Producto editado exitosamente!');
  };

  const handleProductCreated = () => {
    fetchProducts();
    handleShowSuccess('¡Producto registrado exitosamente!');
  };

  const handleProductDeleted = () => {
    fetchProducts();
    handleShowSuccess('¡Producto eliminado exitosamente!');
  };

  const handleProductsImported = () => {
    fetchProducts();
    handleShowSuccess('¡Importación de productos finalizada!');
  };

  return (
    <div className="min-h-screen p-8 relative">
      <SuccessNotification
        isOpen={showSuccessNotification}
        message={notificationMessage}
      />

      <div className="w-full flex justify-between items-center mb-8">
        <h2 className="text-xl font-extrabold text-fuchsia-950 tracking-tight">
          Gestión de Productos
        </h2>
        <div className="flex space-x-2">
          <ProductsImportModal
            importProducts={importProducts}
            onProductsImported={handleProductsImported}
            loading={loading}
          />
          <ProductsModal
            categories={categories}
            brands={brands}
            onProductCreated={handleProductCreated}
            registerProduct={registerProduct}
            loading={loading}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center min-h-screen">
          <FaSpinner className="animate-spin text-fuchsia-900 text-4xl" />
        </div>
      ) : (
        <ProductsTable
          products={products}
          updateProduct={updateProduct}
          deleteProduct={deleteProduct}
          loading={loading}
          onProductDeleted={handleProductDeleted}
        />
      )}
    </div>
  );
};

export default ProductPage;