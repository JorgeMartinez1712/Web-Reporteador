const PromotionGeneralFields = ({ formData, handleChange, disabled, isCreating = false }) => {
  return (
    <>
      <div className="flex flex-col">
        <label htmlFor="name" className="text-sm font-medium text-gray-700 text-left">Nombre {isCreating && <span className="text-red-500">*</span>}</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="border border-gray-300 rounded-lg p-2 w-full"
          placeholder="Ej: Descuento 10% Verano"
          required={isCreating}
          disabled={disabled}
        />
      </div>
      <div className="flex flex-col">
        <label htmlFor="description" className="text-sm font-medium text-gray-700 text-left">Descripción {isCreating && <span className="text-red-500">*</span>}</label>
        <input
          type="text"
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="border border-gray-300 rounded-lg p-2 w-full"
          placeholder="Ej: 10% de descuento en todos los productos electrónicos."
          required={isCreating}
          disabled={disabled}
        />
      </div>
      <div className="flex flex-col">
        <label htmlFor="min_amount" className="text-sm font-medium text-gray-700 text-left">Monto Mínimo</label>
        <input
          type="number"
          id="min_amount"
          name="conditions.global.min_amount"
          value={formData.conditions?.global?.min_amount ?? ''}
          onChange={handleChange}
          className="border border-gray-300 rounded-lg p-2 w-full"
          placeholder="Ej: 100.00"
          disabled={disabled}
        />
      </div>
      <div className="flex flex-col">
        <label htmlFor="start_date" className="text-sm font-medium text-gray-700 text-left">Fecha de Inicio {isCreating && <span className="text-red-500">*</span>}</label>
        <input
          type="date"
          id="start_date"
          name="start_date"
          value={formData.start_date}
          onChange={handleChange}
          className="border border-gray-300 rounded-lg p-2 w-full"
          required={isCreating}
          disabled={disabled}
        />
      </div>
      <div className="flex flex-col">
        <label htmlFor="end_date" className="text-sm font-medium text-gray-700 text-left">Fecha de Fin {isCreating && <span className="text-red-500">*</span>}</label>
        <input
          type="date"
          id="end_date"
          name="end_date"
          value={formData.end_date}
          onChange={handleChange}
          className="border border-gray-300 rounded-lg p-2 w-full"
          required={isCreating}
          disabled={disabled}
        />
      </div>
    </>
  );
};

export default PromotionGeneralFields;