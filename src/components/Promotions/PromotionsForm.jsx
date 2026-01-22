import { useState, useEffect, useCallback } from 'react';
import UploadImage from '../common/UploadImage';
import { FaSpinner } from 'react-icons/fa';
import WarningNotification from '../common/WarningNotification';
import PromotionConditionsEditor from './PromotionConditionsEditor';
import PromotionGeneralFields from './PromotionGeneralFields';
import PromotionFinancialFields from './PromotionFinancialFields';
import PromotionTargetingFields from './PromotionTargetingFields';

const PromotionsForm = ({
  onSubmit,
  loading,
  initialData = null,
  onCancel,
  isCreating = false,
  isEditing = false,
  categories,
  brands,
  products,
  financingPlans,
  retails,
  fetchRetailUnitsByRetailId,
  retailUnitsByRetail,
  retailUnitsLoading,
  promotionStatuses,
  imageUploadEnabled = false,
  imageUrl = null,
  onImageSelect = null,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    start_date: '',
    end_date: '',
    is_active: isCreating ? true : false,
    promotion_status_id: 2,
    conditions: {
      global: {
        min_amount: '',
        interest_rate: '',
        grace_period_days: '',
      },
      financing_plan: '[]',
    },
    retail_ids: [],
    retail_unit_ids: {},
    category_ids: [],
  });

  const [showWarningNotification, setShowWarningNotification] = useState(false);
  const [warningMessage, setWarningMessage] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        description: initialData.description || '',
        start_date: initialData.start_date ? initialData.start_date.split('T')[0] : '',
        end_date: initialData.end_date ? initialData.end_date.split('T')[0] : '',
        is_active: initialData.is_active,
        promotion_status_id: initialData.promotion_status_id || '',
        conditions: {
          global: {
            min_amount: initialData.conditions?.global?.min_amount || '',
            interest_rate: initialData.conditions?.global?.interest_rate ?? '',
            grace_period_days: initialData.conditions?.global?.grace_period_days ?? '',
          },
          financing_plan: initialData.conditions?.financing_plan ? JSON.stringify(initialData.conditions.financing_plan) : '[]',
        },
        retail_ids: initialData.retails?.map(r => String(r.id)) || [],
        retail_unit_ids: initialData.retail_unit_ids || {},
        category_ids: initialData.categories?.map(c => String(c.id)) || [],
      });
    } else if (isCreating) {
      setFormData((prev) => ({
        ...prev,
        name: '',
        description: '',
        start_date: '',
        end_date: '',
        is_active: true,
        promotion_status_id: 2,
        conditions: {
          global: {
            min_amount: '',
            interest_rate: '',
            grace_period_days: '',
          },
          financing_plan: '[]',
        },
        retail_ids: [],
        retail_unit_ids: {},
        category_ids: [],
      }));
    }
  }, [initialData, isCreating]);

  useEffect(() => {
    if (initialData) {
      const selectedRetailIds = initialData.retails?.map(r => String(r.id)) || [];
      selectedRetailIds.forEach(retailId => {
        fetchRetailUnitsByRetailId(retailId);
      });
    }
  }, [initialData, fetchRetailUnitsByRetailId]);

  useEffect(() => {
    formData.retail_ids.forEach(retailId => {
      if (!retailUnitsByRetail[retailId]) {
        fetchRetailUnitsByRetailId(retailId);
      }
    });
  }, [formData.retail_ids, fetchRetailUnitsByRetailId, retailUnitsByRetail]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.includes('.')) {
      const [parent, child, grandChild] = name.split('.');
      setFormData((prev) => {
        if (grandChild) {
          return {
            ...prev,
            [parent]: {
              ...prev[parent],
              [child]: {
                ...prev[parent][child],
                [grandChild]: type === 'checkbox' ? checked : value,
              },
            },
          };
        } else {
          return {
            ...prev,
            [parent]: {
              ...prev[parent],
              [child]: type === 'checkbox' ? checked : value,
            },
          };
        }
      });
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }
  };

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMultiSelectChipsChange = (e) => {
    const { name, value } = e.target;
    if (name === "retail_ids") {
      setFormData((prev) => {
        const newRetailUnits = value.reduce((acc, retailId) => {
          if (prev.retail_unit_ids[retailId]) {
            acc[retailId] = prev.retail_unit_ids[retailId];
          } else {
            acc[retailId] = [];
          }
          return acc;
        }, {});
        return {
          ...prev,
          [name]: value,
          retail_unit_ids: newRetailUnits,
        };
      });
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleRetailUnitsChange = (retailId) => (e) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      retail_unit_ids: {
        ...prev.retail_unit_ids,
        [retailId]: value,
      },
    }));
  };

  const handleJSONConditionsChange = (name) => (jsonString) => {
    setFormData((prev) => ({
      ...prev,
      conditions: {
        ...prev.conditions,
        [name]: jsonString,
      },
    }));
  };

  const handleShowWarning = useCallback((message) => {
    setWarningMessage(message);
    setShowWarningNotification(true);
    setTimeout(() => {
      setShowWarningNotification(false);
      setWarningMessage('');
    }, 5000);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    const startDate = new Date(formData.start_date);
    const endDate = new Date(formData.end_date);

    if (startDate > endDate) {
      handleShowWarning('La fecha de inicio no puede ser mayor que la fecha de fin.');
      return;
    }

    const dataToSend = { ...formData };
    const allRetailUnitIds = Object.values(formData.retail_unit_ids).flat();
    dataToSend.retail_unit_ids = allRetailUnitIds;

    try {
      const plan = formData.conditions?.financing_plan;
      if (typeof plan === 'string') {
        dataToSend.conditions.financing_plan = JSON.parse(plan || '[]');
      } else if (Array.isArray(plan)) {
        dataToSend.conditions.financing_plan = plan;
      } else {
        dataToSend.conditions.financing_plan = [];
      }
    } catch (error) {
      console.error('Error parseando financing_plan:', error);
      dataToSend.conditions.financing_plan = [];
    }

    if ((isCreating || isEditing)) {
      const hasFinancingConditions = Array.isArray(dataToSend.conditions?.financing_plan) && dataToSend.conditions.financing_plan.length > 0;
      if (!hasFinancingConditions) {
        handleShowWarning('Debes agregar al menos una condición por plan.');
        return;
      }

      for (let i = 0; i < dataToSend.conditions.financing_plan.length; i++) {
        const condition = dataToSend.conditions.financing_plan[i];
        const index = i + 1;

        if (!condition.financing_plan_id) {
          handleShowWarning(`La condición #${index} debe tener un Plan de Financiamiento seleccionado.`);
          return;
        }
        if (!condition.brand_id || (Array.isArray(condition.brand_id) && condition.brand_id.length === 0)) {
          handleShowWarning(`La condición #${index} debe tener al menos una Marca seleccionada.`);
          return;
        }
        if (!condition.products || (Array.isArray(condition.products) && condition.products.length === 0)) {
          handleShowWarning(`La condición #${index} debe tener al menos un Producto seleccionado.`);
          return;
        }
        if (!condition.installments) {
          handleShowWarning(`La condición #${index} debe tener Cuotas definidas.`);
          return;
        }
        if (condition.down_payment === '' || condition.down_payment === null || condition.down_payment === undefined) {
          handleShowWarning(`La condición #${index} debe tener un Monto Inicial.`);
          return;
        }
        if (condition.credit_limit === '' || condition.credit_limit === null || condition.credit_limit === undefined) {
          handleShowWarning(`La condición #${index} debe tener un Límite de Crédito.`);
          return;
        }
      }
    }

    if (dataToSend.conditions.global.min_amount === '') {
      delete dataToSend.conditions.global.min_amount;
    }
    if (dataToSend.conditions.global.interest_rate === '') {
      delete dataToSend.conditions.global.interest_rate;
    }
    if (dataToSend.conditions.global.grace_period_days === '') {
      delete dataToSend.conditions.global.grace_period_days;
    }

    if (Object.keys(dataToSend.conditions.global).length === 0) {
      delete dataToSend.conditions.global;
    }
    if (dataToSend.conditions.financing_plan.length === 0) {
      delete dataToSend.conditions.financing_plan;
    }
    if (isEditing && initialData?.id) {
      dataToSend.id = initialData.id;
    }
    onSubmit(dataToSend);
  };

  const handleCancelClick = () => {
    if (onCancel) {
      onCancel();
    }
  };

  const isDisabled = !isCreating && !isEditing;

  return (
    <form id="promotion-form" onSubmit={handleSubmit} className="w-full flex flex-col px-8 overflow-y-auto">
      <WarningNotification
        isOpen={showWarningNotification}
        message={warningMessage}
        onClose={() => setShowWarningNotification(false)}
      />
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <PromotionGeneralFields
          formData={formData}
          handleChange={handleChange}
          disabled={isDisabled}
          isCreating={isCreating}
        />
        <PromotionFinancialFields
          formData={formData}
          handleChange={handleChange}
          handleSelectChange={handleSelectChange}
          financingPlans={financingPlans}
          promotionStatuses={promotionStatuses} 
          disabled={isDisabled}
          isCreating={isCreating}
        />
        <PromotionTargetingFields
          formData={formData}
          handleMultiSelectChipsChange={handleMultiSelectChipsChange}
          categories={categories}
          retails={retails}
          retailUnitsByRetail={retailUnitsByRetail}
          retailUnitsLoading={retailUnitsLoading}
          handleRetailUnitsChange={handleRetailUnitsChange}
          disabled={isDisabled}
          isCreating={isCreating}
        />
        {imageUploadEnabled && (
          <div className="md:col-span-full lg:col-span-3">
            <h3 className="text-lg font-semibold mb-2 mt-4 text-left">Imagen de la Promoción</h3>
            <UploadImage
              onImageSelect={onImageSelect}
              imageUrl={imageUrl}
              disabled={isDisabled}
              idPrefix="promotion-image"
              className="w-full"
            />
          </div>
        )}
        <div className="md:col-span-full lg:col-span-3">
          <h3 className="text-lg font-semibold mb-2 mt-4 text-left">
            Condiciones por Plan de Financiamiento {isCreating && <span className="text-red-500">*</span>}
          </h3>
          <PromotionConditionsEditor
            value={formData.conditions.financing_plan}
            onChange={handleJSONConditionsChange('financing_plan')}
            brands={brands}
            products={products}
            financingPlans={financingPlans}
            disabled={loading || isDisabled}
          />
        </div>
      </div>
      {isCreating && (
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
      )}
    </form>
  );
};

export default PromotionsForm;