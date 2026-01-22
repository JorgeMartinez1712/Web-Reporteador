import PromotionsForm from './PromotionsForm';
import { FaSpinner } from 'react-icons/fa';
import usePromotions from '../../hooks/usePromotions';

const EditPromotion = ({
    promotion,
    onSave,
    onCancel,
    loading = false,
    onEditSuccess,
}) => {
    const { loading: isPromotionsDataLoading, promotionStatuses, categories, brands, products, financiers, financingPlans, retails, retailUnits } = usePromotions();

    const handleSubmit = async (formData) => {
        try {
            await onSave(promotion.id, formData);
            if (onEditSuccess) {
                onEditSuccess();
            }
        } catch (error) {
            console.error('Error al guardar los cambios de la promoción:', error);
        }
    };

    const isFormReady = !isPromotionsDataLoading && promotion;

    return (
        <>
            {isFormReady ? (
                <PromotionsForm
                    initialData={promotion}
                    onSubmit={handleSubmit}
                    onCancel={onCancel}
                    loading={loading}
                    promotionStatuses={promotionStatuses}
                    categories={categories}
                    brands={brands}
                    products={products}
                    financiers={financiers}
                    financingPlans={financingPlans}
                    retails={retails}
                    retailUnits={retailUnits}
                />
            ) : (
                <div className="flex justify-center items-center h-48">
                    <FaSpinner className="animate-spin text-claro text-3xl" />
                </div>
            )}
        </>
    );
};

export default EditPromotion;