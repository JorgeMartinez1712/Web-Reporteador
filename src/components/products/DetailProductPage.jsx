import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useProducts from '../../hooks/useProducts';
import SuccessNotification from '../../components/common/SuccessNotification';
import ErrorNotification from '../../components/common/ErrorNotification';
import ProductHeader from '../../components/products/ProductHeader';
import ProductForm from '../../components/products/ProductForm';
import ProductLoading from '../../components/products/ProductLoading';
import ProductInventorySection from '../../components/products/ProductInventorySection';

const DetailProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    retailers,
    categories,
    brands,
    productStatuses,
    currencies,
    loading: hookLoading,
    updateProduct,
    fetchProductById,
  } = useProducts({
    autoFetchProducts: false,
    autoFetchCategories: true,
    autoFetchBrands: true,
    autoFetchStatuses: true,
  });

  const [product, setProduct] = useState(null);
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showErrorNotification, setShowErrorNotification] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);

  const [formData, setFormData] = useState({
    sku: '',
    name: '',
    description: '',
    base_price: '',
    retailer_id: '',
    category_id: '',
    brand_id: '',
    status_id: '',
    model: '',
    requires_device_lock: false,
    is_service: false,
    currency_id: '',
  });
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [currentImageUrl, setCurrentImageUrl] = useState('');

  const fetchProductData = useCallback(async () => {
    if (hookLoading) return;

    setLoading(true);
    try {
      const responseData = await fetchProductById(id);
      if (responseData && responseData.product) {
        setProduct(responseData.product);
        setDevices(responseData.devices || []);
        setFormData({
          sku: responseData.product.sku || '',
          name: responseData.product.name || '',
          description: responseData.product.description || '',
          base_price: responseData.product.base_price || '',
          retailer_id: responseData.product.retailer_id || '',
          category_id: responseData.product.category_id || '',
          inventario: responseData.product.inventario || '',
          brand_id: responseData.product.brand_id || '',
          status_id: responseData.product.product_status_id || '',
          model: responseData.product.model || '',
          requires_device_lock: responseData.product.requires_device_lock || false,
          is_service: responseData.product.is_service || false,
          currency_id: responseData.product.currency_id || '',
        });

        const imageFilePath = responseData.product.image_file;
        const fullImageUrl = imageFilePath ? imageFilePath : '';
        setCurrentImageUrl(fullImageUrl);

        setLoading(false);
      } else {
        navigate('/404', { replace: true });
      }
    } catch (err) {
      setErrorMessage('Error al cargar los datos del producto.');
      setShowErrorNotification(true);
      setLoading(false);
    }
  }, [id, hookLoading, navigate, fetchProductById]);

  useEffect(() => {
    fetchProductData();
  }, [fetchProductData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleImageSelect = (file) => {
    setSelectedImageFile(file);
    if (file) {
      setCurrentImageUrl(URL.createObjectURL(file));
    } else {
      const originalUrl = product?.image_file ? product.image_file : '';
      setCurrentImageUrl(originalUrl);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaveLoading(true);
    setErrorMessage('');
    setShowErrorNotification(false);
    setSuccessMessage('');
    setShowSuccessNotification(false);

    const payload = new FormData();
    payload.append('sku', formData.sku);
    payload.append('name', formData.name);
    payload.append('description', formData.description);
    payload.append('model', formData.model);
    payload.append('base_price', parseFloat(formData.base_price).toFixed(2));
    payload.append('retailer_id', Number(formData.retailer_id));
    payload.append('category_id', Number(formData.category_id));
    payload.append('brand_id', Number(formData.brand_id));
    payload.append('product_status_id', Number(formData.status_id));
    payload.append('currency_id', Number(formData.currency_id));

    payload.append('requires_device_lock', formData.requires_device_lock);
    payload.append('is_service', formData.is_service);

    if (selectedImageFile) {
      payload.append('image_file', selectedImageFile);
    } else if (currentImageUrl === '' && product.image_file !== '') {
      payload.append('image_file', 'null');
    } else if (currentImageUrl === '' && product.image_file === '') {
    }


    try {
      await updateProduct(id, payload);
      setSuccessMessage('¡Producto actualizado con éxito!');
      setShowSuccessNotification(true);
      setTimeout(() => setShowSuccessNotification(false), 3000);
      setIsEditing(false);

      await fetchProductData();
      setSelectedImageFile(null);

    } catch (error) {
      console.error('Error al actualizar el producto:', error);
      setErrorMessage(error.response?.data?.message || 'Error al actualizar el producto. Inténtalo de nuevo.');
      setShowErrorNotification(true);
    } finally {
      setSaveLoading(false);
    }
  };

  const handleCancelEdit = () => {
    if (product) {
      setFormData({
        sku: product.sku || '',
        name: product.name || '',
        description: product.description || '',
        base_price: product.base_price || '',
        retailer_id: product.retailer_id || '',
        category_id: product.category_id || '',
        brand_id: product.brand_id || '',
        status_id: product.product_status_id || '',
        model: product.model || '',
        requires_device_lock: product.requires_device_lock || false,
        is_service: product.is_service || false,
        currency_id: product.currency_id || '',
      });

      const imageFilePath = product.image_file;
      const fullImageUrl = imageFilePath ? imageFilePath : '';
      setCurrentImageUrl(fullImageUrl);
    }
    setSelectedImageFile(null);
    setIsEditing(false);
    setErrorMessage('');
    setShowErrorNotification(false);
    setSuccessMessage('');
    setShowSuccessNotification(false);
  };

  if (loading || hookLoading) {
    return <ProductLoading />;
  }

  if (!product) {
    return null;
  }

  return (
    <div className="p-8">
      <ProductHeader
        productName={product.name}
        isEditing={isEditing}
        onEditClick={() => setIsEditing(true)}
        onSaveClick={handleSubmit}
        onCancelClick={handleCancelEdit}
        saveLoading={saveLoading}
      />

  <ErrorNotification isOpen={showErrorNotification} message={errorMessage} onClose={() => setShowErrorNotification(false)} />
      <SuccessNotification isOpen={showSuccessNotification} message={successMessage} />

      <ProductForm
        formData={formData}
        handleChange={handleChange}
        handleImageSelect={handleImageSelect}
        isEditing={isEditing}
        retailers={retailers}
        categories={categories}
        brands={brands}
        productStatuses={productStatuses}
        currencies={currencies}
        currentImageUrl={currentImageUrl}
      />

      <div className="mt-12 pt-8 border-t border-gray-200">
        <ProductInventorySection
          devices={devices}
          onInventoryUpdated={fetchProductData}
          productId={id}
        />
      </div>
    </div>
  );
};

export default DetailProductPage;