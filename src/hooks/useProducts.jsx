import { useState, useEffect, useCallback, useRef } from 'react';
import axiosInstance from '../api/axiosInstance';

const useProducts = ({
  autoFetchProducts = true,
  autoFetchCategories = true,
  autoFetchBrands = true,
  autoFetchStatuses = true,
} = {}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [productStatuses, setProductStatuses] = useState([]);
  const didInitRef = useRef(false);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await axiosInstance.get('/categories');
      setCategories(response.data || []);
    } catch (err) {
      setError(err.friendlyMessage || err.response?.data?.message || 'Error al obtener categorías');
    }
  }, []);

  const fetchBrands = useCallback(async () => {
    try {
      const response = await axiosInstance.post('/brands/index');
      setBrands(response.data || []);
    } catch (err) {
      setError(err.friendlyMessage || err.response?.data?.message || 'Error al obtener las marcas');
    }
  }, []);

  const fetchProductStatuses = useCallback(async () => {
    try {
      const response = await axiosInstance.get('/product-statuses');
      setProductStatuses(response.data.data || []);
    } catch (err) {
      setError(err.friendlyMessage || err.response?.data?.message || 'Error al obtener estados de producto');
    }
  }, []);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/products');
      setProducts(response.data || []);
    } catch (err) {
      setError(err.friendlyMessage || err.response?.data?.message || 'Error al cargar los productos.');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchProductById = useCallback(async (productId) => {
    try {
      const response = await axiosInstance.get(`/products/${productId}`);
      return response.data;
    } catch (err) {
      setError(err.friendlyMessage || err.response?.data?.message || 'Error al cargar los detalles del producto.');
      throw err;
    }
  }, []);

  const registerProduct = async (formData) => {
    setError(null);
    try {
      const response = await axiosInstance.post('/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (err) {
      setError(err.friendlyMessage || err.response?.data?.message || 'Error al registrar el producto');
      throw err;
    }
  };

  const updateProduct = async (id, updatedData) => {
    setError(null);
    try {
      const response = await axiosInstance.post(`/products/${id}`, updatedData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        params: {
          _method: 'PUT',
        },
      });
      return response.data;
    } catch (err) {
      setError(err.friendlyMessage || err.response?.data?.message || 'Error al actualizar el producto');
      throw err;
    }
  };

  const deleteProduct = async (id) => {
    setError(null);
    try {
      await axiosInstance.delete(`/products/${id}`);
    } catch (err) {
      setError(err.friendlyMessage || err.response?.data?.message || 'Error al eliminar el producto');
      throw err;
    }
  };

  const importProducts = async (formData) => {
    setError(null);
    try {
      setLoading(true);
      const response = await axiosInstance.post(
        '/product-electronic-imports',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      setLoading(false);
      return response.data;
    } catch (err) {
      setLoading(false);
      setError(
        err.response?.data?.message || 'Error al importar los productos'
      );
      throw err;
    }
  };

  useEffect(() => {
    if (didInitRef.current) return;
    didInitRef.current = true;
    setLoading(true);
    setError(null);
    const tasks = [];
    if (autoFetchCategories) tasks.push(fetchCategories());
    if (autoFetchBrands) tasks.push(fetchBrands());
    if (autoFetchStatuses) tasks.push(fetchProductStatuses());
    Promise.allSettled(tasks).finally(() => {
      if (autoFetchProducts) {
        fetchProducts();
      } else {
        setLoading(false);
      }
    });
  }, [autoFetchProducts, autoFetchCategories, autoFetchBrands, autoFetchStatuses, fetchProducts, fetchCategories, fetchBrands, fetchProductStatuses]);

  return {
    products,
    categories,
    brands,
    productStatuses,
    loading,
    error,
    fetchProducts,
    fetchCategories,
    fetchBrands,
    fetchProductStatuses,
    fetchProductById,
    registerProduct,
    updateProduct,
    deleteProduct,
    importProducts,
  };
};

export default useProducts;