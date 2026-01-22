import { useState, useEffect } from 'react';
import { BiTrash } from 'react-icons/bi';

const PromotionConditionsEditor = ({ value, onChange, brands = [], products = [], financingPlans = [], disabled = false }) => {
  const predefinedFinancingPlanFields = [
    { key: 'financing_plan_id', label: 'Plan de Financiamiento', type: 'select', isRequired: true, options: financingPlans },
    { key: 'brand_id', label: 'Marca(s)', type: 'multi-select', isRequired: true, options: brands },
    { key: 'products', label: 'Producto(s)', type: 'multi-select', isRequired: true, options: products },
    { key: 'installments', label: 'Cuotas', type: 'text', isRequired: true, validation: (val) => /^((\d+\s*,\s*)*\d+)?$/.test(val) || val === '' },
    { key: 'down_payment', label: 'Monto Inicial (%)', type: 'number', step: '0.01', min: '0', max: '100', isRequired: true },
    { key: 'credit_limit', label: 'Límite Crédito', type: 'number', step: '0.01', min: '0', isRequired: true },
  ];

  const createInitialCondition = () => {
    const newCondition = {};
    predefinedFinancingPlanFields.forEach(field => {
      newCondition[field.key] = field.type === 'multi-select' ? [] : '';
    });
    return newCondition;
  };

  const [conditions, setConditions] = useState([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (value) {
      try {
        const parsedArray = JSON.parse(value);
        if (Array.isArray(parsedArray) && parsedArray.length > 0) {
          const loadedConditions = parsedArray.map(condition => {
            const newCondition = {};
            predefinedFinancingPlanFields.forEach(predefField => {
              let fieldValue = condition[predefField.key];
              if (predefField.key === 'installments') {
                newCondition[predefField.key] = Array.isArray(fieldValue) ? fieldValue.map(String).join(', ') : (fieldValue !== undefined && fieldValue !== null ? String(fieldValue) : '');
              } else if (predefField.type === 'multi-select' && Array.isArray(fieldValue)) {
                newCondition[predefField.key] = fieldValue.map(String);
              } else {
                newCondition[predefField.key] = fieldValue !== undefined && fieldValue !== null ? String(fieldValue) : '';
              }
            });
            return newCondition;
          });
          setConditions(loadedConditions);
          if (loadedConditions.length > 0) {
            setShowForm(true);
          }
        } else {
          setConditions([]);
          setShowForm(false);
        }
      } catch (e) {
        console.error('Error al analizar el valor JSON para PromotionConditionsEditor:', e);
        setConditions([]);
        setShowForm(false);
      }
    } else {
      setConditions([]);
      setShowForm(false);
    }
  }, [value, brands, products, financingPlans]);

  const updateParent = (currentConditions) => {
    const newJsonArray = currentConditions.map(condition => {
      const newJson = {};
      predefinedFinancingPlanFields.forEach(fieldDef => {
        let parsedValue = condition[fieldDef.key];
        if (fieldDef.key === 'installments') {
          const installmentsArray = parsedValue.split(',').map(num => parseInt(num.trim(), 10)).filter(num => !isNaN(num));
          if (installmentsArray.length === 1) {
            parsedValue = installmentsArray[0];
          } else {
            parsedValue = installmentsArray.length > 0 ? installmentsArray : null;
          }
        } else if (fieldDef.type === 'multi-select') {
          parsedValue = Array.isArray(parsedValue) && parsedValue.length > 0 ? parsedValue.map(Number) : null;
        } else if (['down_payment', 'credit_limit'].includes(fieldDef.key)) {
          parsedValue = parseFloat(parsedValue);
          if (isNaN(parsedValue) || condition[fieldDef.key] === '') parsedValue = null;
        } else if (fieldDef.type === 'select') {
          parsedValue = parseInt(parsedValue, 10);
          if (isNaN(parsedValue) || condition[fieldDef.key] === '') parsedValue = null;
        }
        if (parsedValue !== null && parsedValue !== '' && !(Array.isArray(parsedValue) && parsedValue.length === 0)) {
          newJson[fieldDef.key] = parsedValue;
        }
      });
      return newJson;
    }).filter(obj => Object.keys(obj).length > 0);
    onChange(JSON.stringify(newJsonArray));
  };

  const handleFieldChange = (conditionIndex, fieldKey, fieldValue) => {
    const newConditions = conditions.map((condition, i) => {
      if (i === conditionIndex) {
        return { ...condition, [fieldKey]: fieldValue };
      }
      return condition;
    });
    setConditions(newConditions);
  };

  const handleMultiSelectChange = (conditionIndex, fieldKey, selectedOptions) => {
    const newConditions = conditions.map((condition, i) => {
      if (i === conditionIndex) {
        return { ...condition, [fieldKey]: selectedOptions.map(option => String(option.id)) };
      }
      return condition;
    });
    setConditions(newConditions);
    updateParent(newConditions);
  };

  const handleFieldBlur = (conditionIndex, fieldKey) => {
    const currentFieldDef = predefinedFinancingPlanFields.find(f => f.key === fieldKey);
    const currentValue = conditions[conditionIndex][fieldKey];
    if (currentFieldDef && currentFieldDef.validation && !currentFieldDef.validation(currentValue)) {
      alert(`El formato para ${currentFieldDef.label || 'este campo'} no es válido. Por favor, revisa el formato.`);
      setConditions(prevConditions =>
        prevConditions.map((condition, i) =>
          i === conditionIndex ? { ...condition, [fieldKey]: '' } : condition
        )
      );
    }
    updateParent(conditions);
  };

  const handleAddCondition = () => {
    setConditions(prev => [...prev, createInitialCondition()]);
    setShowForm(true);
  };

  const handleRemoveCondition = (conditionIndex) => {
    const newConditions = conditions.filter((_, i) => i !== conditionIndex);
    setConditions(newConditions);
    updateParent(newConditions);
    if (newConditions.length === 0) {
      setShowForm(false);
    }
  };

  return (
    <div className="flex flex-col w-full">
      {!disabled && (
        <button
          type="button"
          onClick={handleAddCondition}
          className="mb-4 p-2 bg-oscuro text-white rounded-lg hover:bg-hover self-start"
        >
          Agregar condiciones
        </button>
      )}

      {showForm && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {conditions.map((condition, conditionIndex) => (
            <div key={conditionIndex} className="p-4 border border-gray-300 rounded-lg bg-gray-50 relative">
              {!disabled && (
                <button
                  type="button"
                  onClick={() => handleRemoveCondition(conditionIndex)}
                  className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center rounded-full p-0 cursor-pointer bg-red-200 hover:bg-red-300 text-red-500"
                >
                  <BiTrash className="text-base" />
                </button>
              )}
              <h4 className="text-md font-semibold mb-3 text-left">Condición por plan {conditionIndex + 1}</h4>
              {predefinedFinancingPlanFields.map((fieldDef) => {
                const lowerCaseLabel = fieldDef.label ? fieldDef.label.toLowerCase() : 'valor';
                const options = fieldDef.options || [];

                if (fieldDef.type === 'multi-select') {
                  return (
                    <div key={fieldDef.key} className="flex flex-col mb-2">
                      <label htmlFor={`${fieldDef.key}-${conditionIndex}`} className="text-sm font-medium text-gray-700 text-left">
                        {fieldDef.label} {fieldDef.isRequired && <span className="text-red-500">*</span>}
                      </label>
                      <div className={`flex flex-wrap gap-2 p-2 border rounded-lg max-h-24 overflow-y-auto ${disabled ? 'bg-gray-200 border-gray-200' : 'bg-white border-gray-300'}`}>
                        {options.length === 0 && <p className="text-gray-500 text-sm">No hay opciones disponibles.</p>}
                        {Array.isArray(options) && options.map(option => {
                          const isSelected = (condition[fieldDef.key] || []).includes(String(option.id));
                          return (
                            <span
                              key={option.id}
                              className={`
                                        px-3 py-1 rounded-lg text-sm transition-colors duration-200
                                        ${isSelected
                                  ? 'bg-claro text-white shadow-md'
                                  : 'bg-gray-200 text-gray-800'
                                }
                                        ${disabled ? 'cursor-not-allowed opacity-70' : 'cursor-pointer hover:bg-gray-300'}
                                      `}
                              onClick={() => {
                                if (!disabled) {
                                  const newSelected = isSelected
                                    ? condition[fieldDef.key].filter(val => val !== String(option.id))
                                    : [...condition[fieldDef.key], String(option.id)];
                                  handleMultiSelectChange(conditionIndex, fieldDef.key, newSelected.map(id => ({ id: Number(id) })));
                                }
                              }}
                            >
                              {option.name || option.label}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  );
                } else if (fieldDef.type === 'select') {
                  return (
                    <div key={fieldDef.key} className="flex flex-col mb-2">
                      <label htmlFor={`${fieldDef.key}-${conditionIndex}`} className="text-sm font-medium text-gray-700 text-left">
                        {fieldDef.label} {fieldDef.isRequired && <span className="text-red-500">*</span>}
                      </label>
                      <select
                        id={`${fieldDef.key}-${conditionIndex}`}
                        name={fieldDef.key}
                        value={condition[fieldDef.key]}
                        onChange={(e) => {
                          handleFieldChange(conditionIndex, fieldDef.key, e.target.value);
                          updateParent(conditions.map((c, i) => i === conditionIndex ? { ...c, [fieldDef.key]: e.target.value } : c));
                        }}
                        onBlur={() => handleFieldBlur(conditionIndex, fieldDef.key)}
                        className="border border-gray-300 rounded-lg p-2 w-full focus:border-claro focus:ring-1 focus:ring-claro"
                        required={fieldDef.isRequired}
                        disabled={disabled}
                      >
                        <option value="">Selecciona un {lowerCaseLabel}...</option>
                        {Array.isArray(options) && options.map(option => (
                          <option key={option.id} value={option.id}>{option.name}</option>
                        ))}
                      </select>
                    </div>
                  );
                }
                return null;
              })}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <div className="flex flex-col">
                  <label htmlFor={`installments-${conditionIndex}`} className="text-sm font-medium text-gray-700 text-left">
                    Cuotas <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id={`installments-${conditionIndex}`}
                    name="installments"
                    value={conditions[conditionIndex]?.installments ?? ''}
                    onChange={(e) => handleFieldChange(conditionIndex, 'installments', e.target.value)}
                    onBlur={() => handleFieldBlur(conditionIndex, 'installments')}
                    className="border border-gray-300 rounded-lg p-2 w-full focus:border-claro focus:ring-1 focus:ring-claro"
                    placeholder="Ej: 3, 6, 9"
                    disabled={disabled}
                  />
                  {conditions[conditionIndex]?.installments !== '' && !predefinedFinancingPlanFields.find(f => f.key === 'installments').validation(conditions[conditionIndex]?.installments) && (
                    <p className="text-red-500 text-xs mt-1 text-left">
                      Formato inválido.
                    </p>
                  )}
                </div>
                <div className="flex flex-col">
                  <label htmlFor={`down_payment-${conditionIndex}`} className="text-sm font-medium text-gray-700 text-left">
                    Monto Inicial (%) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    id={`down_payment-${conditionIndex}`}
                    name="down_payment"
                    value={conditions[conditionIndex]?.down_payment ?? ''}
                    onChange={(e) => handleFieldChange(conditionIndex, 'down_payment', e.target.value)}
                    onBlur={() => handleFieldBlur(conditionIndex, 'down_payment')}
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
                    Límite Crédito <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    id={`credit_limit-${conditionIndex}`}
                    name="credit_limit"
                    value={conditions[conditionIndex]?.credit_limit ?? ''}
                    onChange={(e) => handleFieldChange(conditionIndex, 'credit_limit', e.target.value)}
                    onBlur={() => handleFieldBlur(conditionIndex, 'credit_limit')}
                    className="border border-gray-300 rounded-lg p-2 w-full focus:border-claro focus:ring-1 focus:ring-claro"
                    placeholder="Ej: 50000.00"
                    step="0.01"
                    min="0"
                    disabled={disabled}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PromotionConditionsEditor;