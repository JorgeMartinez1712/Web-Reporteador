const MultiSelectChips = ({ options, selectedValues, onChange, label, name, disabled = false, required = false, isCreating = false }) => {
    const currentSelectedStrings = selectedValues.map(String);
    const isSelected = (value) => {
        const check = currentSelectedStrings.includes(String(value));
        return check;
    };

    const handleClick = (value) => {
        if (disabled) return;
        const valueAsString = String(value);
        let newSelectedValues;
        if (isSelected(valueAsString)) {
            newSelectedValues = currentSelectedStrings.filter(val => val !== valueAsString);
        } else {
            newSelectedValues = [...currentSelectedStrings, valueAsString];
        }
        onChange({
            target: {
                name: name,
                value: newSelectedValues
            }
        });
    };

    return (
        <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1 text-left">
              {label} {required && isCreating && <span className="text-red-500">*</span>}
            </label>
            <div className={`flex flex-wrap gap-2 p-2 border rounded-lg max-h-24 overflow-y-auto ${disabled ? 'bg-gray-100 cursor-not-allowed border-gray-200' : 'bg-white border-gray-300'}`}>
                {options.length === 0 && <p className="text-gray-500 text-sm">No hay opciones disponibles.</p>}
                {options.map(option => (
                    <span
                        key={option.id}
                        className={`
                            px-3 py-1 rounded-lg text-sm transition-colors duration-200
                            ${isSelected(option.id)
                                ? 'bg-claro text-white shadow-md'
                                : 'bg-gray-200 text-gray-800'
                            }
                            ${disabled ? 'cursor-not-allowed opacity-70' : 'cursor-pointer hover:bg-gray-300'}
                        `}
                        onClick={() => handleClick(option.id)}
                    >
                        {option.name}
                    </span>
                ))}
            </div>
        </div>
    );
};

export default MultiSelectChips;