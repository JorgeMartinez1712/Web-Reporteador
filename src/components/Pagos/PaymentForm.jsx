import { useState, useEffect, useImperativeHandle, forwardRef, useCallback } from 'react';
import { FaSpinner } from 'react-icons/fa';
import PaymentMethodSelector from './PaymentMethodSelector';
import PaymentDetailsForm from './PaymentDetailsForm';
import SuccessNotification from '../../components/common/SuccessNotification';
import ErrorNotification from '../../components/common/ErrorNotification';
import WarningNotification from '../../components/common/WarningNotification';

const PaymentForm = forwardRef(({ sale, registerPayment, onFormChange, registerPaymentRef, sellerId, retailUnitId, requestPaymentMobileToken, customerId }) => {
  const { outstanding, options } = sale || {};
  const { payment_methods, tasa_bcv, payment_movil_destino } = options || {};

  const COMPLETE_PAYMENT_TYPE_ID = options?.payment_type?.find(t => t.name.toLowerCase() === 'completo')?.id.toString() || '1';

  const INITIAL_FORM_DATA = { payment_type_id: COMPLETE_PAYMENT_TYPE_ID };

  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [selectedMethodId, setSelectedMethodId] = useState('');
  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState(null);
  const [warningMessage, setWarningMessage] = useState(null);
  const [pmTokenLoading, setPmTokenLoading] = useState(false);
  const [, setPmTokenError] = useState(null);
  const [pmTokenRequestedForMethod, setPmTokenRequestedForMethod] = useState(null);
  const [pmResponseMessage, setPmResponseMessage] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [isValidationTriggered, setIsValidationTriggered] = useState(false);

  const selectedMethod = payment_methods ? payment_methods.find((m) => m.id === parseInt(selectedMethodId)) : null;
  const BCV_RATE = tasa_bcv ? parseFloat(tasa_bcv.rate) : null;
  const BCV_CURRENCY_ID = tasa_bcv ? tasa_bcv.bcv_currency_id : null;

  const FIXED_PAYMENT_STATUS_ID = 4;
  const RETAIL_UNIT_ID = retailUnitId;
  const FIXED_SELLER_ID = sellerId;

  const resetForm = useCallback(() => {
    setFormData(INITIAL_FORM_DATA);
    setSelectedMethodId('');
    setFormErrors({});
    setIsValidationTriggered(false);
    setWarningMessage(null);
  }, [INITIAL_FORM_DATA]);

  const handleClearNotifications = useCallback(() => {
    setResponseMessage(null);
    setWarningMessage(null);
  }, []);

  const calculateAmounts = useCallback((currentData, method, rate, changedField = null) => {
    const isBsMethod = method && method.currency === 'VES';
    let { amount, amount_converted } = currentData;

    const floatAmount = amount === '' || amount === undefined ? null : parseFloat(amount);
    const floatAmountConverted = amount_converted === '' || amount_converted === undefined ? null : parseFloat(amount_converted);

    let newAmount = floatAmount;
    let newAmountConverted = floatAmountConverted;
    let error = null;

    if (isBsMethod && rate) {
      if (changedField === 'amount' && floatAmount !== null && !isNaN(floatAmount)) {
        newAmountConverted = (floatAmount * rate);
      } else if (changedField === 'amount_converted' && floatAmountConverted !== null && !isNaN(floatAmountConverted)) {
        newAmount = (floatAmountConverted / rate);
      }
    }

    if (newAmount !== null && parseFloat(newAmount) > outstanding + 0.001) {
      error = `El monto ($${newAmount.toFixed(2)}) no puede ser mayor que el saldo pendiente ($${outstanding.toFixed(2)}).`;
    }

    const result = { ...currentData };

    if (changedField === 'amount') {
      result.amount = currentData.amount;
      result.amount_converted = (isBsMethod && newAmountConverted !== null && newAmountConverted !== '' && !isNaN(newAmountConverted)) ? parseFloat(newAmountConverted).toFixed(2) : '';
    } else if (changedField === 'amount_converted') {
      result.amount_converted = currentData.amount_converted;
      result.amount = newAmount !== null && newAmount !== '' && !isNaN(newAmount) ? parseFloat(newAmount).toFixed(2) : '';
    } else {
      result.amount = newAmount !== null && newAmount !== '' && !isNaN(newAmount) ? parseFloat(newAmount).toFixed(2) : '';
      result.amount_converted = (isBsMethod && newAmountConverted !== null && newAmountConverted !== '' && !isNaN(newAmountConverted)) ? parseFloat(newAmountConverted).toFixed(2) : '';
    }

    if (isBsMethod && rate) {
      result.bcv_rate = rate;
    } else {
      delete result.bcv_rate;
    }

    if (error) {
      result.error = error;
    }

    return result;

  }, [outstanding]);

  const validateForm = useCallback((currentData, method, shouldSetErrors = true) => {
    const errors = {};
    let isValid = true;
    const isBsMethod = method && method.currency === 'VES';

    setWarningMessage(null);

    if (!method) {
      isValid = false;
    } else {
      const amount = parseFloat(currentData.amount);

      if (isNaN(amount) || amount <= 0) {
        errors.amount = 'El monto en USD debe ser un número positivo.';
        isValid = false;
      } else if (amount > outstanding + 0.001) {
        setWarningMessage(`El monto ($${amount.toFixed(2)}) supera el saldo pendiente ($${outstanding.toFixed(2)}).`);
        isValid = false;
      }

      if (isBsMethod) {
        const amountConverted = parseFloat(currentData.amount_converted);
        if (isNaN(amountConverted) || amountConverted <= 0) {
          errors.amount_converted = 'El monto en VES debe ser un número positivo.';
          isValid = false;
        }
      }

      if (method.fields_front) {
        Object.entries(method.fields_front).forEach(([key, field]) => {
          const excludedFields = ['amount', 'amount_converted', 'bcv_rate', 'payment_status_id', 'processed_by_admin_user_id', 'retail_unit_id', 'seller_id', 'payment_type_id'];

          if (excludedFields.includes(key)) return;

          if (field.required && !currentData[key]) {
            errors[key] = `${field.label} es requerido.`;
            isValid = false;
          }
        });
      }
    }

    if (shouldSetErrors) {
      setFormErrors(errors);
    }

    if (onFormChange) {
      onFormChange({ ...currentData, selectedMethodId }, isValid && selectedMethodId !== '');
    }

    return isValid && selectedMethodId !== '';
  }, [outstanding, onFormChange, selectedMethodId]);

  useEffect(() => {
    if (selectedMethodId) {
      const calculated = calculateAmounts(formData, selectedMethod, BCV_RATE, null);
      let newFormData = { ...formData, ...calculated };

      setFormData(newFormData);
      validateForm(newFormData, selectedMethod, isValidationTriggered);
    } else {
      setFormErrors({});
      if (onFormChange) {
        onFormChange({ selectedMethodId: '' }, false);
      }
    }
  }, [selectedMethodId, BCV_RATE]);

  useEffect(() => {
    const isPagoMovil = selectedMethod && selectedMethod.code === 'PM-0105';

    if (!isPagoMovil) return;
    if (!requestPaymentMobileToken || !customerId || !sale?.id || !retailUnitId || !sellerId) return;

    if (pmTokenRequestedForMethod === selectedMethod.id || pmTokenLoading) return;

    const doRequest = async () => {
      setPmTokenRequestedForMethod(selectedMethod.id);
      setPmTokenLoading(true);
      setPmTokenError(null);
      try {
        const resp = await requestPaymentMobileToken({
          customer_id: customerId,
          sale_id: sale.id,
          retail_unit_id: retailUnitId,
          processed_by_seller_id: sellerId,
        });

        if (resp && resp.success) {
          const token = resp.data?.token || resp.token || resp.data?.manager_token || resp.manager_token;
          setPmResponseMessage({ type: 'success', message: resp.message || 'Token generado', details: resp });
          if (token) {
            setFormData(prev => {
              const newData = { ...prev, manager_token: token };
              if (onFormChange) onFormChange(newData, false);
              return newData;
            });
          }
          setTimeout(() => setPmResponseMessage(null), 4000);
        } else {
          const msg = resp?.message || 'No se pudo obtener token Pago Móvil';
          setPmResponseMessage({ type: 'error', message: msg });
          setPmTokenError(msg);
        }
      } catch (err) {
        const emsg = err.friendlyMessage || err?.response?.data?.message || err?.message || 'Error al solicitar token Pago Móvil';
        setPmResponseMessage({ type: 'error', message: emsg });
        setPmTokenError(emsg);
        setPmTokenRequestedForMethod(null);
      } finally {
        setPmTokenLoading(false);
      }
    };

    doRequest();
  }, [selectedMethodId, selectedMethod, requestPaymentMobileToken, customerId, sale, retailUnitId, sellerId, pmTokenRequestedForMethod]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    let newFormData = { ...formData, [name]: value };
    let calculated = newFormData;

    setFormErrors(prev => {
      const newErrors = { ...prev };
      if (name === 'amount' || name === 'amount_converted') {
        delete newErrors.amount;
        delete newErrors.amount_converted;
      } else {
        delete newErrors[name];
      }
      return newErrors;
    });

    if (name === 'amount' || name === 'amount_converted') {
      calculated = calculateAmounts(newFormData, selectedMethod, BCV_RATE, name);

      if (calculated.error) {
        setWarningMessage(calculated.error);
        delete calculated.error;
      } else {
        setWarningMessage(null);
      }
    }

    setFormData(calculated);

    if (isValidationTriggered) {
      validateForm(calculated, selectedMethod, true);
    } else {
      validateForm(calculated, selectedMethod, false);
    }
  };

  const handleRegisterPaymentFromParent = async (basePayload) => {
    if (!isValidationTriggered) {
      setIsValidationTriggered(true);
    }

    const isValid = validateForm(formData, selectedMethod, true);
    if (!isValid) return;

    setLoading(true);
    setResponseMessage(null);
    setWarningMessage(null);

    const methodFields = selectedMethod.fields_front || {};
    const isBsMethod = selectedMethod && selectedMethod.currency === 'VES';
    const isPagoMovil = selectedMethod && selectedMethod.code === 'PM-0105';

    const dynamicFields = Object.keys(methodFields)
      .filter(key => !['bcv_rate'].includes(key))
      .reduce((acc, key) => {
        if (key === 'payment_status_id') {
          acc[key] = FIXED_PAYMENT_STATUS_ID;
        } else if (key === 'processed_by_admin_user_id') {
          acc[key] = FIXED_SELLER_ID;
        } else if (key === 'retail_unit_id') {
          acc[key] = RETAIL_UNIT_ID;
        } else if (key === 'seller_id') {
          acc[key] = FIXED_SELLER_ID;
        } else if (key === 'payment_type_id') {
          acc[key] = COMPLETE_PAYMENT_TYPE_ID;
        } else {
          if (formData[key] !== undefined && formData[key] !== '') {
            acc[key] = (key === 'amount' || key === 'amount_converted') ? parseFloat(formData[key]) : formData[key];
          }
        }
        return acc;
      }, {});

    if (isBsMethod && BCV_CURRENCY_ID) {
      dynamicFields.bcv_currency_id = BCV_CURRENCY_ID;
    }

    if (isPagoMovil && formData.manager_token) {
      dynamicFields.manager_token = formData.manager_token;
    }

    const finalPayload = {
      ...basePayload,
      ...dynamicFields,
    };

    const response = await registerPayment(finalPayload);
    
    if (response && response.success) {
      setResponseMessage({
        type: 'success',
        message: '¡Pago registrado con éxito!',
        details: response, 
      });

      resetForm();

      setTimeout(() => {
        setResponseMessage(null);
      }, 3000);

      if (onFormChange) {
        onFormChange({ ...formData, selectedMethodId, paymentSuccess: true, paymentResponse: response }, false);
      }
    } else {
      setResponseMessage({
        type: 'error',
        message: response ? `Error al registrar pago: ${response.message}` : 'Error de conexión o validación al registrar el pago.',
        details: null,
      });
    }
    setLoading(false);
  };

  useImperativeHandle(registerPaymentRef, () => handleRegisterPaymentFromParent, [handleRegisterPaymentFromParent, formData, selectedMethod, resetForm]);

  return (
    <div className="space-y-6 text-left">
      <SuccessNotification
        isOpen={responseMessage && responseMessage.type === 'success'}
        message={responseMessage ? responseMessage.message : ''}
      />

      <ErrorNotification
        isOpen={responseMessage && responseMessage.type === 'error'}
        message={responseMessage ? responseMessage.message : ''}
        onClose={handleClearNotifications}
      />

      <SuccessNotification
        isOpen={pmResponseMessage && pmResponseMessage.type === 'success'}
        message={pmResponseMessage ? pmResponseMessage.message : ''}
      />

      <ErrorNotification
        isOpen={pmResponseMessage && pmResponseMessage.type === 'error'}
        message={pmResponseMessage ? pmResponseMessage.message : ''}
        onClose={() => { setPmResponseMessage(null); setPmTokenError(null); }}
      />

      <WarningNotification
        isOpen={!!warningMessage}
        message={warningMessage}
        onClose={handleClearNotifications}
      />

      <h3 className="text-xl font-bold text-gray-800 border-b pb-3 border-gray-200">
        Registro de Pago
      </h3>

      <PaymentMethodSelector
        paymentMethods={payment_methods}
        selectedMethodId={selectedMethodId}
        onMethodSelect={setSelectedMethodId}
      />

      {selectedMethod && (
        <PaymentDetailsForm
          saleOutstanding={outstanding}
          selectedMethod={selectedMethod}
          listaBancos={options?.lista_bancos}
          paymentMovilDestino={payment_movil_destino}
          formErrors={formErrors}
          formData={formData}
          handleChange={handleChange}
          bcvRate={BCV_RATE}
        />
      )}

      {loading && (
        <div className="flex justify-center items-center py-4">
          <FaSpinner className="animate-spin text-emerald-600 text-3xl" />
          <p className="ml-3 text-lg text-gray-700">Procesando...</p>
        </div>
      )}
    </div>
  );
});

export default PaymentForm;