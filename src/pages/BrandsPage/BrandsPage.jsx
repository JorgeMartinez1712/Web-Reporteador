import { useState } from 'react';
import BrandsModal from '../../components/brands/BrandsModal';
import BrandsTable from '../../components/brands/BrandsTable';
import { FaSpinner } from 'react-icons/fa';
import useBrands from '../../hooks/useBrands';
import SuccessNotification from '../../components/common/SuccessNotification';

const BrandsPage = () => {
  const {
    brands,
    loading,
    fetchBrands,
    registerBrand,
    updateBrand,
    deleteBrand,
  } = useBrands();

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

  const handleBrandEdited = () => {
    fetchBrands();
    handleShowSuccess('¡Marca editada exitosamente!');
  };

  const handleBrandCreated = () => {
    fetchBrands();
    handleShowSuccess('¡Marca registrada exitosamente!');
  };

  const handleBrandDeleted = () => {
    fetchBrands();
    handleShowSuccess('¡Marca eliminada exitosamente!');
  };

  return (
    <div className="min-h-screen p-8 relative">
      <SuccessNotification
        isOpen={showSuccessNotification}
        message={notificationMessage}
      />

      <div className="w-full flex justify-between items-center mb-8">
        <h1 className="text-xl font-extrabold text-fuchsia-950 tracking-tight">
          Marcas
        </h1>
        <BrandsModal
          onBrandCreated={handleBrandCreated}
          registerBrand={registerBrand}
          loading={loading}
        />
      </div>

      {loading ? (
        <div className="flex justify-center items-center min-h-screen">
          <FaSpinner className="animate-spin text-fuchsia-900 text-4xl" />
        </div>
      ) : (
        <BrandsTable
          brands={brands}
          updateBrand={updateBrand}
          deleteBrand={deleteBrand}
          loading={loading}
          onBrandEdited={handleBrandEdited}
          onBrandDeleted={handleBrandDeleted}
        />
      )}
    </div>
  );
};

export default BrandsPage;