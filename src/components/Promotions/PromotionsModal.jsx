import { useState } from 'react';
import CustomModal from '../common/CustomModal';
import PromotionsForm from './PromotionsForm';
import { FaSpinner } from 'react-icons/fa';
import usePromotions from '../../hooks/usePromotions';

const PromotionsModal = ({
  onPromotionCreated,
  loading,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    loading: isPromotionsDataLoading,
    promotionStatuses,
    categories,
    brands,
    products,
    financiers,
    financingPlans,
    retails,
    retailUnits,
    registerPromotion,
  } = usePromotions();

  const toggleModal = () => {
    setIsOpen((prev) => !prev);
  };

  const handleSubmit = async (formData) => {
    try {
      const payload = {
        ...formData,
        min_amount: formData.conditions.global.min_amount ? parseFloat(formData.conditions.global.min_amount) : null,
      };

      await registerPromotion(payload);
      if (onPromotionCreated) onPromotionCreated();
      toggleModal();
    } catch (error) {
      console.error('Error al registrar la promoción:', error);
    }
  };

  return (
    <>
      <button
        onClick={toggleModal}
        className="bg-fuchsia-900 text-white py-2 px-4 rounded-lg hover:bg-fuchsia-950 cursor-pointer"
      >
        Registrar
      </button>
      <CustomModal isOpen={isOpen} onClose={toggleModal} title="Registrar Promoción" customClasses="max-w-4xl">
        {isPromotionsDataLoading ? (
          <div className="flex justify-center items-center h-48">
            <FaSpinner className="animate-spin text-fuchsia-500 text-3xl" />
          </div>
        ) : (
          <PromotionsForm
            onSubmit={handleSubmit}
            loading={loading}
            isCreating={true}
            promotionStatuses={promotionStatuses}
            categories={categories}
            brands={brands}
            products={products}
            financiers={financiers}
            financingPlans={financingPlans}
            retails={retails}
            retailUnits={retailUnits}
            onCancel={toggleModal}
          />
        )}
      </CustomModal>
    </>
  );
};

export default PromotionsModal;