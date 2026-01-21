import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import usePromotions from '../../hooks/usePromotions';
import { IMAGE_BASE_URL } from '../../api/axiosInstance';
import PromotionsForm from './PromotionsForm';
import PromotionHeader from './PromotionHeader';
import { FaSpinner } from 'react-icons/fa';
import SuccessNotification from '../common/SuccessNotification';
import ErrorNotification from '../common/ErrorNotification';

const PromotionDetailPage = () => {
  const { id } = useParams();
  const {
    loading,
    error,
    getPromotionById,
    updatePromotion,
    promotionStatuses,
    categories,
    brands,
    products,
    financingPlans,
    retails,
    fetchRetailUnitsByRetailId,
    retailUnitsByRetail,
    retailUnitsLoading,
    uploadPromotionImage,
  } = usePromotions();

  const [promotion, setPromotion] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageSuccessMessage, setImageSuccessMessage] = useState(null);

  useEffect(() => {
    const fetchPromotion = async () => {
      if (id) {
        const promo = await getPromotionById(id);
        if (promo) {
          const retailUnitIds = (promo.units || []).reduce((acc, unit) => {
            const hasRetailId = unit && unit.retail_id != null;
            let retailId = null;
            if (hasRetailId) {
              retailId = String(unit.retail_id);
            } else if (Array.isArray(promo.retails) && promo.retails.length === 1) {
              retailId = String(promo.retails[0].id);
            }
            if (retailId) {
              if (!acc[retailId]) acc[retailId] = [];
              acc[retailId].push(String(unit.id));
            }
            return acc;
          }, {});

          const formattedPromo = {
            ...promo,
            retail_ids: promo.retails?.map(retail => String(retail.id)) || [],
            category_ids: promo.categories?.map(category => String(category.id)) || [],
            retail_unit_ids: retailUnitIds || {},
          };
          setPromotion(formattedPromo);
        }
      }
    };
    fetchPromotion();
  }, [id, getPromotionById]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
  };

  const handleSaveClick = async (formData) => {
    setSaveLoading(true);
    setErrorMessage(null);

    try {
      await updatePromotion(id, formData);
      if (selectedImageFile) {
        setUploadingImage(true);
        try {
          await uploadPromotionImage(promotion.id, selectedImageFile);
          setImageSuccessMessage('Imagen subida correctamente.');
          setTimeout(() => setImageSuccessMessage(null), 3000);
        } catch (e) {
          setErrorMessage(e.message || 'Error al subir la imagen.');
        } finally {
          setUploadingImage(false);
        }
      }
      window.location.reload();
    } catch (err) {
      setErrorMessage(err.message || 'Error al actualizar la promoción.');
      setSaveLoading(false);
    }
  };

  const isLoading = loading || !promotion;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <FaSpinner className="animate-spin text-fuchsia-900 text-4xl" />
      </div>
    );
  }

  return (
    <div className="p-8">
      <PromotionHeader
        title={`Detalle de Promoción: ${promotion.name}`}
        isEditing={isEditing}
        onEditClick={handleEditClick}
        onSaveClick={() => document.getElementById('promotion-form').dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }))}
        onCancelClick={handleCancelClick}
        saveLoading={saveLoading}
      />
      <ErrorNotification isOpen={!!errorMessage || !!error} message={errorMessage || error} />
      <SuccessNotification isOpen={!!successMessage} message={successMessage} />
      <SuccessNotification isOpen={!!imageSuccessMessage} message={imageSuccessMessage} />
      <div className="w-full">
        <PromotionsForm
          initialData={promotion}
          onSubmit={handleSaveClick}
          onCancel={handleCancelClick}
          loading={saveLoading}
          isCreating={false}
          isEditing={isEditing}
          promotionStatuses={promotionStatuses}
          categories={categories}
          brands={brands}
          products={products}
          financingPlans={financingPlans}
          retails={retails}
          fetchRetailUnitsByRetailId={fetchRetailUnitsByRetailId}
          retailUnitsByRetail={retailUnitsByRetail}
          retailUnitsLoading={retailUnitsLoading}
          imageUploadEnabled={true}
          imageUrl={(promotion?.image_file
            ? (String(promotion.image_file).startsWith('http')
                ? promotion.image_file
                : `${IMAGE_BASE_URL?.replace(/\/?$/,'/')}${String(promotion.image_file).replace(/^\//,'')}`)
            : null)}
          onImageSelect={(file) => setSelectedImageFile(file)}
        />
      </div>
    </div>
  );
};

export default PromotionDetailPage;