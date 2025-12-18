import { useState, useEffect, useRef } from 'react';

const JsonFieldEditor = ({ label, value, onChange, disabled = false }) => {
  const predefinedFields = [
    { key: 'CUOTAS', placeholder: 'Ej: 5', validation: (val) => /^\d+$/.test(val) || val === '' },
    { key: 'INICIAL', placeholder: 'Ej: 50%', validation: (val) => /^(\d+(\.\d+)?%?|sin límite de crédito)$/i.test(val) || val === '' },
    { key: 'LÍMITE CRÉDITO', placeholder: 'Ej: 300$', validation: (val) => /^(\d+(\.\d+)?\$?|sin límite de crédito)$/i.test(val) || val === '' },
  ];

  const [fields, setFields] = useState(() =>
    predefinedFields.map(field => ({
      key: field.key,
      value: '',
      isEditing: false,
    }))
  );

  const inputRefs = useRef([]);

  useEffect(() => {
    if (value) {
      try {
        const parsedValue = JSON.parse(value);
        const updatedFields = predefinedFields.map(predefField => {
          const foundValue = parsedValue[predefField.key] !== undefined ? String(parsedValue[predefField.key]) : '';
          return {
            key: predefField.key,
            value: foundValue,
            isEditing: false,
          };
        });
        setFields(updatedFields);
      } catch (e) {
        console.error('Error al analizar el valor JSON para JsonFieldEditor:', e);
        setFields(predefinedFields.map(field => ({ key: field.key, value: '', isEditing: false })));
      }
    } else {
      setFields(predefinedFields.map(field => ({ key: field.key, value: '', isEditing: false })));
    }
  }, [value]);

  const updateParent = (updatedFields) => {
    const newJson = updatedFields.reduce((acc, field) => {
      if (field.key && field.value !== '') {
        acc[field.key] = field.value;
      }
      return acc;
    }, {});
    onChange(JSON.stringify(newJson));
  };

  const handleFieldClick = (index) => {
    setFields(prevFields =>
      prevFields.map((field, i) =>
        i === index ? { ...field, isEditing: true } : { ...field, isEditing: false }
      )
    );
  };

  const handleChange = (index, e) => {
    const { value } = e.target;
    const newFields = fields.map((field, i) => {
      if (i === index) {
        return { ...field, value };
      }
      return field;
    });
    setFields(newFields);

  };

  const handleBlur = (index, e) => {
    const { value } = e.target;
    const currentFieldDef = predefinedFields[index];

    if (!currentFieldDef.validation(value)) {
      alert(`El formato para ${currentFieldDef.key} no es válido. ${currentFieldDef.placeholder}`);
      setFields(prevFields =>
        prevFields.map((field, i) =>
          i === index ? { ...field, isEditing: false, value: '' } : field
        )
      );
    } else {
      setFields(prevFields =>
        prevFields.map((field, i) =>
          i === index ? { ...field, isEditing: false } : field
        )
      );
    }
    updateParent(fields);
  };

  return (
    <div className="flex flex-col border border-gray-300 rounded-lg p-3">
      <label className="text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      {fields.map((field, index) => (
        <div
          key={field.key}
          className={`flex gap-2 mb-2 items-center p-2 rounded-lg cursor-pointer transition-colors duration-200
            ${field.isEditing ? 'bg-emerald-100 border-emerald-500' : ''}
            ${!field.isEditing && field.value !== '' ? 'bg-emerald-50' : 'hover:bg-gray-50'}`}
          onClick={() => !disabled && handleFieldClick(index)}
        >
          <span className="font-semibold text-gray-800 w-1/3">{field.key}:</span>
          {field.isEditing && !disabled ? (
            <input
              type="text"
              name="value"
              value={field.value}
              onChange={(e) => handleChange(index, e)}
              onBlur={(e) => handleBlur(index, e)}
              className="border border-gray-300 rounded-lg p-2 w-2/3 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              placeholder={predefinedFields[index].placeholder}
              autoFocus
            />
          ) : (
            <span className={`w-2/3 p-2 border border-transparent rounded-lg ${field.value ? 'text-gray-900' : 'text-gray-500 italic'}`}>
              {field.value || predefinedFields[index].placeholder}
            </span>
          )}
        </div>
      ))}
    </div>
  );
};

export default JsonFieldEditor;