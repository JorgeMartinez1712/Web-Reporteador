import { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../api/axiosInstance';

const usePromotions = (options = {}) => {
  const { includeRelated = true, includeStatuses = true } = options;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [promotions, setPromotions] = useState([]);
  const [promotionStatuses, setPromotionStatuses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [products, setProducts] = useState([]);
  const [financingPlans, setFinancingPlans] = useState([]);
  const [retails, setRetails] = useState([]);
  const [retailUnitsByRetail, setRetailUnitsByRetail] = useState({});
  const [retailUnitsLoading, setRetailUnitsLoading] = useState({});

  const fetchPromotions = useCallback(async () => {
    try {
      const response = await axiosInstance.get('/promotions/index');
      setPromotions(response.data.data || []);
    } catch (err) {
      console.error('Error al obtener las promociones:', err);
      setError('Error al cargar las promociones.');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchRelatedData = useCallback(async () => {
    setLoading(true);
    try {
      const requests = [
        axiosInstance.get('/categories'),
        axiosInstance.post('/brands/index'),
        axiosInstance.get('/products'),
        axiosInstance.get('/financing-plans'),
        axiosInstance.post('/retails/index'),
      ];

      if (includeStatuses) {
        requests.unshift(axiosInstance.get('/promotion-statuses'));
      }

      const results = await Promise.allSettled(requests);

      let statusesRes, categoriesRes, brandsRes, productsRes, financingPlansRes, retailsRes;

      if (includeStatuses) {
        [statusesRes, categoriesRes, brandsRes, productsRes, financingPlansRes, retailsRes] = results;
      } else {
        [categoriesRes, brandsRes, productsRes, financingPlansRes, retailsRes] = results;
      }

      const normalize = (res) => {
        if (!res || res.status !== 'fulfilled') return [];
        const responseData = res.value;
        if (Array.isArray(responseData)) return responseData;
        return responseData?.data ?? [];
      };

      if (includeStatuses) {
        setPromotionStatuses(normalize(statusesRes));
      }
      setCategories(normalize(categoriesRes));
      setBrands(normalize(brandsRes));
      setProducts(normalize(productsRes));
      setFinancingPlans(normalize(financingPlansRes));

      const retailsData = normalize(retailsRes);
      setRetails((retailsData || []).map(retail => ({
        id: retail.id,
        name: retail.legal_name,
      })) || []);
    } catch (err) {
      console.error('Error inesperado en fetchRelatedData:', err);
      setError('Error inesperado al cargar datos relacionados.');
    } finally {
      setLoading(false);
    }
  }, [includeStatuses]);

  const fetchRetailUnitsByRetailId = useCallback(async (retailId) => {
    setRetailUnitsLoading(prev => {
      if (prev[retailId]) {
        return prev;
      }
      return { ...prev, [retailId]: true };
    });

    try {
      const response = await axiosInstance.get(`/retails/${retailId}/units`);
      const units = response.data.units.map(unit => ({
        id: unit.id,
        name: unit.name || unit.legal_name || unit.comercial_name,
      }));
      setRetailUnitsByRetail(prev => ({
        ...prev,
        [retailId]: units,
      }));
      return units;
    } catch (err) {
      console.error(`Error al obtener sucursales para la empresa con ID ${retailId}:`, err);
      setError('Error al cargar sucursales.');
      return [];
    } finally {
      setRetailUnitsLoading(prev => ({ ...prev, [retailId]: false }));
    }
  }, []);

  const getPromotionById = useCallback(async (id) => {
    try {
      const response = await axiosInstance.post(`/promotions/show`, { id });
      const promotionData = response.data.data?.promotion?.[0];
      if (!promotionData) {
        throw new Error('Promoción no encontrada.');
      }

      const unitsByRetail = (response.data.data.retails || []).reduce((acc, retail) => {
        acc[retail.id] = [];
        return acc;
      }, {});

      (response.data.data.units || []).forEach(unit => {
        if (unitsByRetail[unit.retail_id]) {
          unitsByRetail[unit.retail_id].push({
            id: unit.id,
            name: unit.name || unit.legal_name || unit.comercial_name,
          });
        }
      });

      setRetailUnitsByRetail(prev => ({ ...prev, ...unitsByRetail }));

      return {
        ...promotionData,
        retails: response.data.data.retails || [],
        categories: response.data.data.categories || [],
        units: response.data.data.units || [],
      };
    } catch (err) {
      console.error(`Error al obtener la promoción con ID ${id}:`, err);
      setError('Error al cargar los detalles de la promoción.');
      return null;
    }
  }, []);

  const registerPromotion = async (formData) => {
    setError(null);
    try {
      const dataToSend = {
        ...formData,
        promotion_status_id: parseInt(formData.promotion_status_id),
        retail_ids: formData.retail_ids?.map(Number) || [],
        retail_unit_ids: Object.values(formData.retail_unit_ids || {}).flat().map(Number),
        category_ids: formData.category_ids?.map(Number) || [],
      };

      const response = await axiosInstance.post('/promotions/save', dataToSend);
      
      if (response.data.success === false) {
        let errorMessage = response.data.message || 'Error al registrar la promoción';
        if (response.data.errors) {
             const errorDetails = Object.values(response.data.errors).flat().join(' ');
             if (errorDetails) {
                 errorMessage = errorDetails;
             }
        }
        throw new Error(errorMessage);
      }

      setPromotions(prev => [...prev, response.data.data]);
      return response.data;
    } catch (err) {
      const msg = err.message || err.response?.data?.message || 'Error al registrar la promoción';
      setError(msg);
      throw new Error(msg);
    }
  };

  const updatePromotion = async (id, updatedData) => {
    setError(null);
    try {
      const dataToSend = {
        ...updatedData,
        id: id,
        promotion_status_id: parseInt(updatedData.promotion_status_id),
        retail_ids: updatedData.retail_ids?.map(Number) || [],
        retail_unit_ids: Object.values(updatedData.retail_unit_ids || {}).flat().map(Number),
        category_ids: updatedData.category_ids?.map(Number) || [],
      };

      const response = await axiosInstance.post(`/promotions/update`, dataToSend);

      if (response.data.success === false) {
        let errorMessage = response.data.message || 'Error al actualizar la promoción';
        if (response.data.errors) {
             const errorDetails = Object.values(response.data.errors).flat().join(' ');
             if (errorDetails) {
                 errorMessage = errorDetails;
             }
        }
        throw new Error(errorMessage);
      }

      setPromotions(prev =>
        prev.map(promo => (promo.id === id ? response.data.data : promo))
      );
      return response.data;
    } catch (err) {
      const msg = err.message || err.response?.data?.message || 'Error al actualizar la promoción';
      setError(msg);
      throw new Error(msg);
    }
  };

  const deletePromotion = async (id) => {
    setError(null);
    try {
      await axiosInstance.delete(`/promotions/${id}`);
      setPromotions(prev => prev.filter(promo => promo.id !== id));
    } catch (err) {
      setError(err.response?.data?.message || 'Error al eliminar la promoción');
      throw err;
    }
  };

  const uploadPromotionImage = async (promotionId, file) => {
    setError(null);
    const formData = new FormData();
    formData.append('promotion_id', promotionId);
    formData.append('image_file', file);
    try {
      const response = await axiosInstance.post('/promotions/uploadImagen', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (err) {
      const message = err.response?.data?.message || err.response?.data?.error || 'Error al subir la imagen';
      setError(message);
      throw err;
    }
  };

  useEffect(() => {
    if (includeRelated) {
      fetchRelatedData();
    } else {
      fetchPromotions();
    }
  }, [fetchPromotions, fetchRelatedData, includeRelated]);

  return {
    promotions,
    loading,
    error,
    fetchPromotions,
    registerPromotion,
    updatePromotion,
    deletePromotion,
    getPromotionById,
    promotionStatuses,
    categories,
    brands,
    products,
    financingPlans,
    retails,
    retailUnitsByRetail,
    fetchRetailUnitsByRetailId,
    retailUnitsLoading,
    uploadPromotionImage,
  };
};

export default usePromotions;