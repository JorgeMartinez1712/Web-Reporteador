import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import usePlans from '../../hooks/usePlans';
import SuccessNotification from '../../components/common/SuccessNotification';
import ErrorNotification from '../../components/common/ErrorNotification';
import PlanDetail from '../../components/Plans/PlanDetail.jsx';
import EditPlanForm from '../../components/Plans/EditPlanForm';
import { FaSpinner } from 'react-icons/fa';

const DetailPlanPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { plans, planStatuses, brands, levels, loading: hookLoading, error: hookError, updatePlan } = usePlans();

  const plan = useMemo(() => {
    if (!id || plans.length === 0) return null;
    return plans.find((p) => p.id === parseInt(id));
  }, [id, plans]);
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(null);
  const formDataRef = useRef(formData);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    formDataRef.current = formData;
  }, [formData]);

  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    if (plan) {
      setFormData({
        financier_id: plan.financier_id || 1,
        status_id: plan.status_id || 1,
        name: plan.name || '',
        description: plan.description || '',
        level_id: plan.level_id || '',
        interest_rate: plan.interest_rate || '',
        late_fee_rate: plan.late_fee_rate || '',
        late_fee_fixed: plan.late_fee_fixed || '',
        grace_period_days: plan.grace_period_days || '',
        processing_fee_rate: plan.processing_fee_rate || '',
        processing_fee_fixed: plan.processing_fee_fixed || '',
        min_down_payment_rate: plan.min_down_payment_rate || '',
        min_down_payment_fixed: plan.min_down_payment_fixed || '',
        max_financing_amount: plan.max_financing_amount || '',
        cuotas: plan.cuotas || '',
        installment_frecuency: plan.installment_frecuency || '',
        indexation_rules: plan.indexation_rules || '',
        conditions: plan.conditions || '',
        brand_conditions: plan.brand_conditions ? JSON.stringify(plan.brand_conditions) : '[]',
        block_days_penalty: plan.block_days_penalty || '',
        block_penalty_rate: plan.block_penalty_rate || '',
        block_penalty_fixed: plan.block_penalty_fixed || '',
      });
    } else if (id && plans.length > 0 && !plan) {
      navigate('/plans');
    }
  }, [plan, id, plans, navigate]);

  useEffect(() => {
    if (hookError) {
      setErrorMessage(hookError);
    }
  }, [hookError]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, errorMessage]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleJsonFieldChange = useCallback((jsonValue) => {
    setFormData((prev) => ({ ...prev, brand_conditions: jsonValue }));
  }, []);

  const handleSubmit = useCallback(async () => {
    setSuccessMessage(null);
    setErrorMessage(null);
    setSaving(true);

    const currentFormData = formDataRef.current;

    if (!plan || !currentFormData) return;

    try {
      const payload = {
        id: plan.id,
        financier_id: parseInt(currentFormData.financier_id, 10),
        status_id: parseInt(currentFormData.status_id, 10),
        name: currentFormData.name,
        description: currentFormData.description,
        level_id: currentFormData.level_id ? parseInt(currentFormData.level_id, 10) : null,
        interest_rate: parseFloat(currentFormData.interest_rate),
        late_fee_rate: currentFormData.late_fee_rate ? parseFloat(currentFormData.late_fee_rate) : null,
        late_fee_fixed: currentFormData.late_fee_fixed ? parseFloat(currentFormData.late_fee_fixed) : null,
        grace_period_days: currentFormData.grace_period_days ? parseInt(currentFormData.grace_period_days, 10) : null,
        processing_fee_rate: currentFormData.processing_fee_rate ? parseFloat(currentFormData.processing_fee_rate) : null,
        processing_fee_fixed: currentFormData.processing_fee_fixed ? parseFloat(currentFormData.processing_fee_fixed) : null,
        min_down_payment_rate: currentFormData.min_down_payment_rate ? parseFloat(currentFormData.min_down_payment_rate) : null,
        min_down_payment_fixed: currentFormData.min_down_payment_fixed ? parseFloat(currentFormData.min_down_payment_fixed) : null,
        max_financing_amount: parseFloat(currentFormData.max_financing_amount),
        cuotas: currentFormData.cuotas ? parseInt(currentFormData.cuotas, 10) : null,
        installment_frecuency: currentFormData.installment_frecuency ? parseInt(currentFormData.installment_frecuency, 10) : null,
        indexation_rules: currentFormData.indexation_rules || null,
        conditions: currentFormData.conditions || null,
        brand_conditions: currentFormData.brand_conditions ? JSON.parse(currentFormData.brand_conditions) : [],
        block_days_penalty: currentFormData.block_days_penalty ? parseInt(currentFormData.block_days_penalty, 10) : null,
        block_penalty_rate: currentFormData.block_penalty_rate ? parseFloat(currentFormData.block_penalty_rate) : null,
        block_penalty_fixed: currentFormData.block_penalty_fixed ? parseFloat(currentFormData.block_penalty_fixed) : null,
      };

      await updatePlan(plan.id, payload);
      setSuccessMessage('Plan actualizado exitosamente.');
      setIsEditing(false);
    } catch (err) {
      setErrorMessage(err.message || err.response?.data?.message || 'Error al actualizar el plan.');
      console.error('Error al actualizar plan:', err);
    } finally {
      setSaving(false);
    }
  }, [plan, updatePlan]);

  const handleCancelEdit = useCallback(() => {
    setIsEditing(false);
    setSuccessMessage(null);
    setErrorMessage(null);
    if (plan) {
      setFormData({
        financier_id: plan.financier_id || 1,
        status_id: plan.status_id || 1,
        name: plan.name || '',
        description: plan.description || '',
        level_id: plan.level_id || '',
        interest_rate: plan.interest_rate || '',
        late_fee_rate: plan.late_fee_rate || '',
        late_fee_fixed: plan.late_fee_fixed || '',
        grace_period_days: plan.grace_period_days || '',
        processing_fee_rate: plan.processing_fee_rate || '',
        processing_fee_fixed: plan.processing_fee_fixed || '',
        min_down_payment_rate: plan.min_down_payment_rate || '',
        min_down_payment_fixed: plan.min_down_payment_fixed || '',
        max_financing_amount: plan.max_financing_amount || '',
        cuotas: plan.cuotas || '',
        // Asegúrate de que el nuevo campo se inicialice correctamente
        installment_frecuency: plan.installment_frecuency || '',
        indexation_rules: plan.indexation_rules || '',
        conditions: plan.conditions || '',
        brand_conditions: plan.brand_conditions ? JSON.stringify(plan.brand_conditions) : '[]',
        block_days_penalty: plan.block_days_penalty || '',
        block_penalty_rate: plan.block_penalty_rate || '',
        block_penalty_fixed: plan.block_penalty_fixed || '',
      });
    }
  }, [plan]);

  if (hookLoading || !plan || !formData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <FaSpinner className="animate-spin text-emerald-600 text-4xl" />
      </div>
    );
  }

  return (
    <div className="p-8">
      <PlanDetail
        title={`Detalles del Plan: ${plan.name}`}
        isEditing={isEditing}
        onEditClick={() => setIsEditing(true)}
        onSaveClick={handleSubmit}
        onCancelClick={handleCancelEdit}
        saveLoading={saving}
      />

      <ErrorNotification isOpen={!!errorMessage} message={errorMessage} />
      <SuccessNotification isOpen={!!successMessage} message={successMessage} />

      <EditPlanForm
        formData={formData}
        isEditing={isEditing}
        onPlanUpdated={() => {
          setIsEditing(false);
          setSuccessMessage('Plan actualizado exitosamente.');
        }}
        setGlobalSuccessMessage={setSuccessMessage}
        setGlobalErrorMessage={setErrorMessage}
        isDetailPage={true}
        handleChange={handleChange}
        handleJsonFieldChange={handleJsonFieldChange}
        handleSubmit={handleSubmit}
        loading={saving}
        planStatuses={planStatuses}
        brands={brands}
        levels={levels}
      />
    </div>
  );
};

export default DetailPlanPage;