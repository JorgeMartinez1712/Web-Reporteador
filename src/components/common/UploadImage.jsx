import { useState, useEffect } from 'react';
import { FaImage, FaTimesCircle } from 'react-icons/fa';

const UploadImage = ({ onImageSelect, imageUrl, className = '', idPrefix = 'image-upload-input', disabled }) => {
  const [previewUrl, setPreviewUrl] = useState(imageUrl);

  useEffect(() => {
    setPreviewUrl(imageUrl);
  }, [imageUrl]);

  const uniqueId = `${idPrefix}-${Math.random().toString(36).substr(2, 9)}`;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
        if (onImageSelect) {
          onImageSelect(file);
        }
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(null);
      if (onImageSelect) {
        onImageSelect(null);
      }
    }
  };

  const handleRemoveImage = () => {
    setPreviewUrl(null);
    if (onImageSelect) {
      onImageSelect(null);
    }
    const fileInput = document.getElementById(uniqueId);
    if (fileInput) {
      fileInput.value = '';
    }
  };

  return (
    <div
      className={`flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-4 transition-colors duration-200
      ${disabled ? 'border-gray-200 cursor-not-allowed opacity-60' : 'border-gray-300 hover:border-claro cursor-pointer'}
      ${className}`}
    >
      <input
        id={uniqueId}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled}
      />
      <label htmlFor={uniqueId} className={`w-full h-full flex flex-col items-center justify-center ${disabled ? 'pointer-events-none' : 'cursor-pointer'}`}>
        {previewUrl ? (
          <div className="relative w-full h-48 flex items-center justify-center p-2">
            <img src={previewUrl} alt="Vista previa" className="max-w-full max-h-full object-contain rounded-lg" />
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); handleRemoveImage(); }}
              className="absolute top-1 right-1 text-red-500 hover:text-red-700 focus:outline-none"
              title="Quitar imagen"
              disabled={disabled}
            >
              <FaTimesCircle className="text-xl bg-white rounded-full" />
            </button>
          </div>
        ) : (
          <div className="text-center flex flex-col items-center justify-center w-full h-full">
            <FaImage className="text-gray-400 text-5xl mb-2" />
            <p className="text-gray-600 text-sm">Haz clic para subir una imagen</p>
            <p className="text-gray-500 text-xs">PNG, JPG</p>
          </div>
        )}
      </label>
    </div>
  );
};

export default UploadImage;