import BrandsForm from './BrandsForm';

const EditBrand = ({
  brand,
  onSave,
  onCancel,
  loading = false,
  onEditSuccess,
}) => {
  const handleSubmit = async (formData) => {
    try {
      await onSave(brand.id, formData);
      if (onEditSuccess) {
        onEditSuccess();
      }
    } catch (error) {
      console.error('Error al guardar los cambios de la marca:', error);
    }
  };

  return (
    <BrandsForm
      initialData={brand}
      onSubmit={handleSubmit}
      onCancel={onCancel}
      loading={loading}
    />
  );
};

export default EditBrand;