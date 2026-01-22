import { useMemo } from 'react';

const FinancingDetails = ({ financingContract, totalAmount }) => {
  const {
    amount_sale,
    amount_processing_fee,
    amount_financed,
    amount_financed_fee,
    total_amount_pay,
    installment_number,
    financing_plan,
  } = financingContract;

  const { name: planName, cuotas, min_down_payment_rate } = financing_plan;

  const installmentAmount = useMemo(() => {
    if (installment_number && installment_number > 0) {
      return (parseFloat(total_amount_pay) / parseFloat(installment_number)).toFixed(2);
    }
    return '0.00';
  }, [total_amount_pay, installment_number]);

  return (
    <div className="p-6 rounded-lg border border-claro col-span-full mt-15">
      <h4 className="text-xl font-bold text-oscuro mb-4 border-b border-claro pb-3 text-left">
        Detalle del Plan de Pago: {planName}
      </h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 text-hover text-left">
        <div>
          <p className="font-semibold">Monto Total del Producto:</p>
          <p className="text-lg font-bold">${parseFloat(amount_sale).toFixed(2)}</p>
        </div>
        <div>
          <p className="font-semibold">Monto Inicial:</p>
          <p className="text-lg font-bold">${(parseFloat(amount_sale) - parseFloat(amount_financed)).toFixed(2)}</p>
        </div>
        <div>
          <p className="font-semibold">Monto a Financiar:</p>
          <p className="text-lg font-bold">${parseFloat(amount_financed).toFixed(2)}</p>
        </div>
        <div>
          <p className="font-semibold">Costo de Procesamiento:</p>
          <p className="text-lg font-bold">${parseFloat(amount_processing_fee).toFixed(2)}</p>
        </div>
        <div>
          <p className="font-semibold">Interés:</p>
          <p className="text-lg font-bold">${parseFloat(amount_financed_fee).toFixed(2)}</p>
        </div>
        <div>
          <p className="font-semibold">Total a Pagar en Cuotas:</p>
          <p className="text-lg font-bold">${parseFloat(total_amount_pay).toFixed(2)}</p>
        </div>
        <div>
          <p className="font-semibold">Número de Cuotas:</p>
          <p className="text-lg font-bold">{cuotas}</p>
        </div>
        <div>
          <p className="font-semibold">Monto por Cuota:</p>
          <p className="text-lg font-bold">${installmentAmount}</p>
        </div>
      </div>
    </div>
  );
};

export default FinancingDetails;