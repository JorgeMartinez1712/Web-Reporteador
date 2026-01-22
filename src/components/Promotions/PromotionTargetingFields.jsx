import MultiSelectChips from '../common/MultiSelectChips';
import { FaSpinner } from 'react-icons/fa';

const PromotionTargetingFields = ({
  formData,
  handleMultiSelectChipsChange,
  handleRetailUnitsChange,
  categories,
  retails,
  retailUnitsByRetail,
  retailUnitsLoading,
  disabled,
  isCreating = false,
  imageUploadEnabled = false,
  imageUrl = null,
  onImageSelect = null,
  onUploadImage = null,
  uploading = false,
  canUpload = false,
}) => {
  return (
    <>
      <MultiSelectChips
        label="Categorías"
        name="category_ids"
        options={categories}
        selectedValues={formData.category_ids}
        onChange={handleMultiSelectChipsChange}
        disabled={disabled}
        required={true}
        isCreating={isCreating}
      />
      <MultiSelectChips
        label="Empresas"
        name="retail_ids"
        options={retails}
        selectedValues={formData.retail_ids}
        onChange={handleMultiSelectChipsChange}
        disabled={disabled}
        required={true}
        isCreating={isCreating}
      />
      {formData.retail_ids.map((retailId, idx) => {
        const retail = retails.find(r => String(r.id) === retailId);
        if (!retail) return null;
        const isLoading = retailUnitsLoading[retailId];
        const units = retailUnitsByRetail[retailId] || [];

        return (
          <div key={retailId} className="relative">
            {isLoading ? (
              <div className="flex items-center space-x-2 p-2 border rounded-lg bg-gray-100">
                <FaSpinner className="animate-spin text-oscuro" />
                <span className="text-sm text-gray-500">Cargando sucursales de {retail.name}...</span>
              </div>
            ) : (
              <MultiSelectChips
                label={`Sucursales de ${retail.name}`}
                name={`retail_unit_ids_${retailId}`}
                options={units}
                selectedValues={formData.retail_unit_ids[retailId] || []}
                onChange={handleRetailUnitsChange(retailId)}
                disabled={disabled}
                isCreating={isCreating}
                imageUploadEnabled={idx === 0 ? imageUploadEnabled : false}
                imageUrl={idx === 0 ? imageUrl : null}
                onImageSelect={idx === 0 ? onImageSelect : null}
                uploading={uploading}
              />
            )}
            {idx === 0 && imageUploadEnabled && !disabled && (
              <div className="w-full flex justify-end mt-2">
                <button
                  type="button"
                  className="bg-oscuro text-white py-2 px-4 rounded-lg hover:bg-hover cursor-pointer text-sm disabled:opacity-50"
                  onClick={onUploadImage}
                  disabled={!canUpload || uploading}
                >
                  {uploading ? 'Subiendo...' : 'Subir imagen'}
                </button>
              </div>
            )}
          </div>
        );
      })}
    </>
  );
};

export default PromotionTargetingFields;