import { useState, useEffect } from 'react';
import { FaSpinner } from 'react-icons/fa';
import UploadImage from '../common/UploadImage';

const BrandsForm = ({
  onSubmit,
  loading,
  initialData = null,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    logo: null,
  });

  const [currentLogoUrl, setCurrentLogoUrl] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData({
        code: initialData.code || '',
        name: initialData.name || '',
        description: initialData.description || '',
        logo: null,
      });
      setCurrentLogoUrl(initialData.logo || '');
    } else {
      setFormData({
        code: '',
        name: '',
        description: '',
        logo: null,
      });
      setCurrentLogoUrl('');
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogoSelect = (file) => {
    setFormData((prev) => ({ ...prev, logo: file }));
    if (file) {
      const newPreviewUrl = URL.createObjectURL(file);
      setCurrentLogoUrl(newPreviewUrl);
    } else {
      setCurrentLogoUrl(initialData?.logo || '');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const dataToSend = {
      code: formData.code,
      name: formData.name,
      description: formData.description,
    };

    if (initialData && initialData.id) {
      dataToSend.id = initialData.id;
    }

    if (formData.logo instanceof File) {
      const formDataToSend = new FormData();
      Object.keys(dataToSend).forEach(key => {
        formDataToSend.append(key, dataToSend[key]);
      });
      formDataToSend.append('logo', formData.logo);
      onSubmit(formDataToSend);
    } else {
      onSubmit(dataToSend);
    }
  };

  const handleCancelClick = () => {
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col items-center justify-center px-8 overflow-y-auto">
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col">
          <label htmlFor="code" className="text-sm font-medium text-gray-700">Código <span className="text-red-500">*</span></label>
          <input
            type="text"
            id="code"
            name="code"
            value={formData.code}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg p-2 w-full"
            placeholder="Ej: AB01"
            required
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="name" className="text-sm font-medium text-gray-700">Nombre <span className="text-red-500">*</span></label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg p-2 w-full"
            placeholder="Ej: Samsung, Apple"
            required
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="description" className="text-sm font-medium text-gray-700">Descripción <span className="text-red-500">*</span></label>
          <input
            type="text"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg p-2 w-full"
            placeholder="Una Pequeña descripción de la marca"
            required
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="logo" className="text-sm font-medium text-gray-700 mb-2">Logo</label>
          <UploadImage
            onImageSelect={handleLogoSelect}
            imageUrl={currentLogoUrl}
            className="h-48"
          />
        </div>
      </div>
      <div className="w-full flex justify-end gap-2 mt-4">
        <button
          type="button"
          onClick={handleCancelClick}
          className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 cursor-pointer text-sm"
          disabled={loading}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="bg-oscuro text-white py-2 px-4 rounded-lg hover:bg-hover cursor-pointer text-sm"
          disabled={loading}
        >
          {loading ? <FaSpinner className="animate-spin mx-auto" /> : 'Guardar'}
        </button>
      </div>
    </form>
  );
};

export default BrandsForm;