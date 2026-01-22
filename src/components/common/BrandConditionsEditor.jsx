import { useState, useEffect } from 'react';
import { BiTrash } from 'react-icons/bi';
import Select from 'react-select';

const BrandConditionsEditor = ({ value, onChange, brands = [], disabled = false }) => {
  const predefinedBrandFields = [
    { key: 'brand_id', label: 'Marca', type: 'select', isRequired: true, placeholder: 'Selecciona una marca...' },
    { key: 'installments', label: 'Número de cuotas', type: 'number', step: '1', min: '1', placeholder: 'Ej: 12' },
    { key: 'down_payment_rate', label: 'Inicial', type: 'number', step: '0.01', min: '0', max: '100', placeholder: 'Ej: 10.00' },
    { key: 'credit_limit', label: 'Límite de Crédito', type: 'number', step: '0.01', min: '0', placeholder: 'Ej: 50000.00' },
  ];

  const createInitialCondition = () => {
    const newCondition = {};
    predefinedBrandFields.forEach(field => {
      newCondition[field.key] = '';
    });
    return newCondition;
  };

  const [brandConditions, setBrandConditions] = useState([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (value) {
      try {
        const parsedArray = JSON.parse(value);
        if (Array.isArray(parsedArray) && parsedArray.length > 0) {
          const loadedConditions = parsedArray.map(condition => {
            const newCondition = {};
            predefinedBrandFields.forEach(predefField => {
              let fieldValue = condition[predefField.key];
              newCondition[predefField.key] = fieldValue !== undefined && fieldValue !== null ? String(fieldValue) : '';
            });
            return newCondition;
          });
          setBrandConditions(loadedConditions);
          if (loadedConditions.length > 0) {
            setShowForm(true);
          }
        } else {
          setBrandConditions([]);
          setShowForm(false);
        }
      } catch (e) {
        console.error('Error al analizar el valor JSON para BrandConditionsEditor:', e);
        setBrandConditions([]);
        setShowForm(false);
      }
    } else {
      setBrandConditions([]);
      setShowForm(false);
    }
  }, [value]);

  const updateParent = (currentConditions) => {
    const newJsonArray = currentConditions.map(condition => {
      const newJson = {};
      predefinedBrandFields.forEach(fieldDef => {
        let parsedValue = condition[fieldDef.key];

        if (fieldDef.type === 'number') {
          parsedValue = parseFloat(parsedValue);
          if (isNaN(parsedValue) || condition[fieldDef.key] === '') parsedValue = null;
        } else if (fieldDef.key === 'brand_id') {
          parsedValue = parseInt(parsedValue, 10);
          if (isNaN(parsedValue) || condition[fieldDef.key] === '') parsedValue = null;
        } else {
          if (parsedValue === '') parsedValue = null;
        }

        if (parsedValue !== null) {
          newJson[fieldDef.key] = parsedValue;
        }
      });
      return newJson;
    }).filter(obj => Object.keys(obj).length > 0);

    onChange(JSON.stringify(newJsonArray));
  };

  const handleFieldChange = (conditionIndex, fieldKey, fieldValue) => {
    setBrandConditions(prevBrandConditions => {
      const newBrandConditions = prevBrandConditions.map((condition, i) => {
        if (i === conditionIndex) {
          return { ...condition, [fieldKey]: fieldValue };
        }
        return condition;
      });
      updateParent(newBrandConditions);
      return newBrandConditions;
    });
  };

  const brandOptions = brands.map(brand => ({
    value: brand.id,
    label: brand.name,
  }));

  const handleAddCondition = () => {
    const newConditions = [...brandConditions, createInitialCondition()];
    setBrandConditions(newConditions);
    setShowForm(true);
    updateParent(newConditions);
  };

  const handleRemoveCondition = (conditionIndex) => {
    const newBrandConditions = brandConditions.filter((_, i) => i !== conditionIndex);
    setBrandConditions(newBrandConditions);
    updateParent(newBrandConditions);
    if (newBrandConditions.length === 0) {
      setShowForm(false);
    }
  };

  const customStyles = {
    control: (provided) => ({
      ...provided,
      textAlign: 'left',
    }),
    placeholder: (provided) => ({
      ...provided,
      textAlign: 'left',
    }),
    singleValue: (provided) => ({
      ...provided,
      textAlign: 'left',
    }),
    option: (provided) => ({
      ...provided,
      textAlign: 'left',
    }),
  };

  return (
    <div className="flex flex-col w-full">
      {!disabled && (
        <button
          type="button"
          onClick={handleAddCondition}
          className="mb-4 p-2 bg-oscuro text-white rounded-lg hover:bg-hover self-start"
          disabled={disabled}
        >
          Agregar condiciones para una marca
        </button>
      )}

      {showForm && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {brandConditions.map((condition, conditionIndex) => (
            <div key={conditionIndex} className="p-4 border border-gray-300 rounded-lg bg-gray-50 relative">
              {!disabled && (
                <button
                  type="button"
                  onClick={() => handleRemoveCondition(conditionIndex)}
                  className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center rounded-full p-0 cursor-pointer bg-red-200 hover:bg-red-300 text-red-500"
                  disabled={disabled}
                >
                  <BiTrash className="text-base" />
                </button>
              )}
              <h4 className="text-md font-semibold mb-3 text-left">Condición de Marca #{conditionIndex + 1}</h4>
              {predefinedBrandFields.find(field => field.key === 'brand_id' && field.type === 'select') && (
                <div className="flex flex-col mb-2">
                  <label htmlFor={`brand_id-${conditionIndex}`} className="text-sm font-medium text-gray-700 text-left">
                    Marca
                    <span className="text-red-500">*</span>
                  </label>
                  <Select
                    id={`brand_id-${conditionIndex}`}
                    name="brand_id"
                    options={brandOptions}
                    value={brandOptions.find(option => String(option.value) === String(condition.brand_id)) || null}
                    onChange={(selectedOption) => {
                      handleFieldChange(conditionIndex, 'brand_id', selectedOption ? selectedOption.value : '');
                    }}
                    className="w-full"
                    classNamePrefix="react-select"
                    placeholder="Selecciona una marca..."
                    isClearable
                    isDisabled={disabled}
                    required
                    styles={customStyles}
                  />
                </div>
              )}
              <div className="flex flex-col mb-2">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <div className="flex flex-col">
                    <label htmlFor={`installments-${conditionIndex}`} className="text-sm font-medium text-gray-700 text-left">
                      Número de cuotas
                    </label>
                    <input
                      type="number"
                      id={`installments-${conditionIndex}`}
                      name="installments"
                      value={condition.installments}
                      onChange={(e) => handleFieldChange(conditionIndex, 'installments', e.target.value)}
                      className="border border-gray-300 rounded-lg p-2 w-full focus:border-claro focus:ring-1 focus:ring-claro"
                      placeholder="Ej: 12"
                      min="1"
                      step="1"
                      disabled={disabled}
                    />
                  </div>
                  <div className="flex flex-col">
                    <label htmlFor={`down_payment_rate-${conditionIndex}`} className="text-sm font-medium text-gray-700 text-left">
                      Inicial (%)
                    </label>
                    <input
                      type="number"
                      id={`down_payment_rate-${conditionIndex}`}
                      name="down_payment_rate"
                      value={condition.down_payment_rate}
                      onChange={(e) => handleFieldChange(conditionIndex, 'down_payment_rate', e.target.value)}
                      className="border border-gray-300 rounded-lg p-2 w-full focus:border-claro focus:ring-1 focus:ring-claro"
                      placeholder="Ej: 10.00"
                      step="0.01"
                      min="0"
                      max="100"
                      disabled={disabled}
                    />
                  </div>
                  <div className="flex flex-col">
                    <label htmlFor={`credit_limit-${conditionIndex}`} className="text-sm font-medium text-gray-700 text-left">
                      Límite de Crédito
                    </label>
                    <input
                      type="number"
                      id={`credit_limit-${conditionIndex}`}
                      name="credit_limit"
                      value={condition.credit_limit}
                      onChange={(e) => handleFieldChange(conditionIndex, 'credit_limit', e.target.value)}
                      className="border border-gray-300 rounded-lg p-2 w-full focus:border-claro focus:ring-1 focus:ring-claro"
                      placeholder="Ej: 50000.00"
                      step="0.01"
                      min="0"
                      disabled={disabled}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BrandConditionsEditor;