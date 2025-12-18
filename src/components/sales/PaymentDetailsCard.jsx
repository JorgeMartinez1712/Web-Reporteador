import { useMemo } from 'react';

const PaymentDetailsCard = ({ selectedFinancingPlan, calculatedDetails }) => {
  if (!selectedFinancingPlan || !calculatedDetails) {
    return (
      <div className="p-4 rounded-lg border border-gray-200 col-span-full text-left">
        <p className="font-semibold text-gray-700 mb-2">Detalle del plan de pago:</p>
        <p className="text-gray-500">No se ha asignado un plan de financiamiento para ver los detalles.</p>
      </div>
    );
  }

  const {
    interest_rate,
    min_down_payment_rate,
    processing_fee_rate,
    late_fee_rate,
    late_fee_fixed,
    grace_period_days,
    installment_frecuency,
    block_days_penalty,
    block_penalty_rate
  } = selectedFinancingPlan;

  const {
    totalProductCost,
    calculatedDownPayment,
    financedAmount,
    processingFee,
    interestAmount,
    totalAmountFinanced,
    installmentAmount,
    installmentDates, 
    blockPenaltyAmount,
  } = calculatedDetails;

  const regularInstallments = useMemo(() => {
    if (installmentDates) {
      return installmentDates.map((date, index) => ({
        number: index + 1,
        due_date: date,
        amount: installmentAmount,
        is_inicial: false
      }));
    }

    if (calculatedDetails.installmentsFromApi) {
      return calculatedDetails.installmentsFromApi
        .filter(inst => !inst.is_inicial)
        .map(inst => ({
          number: inst.number,
          due_date: inst.due_date,
          amount: inst.amount,
          is_inicial: inst.is_inicial
        }));
    }

    return [];
  }, [installmentDates, installmentAmount, calculatedDetails.installmentsFromApi]);


  return (
    <div className=" rounded-lg col-span-full mt-6">
      <h4 className="text-xl font-semibold text-gray-800 pb-4 mb-4 text-left">Detalle del plan de pago</h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 text-gray-700 text-left">
        <div>
          <p className="font-semibold text-gray-800">Precio:</p>
          <p className="text-lg text-gray-700">${totalProductCost.toFixed(2)}</p>
        </div>
        <div>
          <p className="font-semibold text-gray-800">Tasa de procesamiento:</p>
          <p className="text-lg text-gray-700">${processingFee.toFixed(2)}</p>
        </div>
        <div>
          <p className="font-semibold text-gray-800">Cuota inicial:</p>
          <p className="text-lg text-gray-700">${calculatedDownPayment.toFixed(2)}</p>
        </div>
        <div>
          <p className="font-semibold text-gray-800">Monto a financiar:</p>
          <p className="text-lg text-gray-700">${financedAmount.toFixed(2)}</p>
        </div>
        <div>
          <p className="font-semibold text-gray-800">Tasa de interés:</p>
          <p className="text-lg text-gray-700">${interestAmount.toFixed(2)} {interest_rate && parseFloat(interest_rate) > 0 && `(${parseFloat(interest_rate).toFixed(2)}%)`}</p>
        </div>
        <div>
          <p className="font-semibold text-gray-800">Total a pagar en cuotas:</p>
          <p className="text-lg text-gray-700">${totalAmountFinanced.toFixed(2)}</p>
        </div>
        <div>
          <p className="font-semibold text-gray-800">Monto por cuota:</p>
          <p className="text-lg text-gray-700">${parseFloat(installmentAmount).toFixed(2)}</p>
        </div>
        <div>
          <p className="font-semibold text-gray-800">Frecuencia de las cuotas:</p>
          <p className="text-lg text-gray-700">{installment_frecuency}</p>
        </div>
        {grace_period_days > 0 && (
          <div>
            <p className="font-semibold text-gray-800">Período de gracia:</p>
            <p className="text-lg text-gray-700">{grace_period_days} días</p>
          </div>
        )}
        {late_fee_rate > 0 && (
          <div>
            <p className="font-semibold text-gray-800">Tasa de mora:</p>
            <p className="text-lg text-gray-700">{late_fee_fixed > 0 ? `$${late_fee_fixed.toFixed(2)} + ` : ''}{parseFloat(late_fee_rate).toFixed(2)}%</p>
          </div>
        )}
        <div>
          <p className="font-semibold text-gray-800">Días de penalización:</p>
          <p className="text-lg text-gray-700">{block_days_penalty}</p>
        </div>
        <div>
          <p className="font-semibold text-gray-800">Tasa de penalización:</p>
          <p className="text-lg text-gray-700">${parseFloat(blockPenaltyAmount || 0).toFixed(2)}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg mt-6">
        {regularInstallments.length > 0 && (
          <div className="pt-4 text-left">
            <h5 className="text-lg font-semibold text-gray-800 mb-2">Detalle de cuotas</h5>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">
                      #Cuota
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">
                      Fecha de Vencimiento
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 tracking-wider">
                      Monto
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {regularInstallments.map((installment, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {installment.number}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {installment.due_date ? new Date(installment.due_date).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }) : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-700">
                        ${parseFloat(installment.amount).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
      <div className="mt-6 pt-4 border-t border-gray-200 text-left">
        <p className="text-xl font-semibold text-gray-800">Total de la venta: <span className="text-xl">${totalProductCost.toFixed(2)}</span></p>
      </div>
    </div>
  );
};

export default PaymentDetailsCard;