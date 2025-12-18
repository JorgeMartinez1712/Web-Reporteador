import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FaSpinner } from 'react-icons/fa';
import ErrorNotification from '../common/ErrorNotification';
import UploadImage from '../common/UploadImage';

const ProductsForm = ({
  categories = [],
  brands = [],
  onSubmit,
  loading,
  initialData = null,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    category_id: '',
    brand_id: '',
    sku: '',
    name: '',
    description: '',
    model: '',
    base_price: '',
    currency_id: '',
    requires_device_lock: false,
    is_service: false,
    image_file: null,
  });

  const { user } = useAuth();

  const [showErrorNotification, setShowErrorNotification] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData({
        category_id: initialData.category_id || '',
        brand_id: initialData.brand_id || '',
        sku: initialData.sku || '',
        name: initialData.name || '',
        description: initialData.description || '',
        model: initialData.model || '',
        base_price: initialData.base_price || '',
        currency_id: initialData.currency_id || '',
        requires_device_lock: initialData.requires_device_lock || false,
        is_service: initialData.is_service || false,
        image_file: null,
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (showErrorNotification) {
      setShowErrorNotification(false);
      setErrorMessage('');
    }
  };

  const handleImageSelect = (file) => {
    setFormData((prev) => ({
      ...prev,
      image_file: file,
    }));
  };

  const handleShowError = (message) => {
    setErrorMessage(message);
    setShowErrorNotification(true);
    setTimeout(() => {
      setShowErrorNotification(false);
      setErrorMessage('');
    }, 3000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const dataToSend = new FormData();
    const retailId = user?.seller?.retail?.id ?? null;
    const currencyId = user?.seller?.retail?.currency?.id ?? null;
    if (retailId) {
      dataToSend.append('retailer_id', Number(retailId));
    }
    dataToSend.append('category_id', Number(formData.category_id));
    dataToSend.append('brand_id', Number(formData.brand_id));
    dataToSend.append('sku', formData.sku);
    dataToSend.append('name', formData.name);
    dataToSend.append('description', formData.description);
    dataToSend.append('model', formData.model);
    dataToSend.append('base_price', parseFloat(formData.base_price));
    if (currencyId) {
      dataToSend.append('currency_id', Number(currencyId));
    }
    dataToSend.append('requires_device_lock', formData.requires_device_lock);
    dataToSend.append('is_service', formData.is_service);
    dataToSend.append('product_status_id', initialData ? initialData.product_status_id : 1);

    if (formData.image_file) {
      dataToSend.append('image_file', formData.image_file);
    }

    onSubmit(dataToSend);
  };

  const handleCancelClick = () => {
    if (onCancel) {
      onCancel();
    }
    setFormData({
      category_id: '',
      brand_id: '',
      sku: '',
      name: '',
      description: '',
      model: '',
      base_price: '',
      currency_id: '',
      requires_device_lock: false,
      is_service: false,
      image_file: null,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col items-center justify-center px-8 flex-grow overflow-y-auto">
      <ErrorNotification isOpen={showErrorNotification} message={errorMessage} />
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col">
          <label htmlFor="category_id" className="text-sm font-medium text-gray-700">Categoría <span className="text-red-500">*</span></label>
          <select
            id="category_id"
            name="category_id"
            value={formData.category_id}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg p-2 w-full"
            required
          >
            <option value="">--Seleccionar--</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col">
          <label htmlFor="brand_id" className="text-sm font-medium text-gray-700">Marca <span className="text-red-500">*</span></label>
          <select
            id="brand_id"
            name="brand_id"
            value={formData.brand_id}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg p-2 w-full"
            required
          >
            <option value="">--Seleccionar--</option>
            {brands.map((brand) => (
              <option key={brand.id} value={brand.id}>
                {brand.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col">
          <label htmlFor="sku" className="text-sm font-medium text-gray-700">SKU <span className="text-red-500">*</span></label>
          <input
            type="text"
            id="sku"
            name="sku"
            value={formData.sku}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg p-2 w-full"
            placeholder="00123"
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
            placeholder="Smartphone Galaxy S25"
            required
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="model" className="text-sm font-medium text-gray-700">Modelo <span className="text-red-500">*</span></label>
          <input
            type="text"
            id="model"
            name="model"
            value={formData.model}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg p-2 w-full"
            placeholder="SM-G998B"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="base_price" className="text-sm font-medium text-gray-700">Precio Base <span className="text-red-500">*</span></label>
          <input
            type="number"
            id="base_price"
            name="base_price"
            value={formData.base_price}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg p-2 w-full"
            step="0.01"
            placeholder="899.99"
            required
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="description" className="text-sm font-medium text-gray-700">Descripción</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg p-2 w-full h-[42px] resize-none"
            rows="1"
            placeholder="Un potente smartphone"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="image_upload" className="text-sm font-medium text-gray-700">Imagen del Producto</label>
          <div className="w-full">
            <UploadImage onImageSelect={handleImageSelect} imageUrl={initialData?.image_url} />
          </div>
        </div>
        <div className="flex flex-col md:col-span-2">
          <div className="mb-2">
            <span className="text-sm text-gray-500">Los siguientes campos son opcionales</span>
          </div>
          <div className="flex items-center mt-2">
            <input
              type="checkbox"
              id="requires_device_lock"
              name="requires_device_lock"
              checked={formData.requires_device_lock}
              onChange={handleChange}
              className="form-checkbox h-5 w-5 text-emerald-600 rounded"
            />
            <label htmlFor="requires_device_lock" className="ml-2 text-sm font-medium text-gray-700">Requiere bloqueo de dispositivo</label>
          </div>
          <div className="flex items-center mt-2">
            <input
              type="checkbox"
              id="is_service"
              name="is_service"
              checked={formData.is_service}
              onChange={handleChange}
              className="form-checkbox h-5 w-5 text-emerald-600 rounded"
            />
            <label htmlFor="is_service" className="ml-2 text-sm font-medium text-gray-700">Es un servicio</label>
          </div>
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
          className="bg-emerald-600 text-white py-2 px-4 rounded-lg hover:bg-emerald-700 cursor-pointer text-sm"
          disabled={loading}
        >
          {loading ? <FaSpinner className="animate-spin mx-auto" /> : (initialData ? 'Actualizar' : 'Guardar')}
        </button>
      </div>
    </form>
  );
};

export default ProductsForm;