import { FaMobileAlt } from 'react-icons/fa';

const PaymentDetailsForm = ({
  selectedMethod,
  listaBancos,
  paymentMovilDestino,
  formErrors,
  formData,
  handleChange,
  bcvRate,
}) => {
  const methodFields = selectedMethod.fields_front || {};
  const isPagoMovil = selectedMethod.code === 'PM-0105';
  const isBsMethod = selectedMethod.currency === 'VES';

  const baseClasses = "mt-1 block w-full rounded-md shadow-sm border py-2 px-3 text-gray-700";

  const handleAmountChange = (e, targetName) => {
    let { value } = e.target;

    value = value.replace(/[^0-9.]/g, '');

    const parts = value.split('.');
    if (parts.length > 2) {
      value = parts[0] + '.' + parts.slice(1).join('');
    }

    if (parts[1] && parts[1].length > 2) {
      value = parts[0] + '.' + parts[1].slice(0, 2);
    }

    handleChange({
      target: {
        name: targetName,
        value: value,
      },
    });
  };

  const amountUsd = formData.amount || '';
  const amountVes = formData.amount_converted || '';

  const renderAmountFields = () => {
    const usdFieldConfig = methodFields.amount || {};
    const vesFieldConfig = methodFields.amount_converted || {};

    return (
      <>
        <div className="space-y-1 md:col-span-1">
          <label htmlFor="amount" className="text-sm font-medium text-gray-700 flex items-center">
            Monto ($ USD) {usdFieldConfig.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <input
            type="text"
            name="amount"
            value={amountUsd}
            onChange={(e) => handleAmountChange(e, 'amount')}
            required={usdFieldConfig.required}
            className={`${formErrors.amount ? `${baseClasses} border-red-500` : `${baseClasses} border-gray-300 focus:ring-emerald-500 focus:border-emerald-500`}`}
            placeholder="0.00"
          />
          {formErrors.amount && <p className="mt-1 text-xs text-red-600">{formErrors.amount}</p>}
        </div>

        {isBsMethod && (
          <div className="space-y-1 md:col-span-1">
            <label htmlFor="amount_converted" className="text-sm font-medium text-gray-700 flex items-center">
              Monto (Bs VES) {vesFieldConfig.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              type="text"
              name="amount_converted"
              value={amountVes}
              onChange={(e) => handleAmountChange(e, 'amount_converted')}
              required={vesFieldConfig.required}
              className={`${formErrors.amount_converted ? `${baseClasses} border-red-500` : `${baseClasses} border-gray-300 focus:ring-emerald-500 focus:border-emerald-500`}`}
              placeholder="0.00"
            />
            {formErrors.amount_converted && <p className="mt-1 text-xs text-red-600">{formErrors.amount_converted}</p>}
          </div>
        )}
      </>
    );
  };

  return (
    <div className="space-y-6">
      <div className="text-sm font-semibold text-gray-700 pb-2 flex justify-between">
       
        <div className='text-right'>
          <p>Tasa BCV: <span className="font-bold text-gray-800">{bcvRate ? parseFloat(bcvRate).toFixed(4) : 'N/A'}</span></p>
        </div>
      </div>

      {isPagoMovil && paymentMovilDestino && (
        <div className="p-4 border border-gray-200 rounded-lg space-y-2">
          <h4 className="font-bold text-emerald-700 flex items-center border-b border-emerald-200 pb-1">
            <FaMobileAlt className="mr-2 text-emerald-600" /> Datos Pago Móvil Destino
          </h4>
          <p className="text-sm text-gray-700">Banco: <strong className="text-gray-800">{paymentMovilDestino.destino_banco}</strong></p>
          <p className="text-sm text-gray-700">Teléfono: <strong className="text-gray-800">{paymentMovilDestino.destino_movil}</strong></p>
          <p className="text-sm text-gray-700">Documento: <strong className="text-gray-800">{paymentMovilDestino.destino_documemto}</strong></p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {renderAmountFields()}

        {Object.entries(methodFields).map(([key, field]) => {

          if (['amount', 'amount_converted', 'bcv_rate', 'payment_status_id', 'processed_by_admin_user_id', 'retail_unit_id', 'seller_id', 'payment_type_id'].includes(key)) return null;

          const inputClasses = formErrors[key] ? `${baseClasses} border-red-500 focus:ring-red-500 focus:border-red-500` : `${baseClasses} border-gray-300 focus:ring-emerald-500 focus:border-emerald-500`;

          const renderField = () => {

            if (key === 'origin_bank') {
              return (
                <select
                  name={key}
                  value={formData[key] || ''}
                  onChange={handleChange}
                  required={field.required}
                  className={inputClasses}
                >
                  <option value="">Seleccione Banco Origen</option>
                  {listaBancos.map(bank => (
                    <option key={bank.codigo} value={bank.codigo}>
                      {bank.codigo} - {bank.nombre}
                    </option>
                  ))}
                </select>
              );
            }

            if (field.type === 'textarea') {
              return (
                <textarea
                  name={key}
                  rows="3"
                  value={formData[key] || ''}
                  onChange={handleChange}
                  required={field.required}
                  className={`${baseClasses} h-auto ${formErrors[key] ? 'border-red-500' : 'border-gray-300'}`}
                />
              );
            }

            if (key === 'origin_mobile_number') {
              return (
                <input
                  type="tel"
                  name={key}
                  value={formData[key] || ''}
                  onChange={handleChange}
                  required={field.required}
                  maxLength="11"
                  className={inputClasses}
                />
              );
            }

            return (
              <input
                type={field.type || 'text'}
                name={key}
                value={formData[key] || ''}
                onChange={handleChange}
                required={field.required}
                className={inputClasses}
              />
            );
          };

          return (
            <div key={key} className={`space-y-1 ${key === 'notes' ? 'md:col-span-2' : ''}`}>

              <label htmlFor={key} className="text-sm font-medium text-gray-700 flex items-center">
                {field.label} {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              {renderField()}
              {formErrors[key] && (
                <p className="mt-1 text-xs text-red-600">{formErrors[key]}</p>
              )}

            </div>
          );
        })}
      </div>

    </div>
  );
};

export default PaymentDetailsForm;