import { useState, useEffect } from 'react';
import CustomModal from '../common/CustomModal';
import * as FaIcons from 'react-icons/fa';
import useSales from '../../hooks/useSales';

const PaymentFormModal = ({ isOpen, onClose, onPaymentComplete, paymentData, saleData, currentUser, onShowWarning, onError }) => {
  const [formFields, setFormFields] = useState({});
  const [phonePrefix, setPhonePrefix] = useState('0412');
  const { submitInitialPaymentRegistered } = useSales({ autoFetchSales: false });

  useEffect(() => {
    if (isOpen && paymentData) {
      const initialFields = {};
      if (paymentData.form_fields) {
        Object.keys(paymentData.form_fields).forEach(key => {
          const fieldConfig = paymentData.form_fields[key];
          let initialValue = '';

          if (key === 'amount') {
            initialValue = paymentData.installment?.amount_pending || '';
          } else if (key === 'payment_type_id') {
            const defaultType = paymentData.options?.payment_type.find(opt => opt.name.toLowerCase() === 'completo') || paymentData.options?.payment_type[0];
            initialValue = defaultType?.id || '';
          } else if (key === 'payment_status_id') {
            const defaultStatus = paymentData.options?.payment_statuses.find(opt => opt.name.toLowerCase() === 'completado') || paymentData.options?.payment_statuses[0];
            initialValue = defaultStatus?.id || '';
          } else if (key === 'retail_unit_id') {
            initialValue = saleData.saleDetails.retail_unit_id;
          } else if (key === 'processed_by_admin_user_id') {
            initialValue = currentUser?.seller?.id;
          } else if (key === 'origin_bank') {
            initialValue = saleData?.saleDetails?.origin_bank_id || '';
          } else if (fieldConfig.type === 'date') {
            initialValue = new Date().toISOString().split('T')[0];
          }

          initialFields[key] = initialValue;
        });

        const pendingAmount = paymentData.installment?.amount_pending;
        const rate = paymentData?.currency?.rate;
        if (pendingAmount !== undefined && rate) {
          initialFields.amount_converted = (parseFloat(pendingAmount) * parseFloat(rate)).toFixed(2);
        }
      }
      setFormFields(initialFields);
    }
  }, [isOpen, paymentData, saleData, currentUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!paymentData || !paymentData.installment || !paymentData.method_payment) {
        throw new Error('Faltan datos del pago para procesar la solicitud.');
      }

      const payload = {
        sale_id: saleData.saleDetails.id,
        installment_id: paymentData.installment.id,
        payment_method_id: paymentData.method_payment.id,
        ...formFields,
        amount: parseFloat(formFields.amount),
        amount_converted: parseFloat(formFields.amount_converted),
        origin_mobile_number: formFields.origin_mobile_number ? `${phonePrefix}${formFields.origin_mobile_number}` : '',
      };

      const paymentResponse = await submitInitialPaymentRegistered(payload);
      const isCompleted = paymentResponse.installment_summary?.amount_pending === 0;

      onPaymentComplete(paymentResponse, isCompleted);
      onClose();
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Error al registrar el pago.';
      onClose();
      onError(errorMessage);
    }
  };

  const getTitle = () => {
    return paymentData?.method_payment?.name || 'Formulario de Pago';
  };

  const getIcon = () => {
    const IconComponent = FaIcons[paymentData?.method_payment?.icon];
    return IconComponent ? <IconComponent className="inline mr-2 text-oscuro" /> : null;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === "amount" || name === "amount_converted") {
      newValue = value.replace(/[^0-9.]/g, '');
      const parts = newValue.split('.');
      if (parts[1] && parts[1].length > 2) {
        newValue = parts[0] + '.' + parts[1].slice(0, 2);
      }
    }

    setFormFields(prev => {
      const newFields = { ...prev, [name]: newValue };
      const isPartialPayment = paymentData?.options?.payment_type.find(opt => opt.id == newFields.payment_type_id)?.name.toLowerCase() === 'parcial';

      if (name === "amount" && newFields.amount !== undefined) {
        const pendingAmount = paymentData.installment?.amount_pending;
        const enteredAmount = parseFloat(newFields.amount);

        if (!isNaN(enteredAmount) && enteredAmount > pendingAmount && isPartialPayment) {
          onShowWarning(`El monto no puede ser mayor que el monto pendiente (${parseFloat(pendingAmount).toFixed(2)}).`);
          return prev;
        }

        if (paymentData?.currency?.rate && !isNaN(enteredAmount)) {
          const rate = parseFloat(paymentData.currency.rate);
          newFields.amount_converted = (enteredAmount * rate).toFixed(2);
        }
      }

      if (name === "amount_converted" && newFields.amount_converted !== undefined) {
        const enteredAmountConverted = parseFloat(newFields.amount_converted);

        if (paymentData?.currency?.rate && !isNaN(enteredAmountConverted)) {
          const rate = parseFloat(paymentData.currency.rate);
          const amount = (enteredAmountConverted / rate).toFixed(2);
          const pendingAmount = paymentData.installment?.amount_pending;

          if (parseFloat(amount) > pendingAmount && isPartialPayment) {
            onShowWarning(`El monto en USD no puede ser mayor que el monto pendiente ($${parseFloat(pendingAmount).toFixed(2)}).`);
            return prev;
          }
          newFields.amount = amount;
        }
      }

      if (name === "payment_type_id") {
        const selectedPaymentType = paymentData.options.payment_type.find(option => option.id == newValue);
        if (selectedPaymentType && selectedPaymentType.name.toLowerCase() === 'completo') {
          const pendingAmount = paymentData.installment?.amount_pending || 0;
          newFields.amount = pendingAmount;
          if (paymentData?.currency?.rate) {
            newFields.amount_converted = (pendingAmount * parseFloat(paymentData.currency.rate)).toFixed(2);
          }
        }
      }

      return newFields;
    });
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 7);
    setFormFields(prev => ({
      ...prev,
      origin_mobile_number: value,
    }));
  };

  const handlePhonePrefixChange = (e) => {
    setPhonePrefix(e.target.value);
  };

  const renderFormFields = () => {
    if (!paymentData?.form_fields) return null;

    const isPartialPayment = paymentData?.options?.payment_type.find(opt => opt.id == formFields.payment_type_id)?.name.toLowerCase() === 'parcial';

    return Object.entries(paymentData.form_fields)
      .filter(([fieldName]) => fieldName !== 'manager_token')
      .map(([fieldName, fieldConfig]) => {
        const { type, label, required } = fieldConfig;
        const value = formFields[fieldName] || '';
        const isReadOnly = ['retail_unit_id', 'processed_by_admin_user_id'].includes(fieldName) ||
          (fieldName === 'amount' && !isPartialPayment) ||
          (fieldName === 'amount_converted' && !isPartialPayment && formFields.amount_converted !== undefined);

        const commonProps = {
          id: fieldName,
          name: fieldName,
          value: value,
          onChange: handleChange,
          className: `mt-1 block h-10 w-full px-2 rounded-md border-gray-300 shadow-sm focus:outline-none ${isReadOnly ? 'bg-gray-100' : 'focus:border-claro focus:ring-claro'}`,
          required: required,
          readOnly: isReadOnly,
          type: type,
        };

        if (fieldName.endsWith('_id') && fieldName !== 'payment_status_id' && fieldName !== 'payment_type_id') {
          return null;
        }

        if (fieldName === 'origin_mobile_number') {
          const prefixes = ['0412', '0422', '0416', '0426', '0414', '0424'];
          return (
            <div className="flex flex-col" key={fieldName}>
              <label htmlFor={fieldName} className="text-sm font-medium text-gray-700">{label} {required && <span className="text-red-500">*</span>}</label>
              <div className="flex mt-1">
                <select
                  value={phonePrefix}
                  onChange={handlePhonePrefixChange}
                  className="h-10 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:border-claro focus:ring-claro"
                >
                  {prefixes.map(prefix => (
                    <option key={prefix} value={prefix}>{prefix}</option>
                  ))}
                </select>
                <input
                  type="text"
                  name={fieldName}
                  value={formFields.origin_mobile_number || ''}
                  onChange={handlePhoneChange}
                  maxLength="7"
                  className="h-10 w-full px-2 rounded-r-md border-gray-300 shadow-sm focus:outline-none focus:border-claro focus:ring-claro"
                  placeholder="Ej: 1234567"
                  required={required}
                />
              </div>
            </div>
          );
        }

        if (fieldName === 'origin_bank') {
          const banks = paymentData?.options?.lista_bancos || [];
          return (
            <div className="flex flex-col" key={fieldName}>
              <label htmlFor={fieldName} className="text-sm font-medium text-gray-700">{label} {required && <span className="text-red-500">*</span>}</label>
              <select {...commonProps}>
                <option value="">Seleccione un banco</option>
                {banks.map(bank => (
                  <option key={bank.codigo} value={bank.codigo}>
                    {`${bank.codigo} - ${bank.nombre}`}
                  </option>
                ))}
              </select>
            </div>
          );
        }

        if (type === 'select') {
          let options = [];
          if (fieldName === 'payment_type_id') {
            options = paymentData.options?.payment_type || [];
          } else if (fieldName === 'payment_status_id') {
            options = paymentData.options?.payment_statuses || [];
          } else {
            return null;
          }

          return (
            <div className="flex flex-col" key={fieldName}>
              <label htmlFor={fieldName} className="text-sm font-medium text-gray-700">{label} {required && <span className="text-red-500">*</span>}</label>
              <select {...commonProps}>
                {required && <option value="">Seleccione una opción</option>}
                {options.map(option => (
                  <option key={option.id} value={option.id}>
                    {option.name}
                  </option>
                ))}
              </select>
            </div>
          );
        }

        if (type === 'textarea') {
          return (
            <div className="flex flex-col" key={fieldName}>
              <label htmlFor={fieldName} className="text-sm font-medium text-gray-700">{label} {required && <span className="text-red-500">*</span>}</label>
              <textarea {...commonProps} rows="3" />
            </div>
          );
        }

        const isNumericField = ['amount', 'amount_converted'].includes(fieldName);

        return (
          <div className="flex flex-col" key={fieldName}>
            <label htmlFor={fieldName} className="text-sm font-medium text-gray-700">{label} {required && <span className="text-red-500">*</span>}</label>
            <input
              type={isNumericField ? 'text' : type}
              {...commonProps}
              onKeyDown={(e) => {
                if (isNumericField) {
                  const key = e.key;
                  if (!/^[0-9.]$/.test(key) && key !== 'Backspace' && key !== 'Delete' && key !== 'ArrowLeft' && key !== 'ArrowRight' && key !== 'Tab') {
                    e.preventDefault();
                  }
                  if (key === '.' && e.target.value.includes('.')) {
                    e.preventDefault();
                  }
                }
              }}
              step="0.01"
              value={value}
            />
          </div>
        );
      });
  };

  return (
    <CustomModal isOpen={isOpen} onClose={onClose} title={
      <div className="flex items-center">
        {getIcon()}
        {getTitle()}
      </div>
    }>
      <div className="mb-2">
        {paymentData?.options?.payment_destino && (
          <div className="mt-4 p-4 bg-gray-100 rounded-md">
            <h3 className="font-bold text-gray-800">Datos de destino para el pago:</h3>
            <p className="text-sm text-gray-700">Teléfono: <span className="font-semibold">{paymentData.options.payment_destino.destino_movil}</span></p>
            <p className="text-sm text-gray-700">Documento: <span className="font-semibold">{paymentData.options.payment_destino.destino_documemto}</span></p>
          </div>
        )}
      </div>
      <form onSubmit={handleSubmit} className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderFormFields()}
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-white bg-oscuro rounded-md hover:bg-hover transition-colors"
          >
            Confirmar
          </button>
        </div>
      </form>
    </CustomModal>
  );
};

export default PaymentFormModal;