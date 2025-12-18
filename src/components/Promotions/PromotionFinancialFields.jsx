const PromotionFinancialFields = ({
  formData,
  handleChange,
  handleSelectChange,
  promotionStatuses,
  financingPlans,
  disabled,
  isCreating,
  isCreating: _isCreatingProp,
}) => {
  const showAsterisk = Boolean(isCreating);
  return (
    <>
      {!isCreating && (
        <div className="flex flex-col">
          <label htmlFor="promotion_status_id" className="text-sm font-medium text-gray-700 text-left">Estado de Promoción {showAsterisk && <span className="text-red-500">*</span>}</label>
          <select
            id="promotion_status_id"
            name="promotion_status_id"
            value={formData.promotion_status_id}
            onChange={handleSelectChange}
            className="border border-gray-300 rounded-lg p-2 w-full"
            required
            disabled={disabled}
          >
            <option value="">Seleccione un estado</option>
            {Array.isArray(promotionStatuses) && promotionStatuses.map((status) => (
              <option key={status.id} value={status.id}>
                {status.name}
              </option>
            ))}
          </select>
        </div>
      )}
      <div className="flex flex-col">
        <label htmlFor="interest_rate" className="text-sm font-medium text-gray-700 text-left">Tasa de Interés (%) {showAsterisk && <span className="text-red-500">*</span>}</label>
        <input
          type="number"
          id="interest_rate"
          name="conditions.global.interest_rate"
          value={formData.conditions?.global?.interest_rate ?? ''}
          onChange={handleChange}
          className="border border-gray-300 rounded-lg p-2 w-full"
          placeholder="Ej: 5.5"
          step="0.01"
          disabled={disabled}
        />
      </div>
      <div className="flex flex-col">
        <label htmlFor="grace_period_days" className="text-sm font-medium text-gray-700 text-left">Días de Gracia</label>
        <input
          type="number"
          id="grace_period_days"
          name="conditions.global.grace_period_days"
          value={formData.conditions?.global?.grace_period_days ?? ''}
          onChange={handleChange}
          className="border border-gray-300 rounded-lg p-2 w-full"
          placeholder="Ej: 15"
          step="1"
          disabled={disabled}
        />
      </div>
    </>
  );
};

export default PromotionFinancialFields;