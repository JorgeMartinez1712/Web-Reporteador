import { useState, useEffect } from 'react';
import { BiTrash } from 'react-icons/bi';
import Select from 'react-select';

const ProductPromotionConditionsEditor = ({ value, onChange, products = [], disabled = false }) => {
  const predefinedProductFields = [
    { key: 'product_id', label: 'Producto', type: 'select', isRequired: true },
    { key: 'max_amount', label: 'Monto Máximo', type: 'number', step: '0.01', min: '0' },
  ];

  const createInitialCondition = () => {
    const newCondition = {};
    predefinedProductFields.forEach(field => {
      newCondition[field.key] = '';
    });
    return newCondition;
  };

  const [productConditions, setProductConditions] = useState([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (value) {
      try {
        const parsedArray = JSON.parse(value);
        if (Array.isArray(parsedArray) && parsedArray.length > 0) {
          const loadedConditions = parsedArray.map(condition => {
            const newCondition = {};
            predefinedProductFields.forEach(predefField => {
              newCondition[predefField.key] = condition[predefField.key] !== undefined && condition[predefField.key] !== null ? String(condition[predefField.key]) : '';
            });
            return newCondition;
          });
          setProductConditions(loadedConditions);
          if (loadedConditions.length > 0) {
            setShowForm(true);
          }
        } else {
          setProductConditions([]);
          setShowForm(false);
        }
      } catch (e) {
        console.error('Error al analizar el valor JSON para ProductPromotionConditionsEditor:', e);
        setProductConditions([]);
        setShowForm(false);
      }
    } else {
      setProductConditions([]);
      setShowForm(false);
    }
  }, [value, products]);

  const updateParent = (currentConditions) => {
    const newJsonArray = currentConditions.map(condition => {
      const newJson = {};
      predefinedProductFields.forEach(fieldDef => {
        let parsedValue = condition[fieldDef.key];

        if (fieldDef.key === 'max_amount') {
          parsedValue = parseFloat(parsedValue);
          if (isNaN(parsedValue) || condition[fieldDef.key] === '') parsedValue = null;
        } else if (fieldDef.key === 'product_id') {
          parsedValue = parseInt(parsedValue, 10);
          if (isNaN(parsedValue) || condition[fieldDef.key] === '') parsedValue = null;
        }

        if (parsedValue !== null && parsedValue !== '') {
          newJson[fieldDef.key] = parsedValue;
        }
      });
      return newJson;
    }).filter(obj => Object.keys(obj).length > 0);

    onChange(JSON.stringify(newJsonArray));
  };

  const handleFieldChange = (conditionIndex, fieldKey, fieldValue) => {
    const newProductConditions = productConditions.map((condition, i) => {
      if (i === conditionIndex) {
        return { ...condition, [fieldKey]: fieldValue };
      }
      return condition;
    });
    setProductConditions(newProductConditions);
  };

  const handleFieldBlur = (conditionIndex, fieldKey) => {
    updateParent(productConditions);
  };

  // Mapear los productos al formato value/label para React-Select
  const productOptions = products.map(product => ({
    value: product.id,
    label: product.name,
  }));

  const handleAddCondition = () => {
    setProductConditions(prev => [...prev, createInitialCondition()]);
    setShowForm(true);
  };

  const handleRemoveCondition = (conditionIndex) => {
    const newProductConditions = productConditions.filter((_, i) => i !== conditionIndex);
    setProductConditions(newProductConditions);
    updateParent(newProductConditions);
    if (newProductConditions.length === 0) {
      setShowForm(false);
    }
  };

  return (
    <div className="flex flex-col w-full">
      {!disabled && (
        <button
          type="button"
          onClick={handleAddCondition}
          className="mb-4 p-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 self-start"
          disabled={disabled}
        >
          Agregar condiciones por producto
        </button>
      )}

      {showForm && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {productConditions.map((condition, conditionIndex) => (
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
              <h4 className="text-md font-semibold mb-3 text-left">Condición de Producto #{conditionIndex + 1}</h4>
              {predefinedProductFields.map((fieldDef) => {
                const lowerCaseLabel = fieldDef.label ? fieldDef.label.toLowerCase() : 'valor';
                return (
                  <div key={fieldDef.key} className="flex flex-col mb-2">
                    <label htmlFor={`${fieldDef.key}-${conditionIndex}`} className="text-sm font-medium text-gray-700 text-left">
                      {fieldDef.label} {fieldDef.isRequired && <span className="text-red-500">*</span>}
                    </label>
                    {fieldDef.type === 'select' ? (
                      <Select
                        id={`${fieldDef.key}-${conditionIndex}`}
                        name={fieldDef.key}
                        options={productOptions}
                        value={productOptions.find(option => String(option.value) === String(condition[fieldDef.key])) || null}
                        onChange={(selectedOption) => {
                          handleFieldChange(conditionIndex, fieldDef.key, selectedOption ? selectedOption.value : '');
                          updateParent(productConditions.map((c, i) => i === conditionIndex ? { ...c, [fieldDef.key]: selectedOption ? selectedOption.value : '' } : c));
                        }}
                        onBlur={() => handleFieldBlur(conditionIndex, fieldDef.key)}
                        className="w-full"
                        classNamePrefix="react-select"
                        placeholder="Selecciona un producto..."
                        isClearable
                        isDisabled={disabled}
                        required={fieldDef.isRequired}
                      />
                    ) : (
                      <input
                        type={fieldDef.type}
                        id={`${fieldDef.key}-${conditionIndex}`}
                        name={fieldDef.key}
                        value={condition[fieldDef.key]}
                        onChange={(e) => handleFieldChange(conditionIndex, fieldDef.key, e.target.value)}
                        onBlur={() => handleFieldBlur(conditionIndex, fieldDef.key)}
                        className="border border-gray-300 rounded-lg p-2 w-full focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                        placeholder={`Ingresa ${lowerCaseLabel}`}
                        step={fieldDef.step}
                        min={fieldDef.min}
                        max={fieldDef.max}
                        required={fieldDef.isRequired}
                        disabled={disabled}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductPromotionConditionsEditor;