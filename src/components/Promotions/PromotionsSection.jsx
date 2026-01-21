import { useState, useEffect } from 'react';
import { FaSpinner } from 'react-icons/fa';
import usePromotions from '../../hooks/usePromotions';
import SuccessNotification from '../common/SuccessNotification';
import ErrorNotification from '../common/ErrorNotification';
import PromotionsModal from '../Plans/PromotionsModal';
import PromotionsTable from './PromotionsTable';

const PromotionsSection = ({ planId }) => {
  const {
    promotions,
    loading: promotionsLoading,
    error: promotionsError,
    fetchPromotions,
    createPromotion,
    updatePromotion,
    deletePromotion,
  } = usePromotions();

  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showErrorNotification, setShowErrorNotification] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (planId) {
      fetchPromotions(planId);
    }
  }, [planId, fetchPromotions]);

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
  };

  const handlePromotionOperationSuccess = (message) => {
    fetchPromotions(planId);
    handleShowSuccess(message);
  };

  const handlePromotionOperationError = (error) => {
    console.error('Error en operación de promoción:', error);
    handleShowError(error.message || error.response?.data?.message || 'Error en la operación de promoción.');
  };

  return (
    <div>
  <SuccessNotification isOpen={showSuccessNotification} message={successMessage} />
  <ErrorNotification isOpen={showErrorNotification} message={errorMessage} onClose={() => setShowErrorNotification(false)} />

      <div className="w-full flex justify-between items-center mb-6">
        <h3 className="text-lg font-extrabold text-fuchsia-950">Promociones</h3>
        <PromotionsModal
          planId={planId} 
          createPromotion={createPromotion}
          loading={promotionsLoading}
          onPromotionCreated={() => handlePromotionOperationSuccess('¡Promoción creada exitosamente!')}
          onPromotionError={handlePromotionOperationError}
        />
      </div>

      {promotionsLoading ? (
        <div className="flex justify-center items-center h-48">
          <FaSpinner className="animate-spin text-fuchsia-900 text-3xl" />
        </div>
      ) : promotionsError ? (
        <ErrorNotification isOpen={true} message={promotionsError} />
      ) : (
        <PromotionsTable
          promotions={promotions}
          updatePromotion={updatePromotion}
          deletePromotion={deletePromotion}
          loading={promotionsLoading}
          onPromotionEdited={() => handlePromotionOperationSuccess('¡Promoción editada exitosamente!')}
          onPromotionDeleted={() => handlePromotionOperationSuccess('¡Promoción eliminada exitosamente!')}
          onOperationError={handlePromotionOperationError}
        />
      )}
    </div>
  );
};

export default PromotionsSection;