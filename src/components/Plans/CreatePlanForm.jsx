import { useState, useEffect } from 'react';
import { FaSpinner } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import usePlans from '../../hooks/usePlans';
import ErrorNotification from '../common/ErrorNotification';
import BrandConditionsEditor from '../common/BrandConditionsEditor';

const CreatePlanForm = ({ onPlanCreated, setGlobalSuccessMessage, setGlobalErrorMessage }) => {
  const { createPlan, loading, error: hookError, brands, levels } = usePlans({ initial: ['brands', 'levels'] });
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    financier_id: 1,
    status_id: 2,
    name: '',
    description: '',
    level_id: '',
    interest_rate: '',
    late_fee_rate: '',
    late_fee_fixed: '',
    grace_period_days: '',
    processing_fee_rate: '',
    processing_fee_fixed: '',
    min_down_payment_rate: '',
    min_down_payment_fixed: '',
    max_financing_amount: '',
    cuotas: '',
    installment_frecuency: '',
    brand_conditions: '[]',
    block_days_penalty: '',
    block_penalty_rate: '',
    block_penalty_fixed: '',
  });

  useEffect(() => {
    if (levels && levels.length > 0) {
      setFormData(prev => ({
        ...prev,
        level_id: levels[0].id
      }));
    }
  }, [levels]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBrandConditionsChange = (jsonValue) => {
    setFormData((prev) => ({ ...prev, brand_conditions: jsonValue }));
  };

  const formatValidationErrors = (errors) => {
    let message = '';
    for (const key in errors) {
      if (Object.hasOwnProperty.call(errors, key)) {
        message += `${errors[key].join(', ')}\n`;
      }
    }
    return message.trim();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGlobalSuccessMessage(null);
    setGlobalErrorMessage(null);

    try {
      const payload = {
        financier_id: parseInt(formData.financier_id, 10),
        status_id: 2,
        name: formData.name,
        description: formData.description,
        level_id: parseInt(formData.level_id, 10),
        interest_rate: parseFloat(formData.interest_rate),
        late_fee_rate: formData.late_fee_rate ? parseFloat(formData.late_fee_rate) : null,
        late_fee_fixed: formData.late_fee_fixed ? parseFloat(formData.late_fee_fixed) : null,
        grace_period_days: formData.grace_period_days ? parseInt(formData.grace_period_days, 10) : null,
        processing_fee_rate: formData.processing_fee_rate ? parseFloat(formData.processing_fee_rate) : null,
        processing_fee_fixed: formData.processing_fee_fixed ? parseFloat(formData.processing_fee_fixed) : null,
        min_down_payment_rate: formData.min_down_payment_rate ? parseFloat(formData.min_down_payment_rate) : null,
        min_down_payment_fixed: formData.min_down_payment_fixed ? parseFloat(formData.min_down_payment_fixed) : null,
        max_financing_amount: parseFloat(formData.max_financing_amount),
        cuotas: formData.cuotas ? parseInt(formData.cuotas, 10) : null,
        installment_frecuency: formData.installment_frecuency ? parseInt(formData.installment_frecuency, 10) : null,
        brand_conditions: formData.brand_conditions ? JSON.parse(formData.brand_conditions) : [],
        block_days_penalty: formData.block_days_penalty ? parseInt(formData.block_days_penalty, 10) : null,
        block_penalty_rate: formData.block_penalty_rate ? parseFloat(formData.block_penalty_rate) : null,
        block_penalty_fixed: formData.block_penalty_fixed ? parseFloat(formData.block_penalty_fixed) : null,
      };

      await createPlan(payload);
      setGlobalSuccessMessage('Plan creado exitosamente.');
      if (onPlanCreated) {
        onPlanCreated();
      }
      setFormData({
        financier_id: 1,
        status_id: 2,
        name: '',
        description: '',
        level_id: levels[0]?.id || '',
        interest_rate: '',
        late_fee_rate: '',
        late_fee_fixed: '',
        grace_period_days: '',
        processing_fee_rate: '',
        processing_fee_fixed: '',
        min_down_payment_rate: '',
        min_down_payment_fixed: '',
        max_financing_amount: '',
        cuotas: '',
        installment_frecuency: '',
        brand_conditions: '[]',
        block_days_penalty: '',
        block_penalty_rate: '',
        block_penalty_fixed: '',
      });
      navigate('/planes');
    } catch (err) {
      const apiErrors = err.response?.data?.errors;
      if (apiErrors) {
        const formattedMessage = formatValidationErrors(apiErrors);
        setGlobalErrorMessage(formattedMessage);
      } else {
        setGlobalErrorMessage(err.message || err.response?.data?.message || 'Error al crear el plan.');
      }
      console.error('Error al crear plan:', err);
    }
  };

  const handleCancelClick = () => {
    navigate('/planes');
  };

  const isLateFeeRateDisabled = (formData.late_fee_fixed !== null && formData.late_fee_fixed !== '' && parseFloat(formData.late_fee_fixed) >= 0);
  const isLateFeeFixedDisabled = (formData.late_fee_rate !== null && formData.late_fee_rate !== '' && parseFloat(formData.late_fee_rate) >= 0);

  const isProcessingFeeRateDisabled = (formData.processing_fee_fixed !== null && formData.processing_fee_fixed !== '' && parseFloat(formData.processing_fee_fixed) >= 0);
  const isProcessingFeeFixedDisabled = (formData.processing_fee_rate !== null && formData.processing_fee_rate !== '' && parseFloat(formData.processing_fee_rate) >= 0);

  const isMinDownPaymentRateDisabled = (formData.min_down_payment_fixed !== null && formData.min_down_payment_fixed !== '' && parseFloat(formData.min_down_payment_fixed) >= 0);
  const isMinDownPaymentFixedDisabled = (formData.min_down_payment_rate !== null && formData.min_down_payment_rate !== '' && parseFloat(formData.min_down_payment_rate) >= 0);

  const isBlockPenaltyRateDisabled = (formData.block_penalty_fixed !== null && formData.block_penalty_fixed !== '' && parseFloat(formData.block_penalty_fixed) >= 0);
  const isBlockPenaltyFixedDisabled = (formData.block_penalty_rate !== null && formData.block_penalty_rate !== '' && parseFloat(formData.block_penalty_rate) >= 0);

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full flex flex-col items-center justify-center px-8 overflow-y-auto"
    >
      {hookError && <ErrorNotification message={hookError} />}
      {loading && (
        <div className="absolute inset-0 flex justify-center items-center bg-white bg-opacity-75 z-50">
          <FaSpinner className="animate-spin text-oscuro text-4xl" />
        </div>
      )}

      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="flex flex-col col-span-full md:col-span-2">
          <label htmlFor="name" className="text-sm font-medium text-gray-700 text-left">
            Nombre del Plan <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg p-2 w-full"
            placeholder="Ej: Plan Básico"
            maxLength="50"
            required
          />
        </div>

        <div className="flex flex-col col-span-full md:col-span-2">
          <label htmlFor="description" className="text-sm font-medium text-gray-700 text-left">
            Descripción <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg p-2 w-full"
            placeholder="Breve descripción del plan de financiamiento"
            maxLength="200"
            required
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="level_id" className="text-sm font-medium text-gray-700 text-left">
            Nivel Mínimo de Cliente <span className="text-red-500">*</span>
          </label>
          <select
            id="level_id"
            name="level_id"
            value={formData.level_id}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg p-2 w-full bg-white"
            required
            disabled={!levels || levels.length === 0}
          >
            {levels && levels.map((level) => (
              <option key={level.id} value={level.id}>
                {level.nivel}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label htmlFor="interest_rate" className="text-sm font-medium text-gray-700 text-left">
            Tasa de Interés (%) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="interest_rate"
            name="interest_rate"
            value={formData.interest_rate}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg p-2 w-full"
            placeholder="Ej: 5.5"
            step="0.01"
            min="0"
            max="100"
            required
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="late_fee_rate" className="text-sm font-medium text-gray-700 text-left">
            Tasa de Mora (%)
          </label>
          <input
            type="number"
            id="late_fee_rate"
            name="late_fee_rate"
            value={formData.late_fee_rate}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg p-2 w-full"
            placeholder="Ej: 2.0"
            step="0.01"
            min="0"
            disabled={isLateFeeRateDisabled}
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="late_fee_fixed" className="text-sm font-medium text-gray-700 text-left">
            Monto Fijo por Mora
          </label>
          <input
            type="number"
            id="late_fee_fixed"
            name="late_fee_fixed"
            value={formData.late_fee_fixed}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg p-2 w-full"
            placeholder="Ej: 10.00"
            step="0.01"
            min="0"
            disabled={isLateFeeFixedDisabled}
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="grace_period_days" className="text-sm font-medium text-gray-700 text-left">
            Días de Gracia
          </label>
          <input
            type="number"
            id="grace_period_days"
            name="grace_period_days"
            value={formData.grace_period_days}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg p-2 w-full"
            placeholder="Ej: 5"
            min="0"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="processing_fee_rate" className="text-sm font-medium text-gray-700 text-left">
            Tasa de Procesamiento (%)
          </label>
          <input
            type="number"
            id="processing_fee_rate"
            name="processing_fee_rate"
            value={formData.processing_fee_rate}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg p-2 w-full"
            placeholder="Ej: 1.5"
            step="0.01"
            min="0"
            disabled={isProcessingFeeRateDisabled}
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="processing_fee_fixed" className="text-sm font-medium text-gray-700 text-left">
            Monto Fijo de Procesamiento
          </label>
          <input
            type="number"
            id="processing_fee_fixed"
            name="processing_fee_fixed"
            value={formData.processing_fee_fixed}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg p-2 w-full"
            placeholder="Ej: 25.00"
            step="0.01"
            min="0"
            disabled={isProcessingFeeFixedDisabled}
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="min_down_payment_rate" className="text-sm font-medium text-gray-700 text-left">
            Tasa de Cuota Inicial Mínima (%)
          </label>
          <input
            type="number"
            id="min_down_payment_rate"
            name="min_down_payment_rate"
            value={formData.min_down_payment_rate}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg p-2 w-full"
            placeholder="Ej: 10.0"
            step="0.01"
            min="0"
            max="100"
            disabled={isMinDownPaymentRateDisabled}
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="min_down_payment_fixed" className="text-sm font-medium text-gray-700 text-left">
            Monto Fijo de Cuota Inicial Mínima
          </label>
          <input
            type="number"
            id="min_down_payment_fixed"
            name="min_down_payment_fixed"
            value={formData.min_down_payment_fixed}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg p-2 w-full"
            placeholder="Ej: 50.00"
            step="0.01"
            min="0"
            disabled={isMinDownPaymentFixedDisabled}
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="max_financing_amount" className="text-sm font-medium text-gray-700 text-left">
            Monto Máximo de Financiamiento <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="max_financing_amount"
            name="max_financing_amount"
            value={formData.max_financing_amount}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg p-2 w-full"
            placeholder="Ej: 50000.00"
            step="0.01"
            min="0"
            required
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="cuotas" className="text-sm font-medium text-gray-700 text-left">
            Cantidad de Cuotas
          </label>
          <input
            type="number"
            id="cuotas"
            name="cuotas"
            value={formData.cuotas}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg p-2 w-full"
            placeholder="Ej: 12"
            min="1"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="installment_frecuency" className="text-sm font-medium text-gray-700 text-left">
            Frecuencia de Cuotas (días)
          </label>
          <input
            type="number"
            id="installment_frecuency"
            name="installment_frecuency"
            value={formData.installment_frecuency}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg p-2 w-full"
            placeholder="Ej: 15"
            min="1"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="block_days_penalty" className="text-sm font-medium text-gray-700 text-left">
            Días de Bloqueo por Penalización
          </label>
          <input
            type="number"
            id="block_days_penalty"
            name="block_days_penalty"
            value={formData.block_days_penalty}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg p-2 w-full"
            placeholder="Ej: 30"
            min="0"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="block_penalty_rate" className="text-sm font-medium text-gray-700 text-left">
            Tasa de Penalización por Bloqueo (%)
          </label>
          <input
            type="number"
            id="block_penalty_rate"
            name="block_penalty_rate"
            value={formData.block_penalty_rate}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg p-2 w-full"
            placeholder="Ej: 0.5"
            step="0.01"
            min="0"
            max="100"
            disabled={isBlockPenaltyRateDisabled}
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="block_penalty_fixed" className="text-sm font-medium text-gray-700 text-left">
            Monto Fijo de Penalización por Bloqueo
          </label>
          <input
            type="number"
            id="block_penalty_fixed"
            name="block_penalty_fixed"
            value={formData.block_penalty_fixed}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg p-2 w-full"
            placeholder="Ej: 20.00"
            step="0.01"
            min="0"
            disabled={isBlockPenaltyFixedDisabled}
          />
        </div>
      </div>

      <div className="w-full flex flex-col items-start mt-4">
        <label className="text-sm font-medium text-gray-700 mb-2 text-left w-full">
          Condiciones por Marca <span className="text-red-500">*</span>
        </label>
        <div className="w-full">
          <BrandConditionsEditor
            value={formData.brand_conditions}
            onChange={handleBrandConditionsChange}
            brands={brands}
            label=""
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

export default CreatePlanForm;