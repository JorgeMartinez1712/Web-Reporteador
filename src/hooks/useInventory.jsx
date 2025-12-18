import { useState, useEffect, useCallback, useRef } from 'react';
import axiosInstance from '../api/axiosInstance';

const useInventory = (options = {}) => {
  const {
    autoFetchInitialData = true,
    autoFetchProducts = true,
    autoFetchRetailUnits = true,
    autoFetchInventoryStatuses = true,
    autoFetchAllInventories = true,
  } = options;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [products, setProducts] = useState([]);
  const [inventories, setInventories] = useState([]);
  const [retailUnits, setRetailUnits] = useState([]);
  const [productInventoryStatuses, setProductInventoryStatuses] = useState([]);
  const [productInventories, setProductInventories] = useState([]);
  const didInitRef = useRef(false);

  const fetchProducts = useCallback(async () => {
    try {
      const response = await axiosInstance.get('/products');
      setProducts(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      setError(err.friendlyMessage || err.response?.data?.message || 'Error al cargar los productos.');
      setProducts([]);
    }
  }, []);

  const fetchRetailUnits = useCallback(async () => {
    try {
      const response = await axiosInstance.get('/retail-units');
      setRetailUnits(response.data?.data || []);
    } catch (err) {
      setError(err.friendlyMessage || err.response?.data?.message || 'Error al cargar las sucursales.');
      setRetailUnits([]);
    }
  }, []);

  const fetchProductInventoryStatuses = useCallback(async () => {
    try {
      const response = await axiosInstance.get('/inventory-statuses/index');
      setProductInventoryStatuses(response.data.data || []);
    } catch (err) {
      setError(err.friendlyMessage || err.response?.data?.message || 'Error al cargar los estados de inventario.');
      setProductInventoryStatuses([]);
    }
  }, []);

  const fetchInventoriesByRetailUnit = useCallback(async (id) => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get(`/product-inventory/retail-unit/${id}`);
      setInventories(response.data || { retail_unit_id: id, products: [] });
      return response.data;
    } catch (err) {
      console.error('Error al obtener los inventarios por sucursal:', err);
      setError('Error al cargar los inventarios de la sucursal.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchProductInventories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get('/product-inventories');
      setProductInventories(Array.isArray(response.data) ? response.data : []);
      return response.data;
    } catch (err) {
      setError(err.friendlyMessage || err.response?.data?.message || 'Error al cargar los inventarios.');
      setProductInventories([]);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const importInventory = async (formData) => {
    setError(null);
    try {
      setLoading(true);
      const response = await axiosInstance.post(
        '/product-electronic-imei',
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
      setError(err.response?.data?.message || 'Error al importar el inventario');
      throw err;
    }
  };

  const registerInventory = async (formData) => {
    setLoading(true);
    setError(null);
    try {
      await axiosInstance.post('/product-inventories', formData);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al registrar el dispositivo');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateInventory = async (updatedData) => {
    setLoading(true);
    setError(null);
    try {
      await axiosInstance.post('/product-inventories/update', updatedData);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al actualizar el dispositivo');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteInventory = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await axiosInstance.delete(`/product-inventories/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al eliminar el dispositivo');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!autoFetchInitialData) {
      setLoading(false);
      return;
    }
    if (didInitRef.current) return;
    didInitRef.current = true;
    const tasks = [];
  if (autoFetchProducts) tasks.push(fetchProducts());
  if (autoFetchRetailUnits) tasks.push(fetchRetailUnits());
  if (autoFetchInventoryStatuses) tasks.push(fetchProductInventoryStatuses());
  if (autoFetchAllInventories) tasks.push(fetchProductInventories());
    setLoading(true);
    setError(null);
    Promise.all(tasks)
      .catch(() => setError('Error al cargar datos iniciales de dispositivos.'))
      .finally(() => setLoading(false));
  }, [autoFetchInitialData, autoFetchProducts, autoFetchRetailUnits, autoFetchInventoryStatuses, autoFetchAllInventories, fetchProducts, fetchRetailUnits, fetchProductInventoryStatuses, fetchProductInventories]);

  return {
    products,
    retailUnits,
    productInventoryStatuses,
    productInventories,
    inventories,
    loading,
    error,
    registerInventory,
    updateInventory,
    deleteInventory,
    fetchInventoriesByRetailUnit,
    fetchProducts,
    fetchRetailUnits,
    fetchProductInventoryStatuses,
    importInventory,
    fetchProductInventories,
  };
};

export default useInventory;