import { useState } from 'react';
import CustomModal from '../common/CustomModal';
import ProductsForm from './ProductsForm';

const ProductsModal = ({
  categories = [],
  brands = [],
  onProductCreated,
  registerProduct,
  loading,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleModal = () => {
    setIsOpen((prev) => !prev);
  };

  const handleSubmit = async (formData) => {
    try {
      await registerProduct(formData);
      if (onProductCreated) onProductCreated();
      toggleModal();
    } catch (error) {
      console.error('Error al registrar el producto:', error);
    }
  };

  return (
    <>
      <button
        onClick={toggleModal}
        className="bg-oscuro text-white py-2 px-4 rounded-lg hover:bg-hover cursor-pointer"
      >
        Registrar
      </button>
      <CustomModal isOpen={isOpen} onClose={toggleModal} title="Registrar Producto">
        <ProductsForm
          categories={categories}
          brands={brands}
          onSubmit={handleSubmit}
          loading={loading}
          onCancel={toggleModal}
        />
      </CustomModal>
    </>
  );
};

export default ProductsModal;