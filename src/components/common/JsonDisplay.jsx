const JsonDisplay = ({ data }) => {
  if (!data) {
    return null;
  }

  let parsedData;
  try {
    parsedData = typeof data === 'string' ? JSON.parse(data) : data;
  } catch (e) {
    return null;
  }

  const allowedKeys = ['cuotas', 'inicial', 'limite_credito']; 

  const filteredData = Object.entries(parsedData).filter(([key]) => allowedKeys.includes(key.toLowerCase())); 

  if (filteredData.length === 0) {
    return null;
  }

  return (
    <ul className="list-disc list-inside text-gray-700 text-sm mt-1 ml-4">
      {filteredData.map(([key, value]) => {
        let displayKey = key.replace(/_/g, ' '); 
      
        if (key.toLowerCase() === 'cuotas') {
          displayKey = 'CUOTAS';
        } else if (key.toLowerCase() === 'inicial') {
          displayKey = 'INICIAL';
        } else if (key.toLowerCase() === 'limite_credito') {
          displayKey = 'LÍMITE CRÉDITO';
        }

        return (
          <li key={key}>
            <span className="font-medium capitalize">{displayKey}:</span> {String(value)}
          </li>
        );
      })}
    </ul>
  );
};

export default JsonDisplay;