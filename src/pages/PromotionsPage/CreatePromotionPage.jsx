import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import usePromotions from '../../hooks/usePromotions';
import PromotionsForm from '../../components/Promotions/PromotionsForm';
import SuccessNotification from '../../components/common/SuccessNotification';
import ErrorNotification from '../../components/common/ErrorNotification';
import { FaSpinner } from 'react-icons/fa';

const CreatePromotionPage = () => {
  const navigate = useNavigate();
  const {
    registerPromotion,
    loading,
    error,
    categories,
    brands,
    products,
    financingPlans,
    retails,
    fetchRetailUnitsByRetailId, 
    retailUnitsByRetail, 
    retailUnitsLoading,
  } = usePromotions({ includeRelated: true, includeStatuses: false });
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, errorMessage]);

  const handleSubmit = async (formData) => {
    setSuccessMessage(null);
    setErrorMessage(null);
    try {
      await registerPromotion(formData);
      setSuccessMessage('Promoción creada exitosamente.');
      navigate('/promociones');
    } catch (err) {
      setErrorMessage(err.message || 'Error al crear la promoción.');
    }
  };

  const handleCancel = () => {
    navigate('/promociones');
  };

  if (loading && !categories.length) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <FaSpinner className="animate-spin text-emerald-600 text-4xl" />
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="w-full flex justify-between items-center mb-8">
        <h2 className="text-xl font-extrabold text-emerald-700 tracking-tight">
          Registrar Nueva Promoción
        </h2>
      </div>
      <ErrorNotification isOpen={!!errorMessage || !!error} message={errorMessage || error} />
      <SuccessNotification isOpen={!!successMessage} message={successMessage} />
      <PromotionsForm
        onSubmit={handleSubmit}
        loading={loading}
        onCancel={handleCancel}
        isCreating={true}
        categories={categories}
        brands={brands}
        products={products}
        financingPlans={financingPlans}
        retails={retails}
        fetchRetailUnitsByRetailId={fetchRetailUnitsByRetailId}
        retailUnitsByRetail={retailUnitsByRetail}
        retailUnitsLoading={retailUnitsLoading}
      />
    </div>
  );
};

export default CreatePromotionPage;