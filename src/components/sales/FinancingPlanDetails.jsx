const FinancingPlanDetails = ({ financingPlan }) => {
  if (!financingPlan) {
    return null;
  }

  const {
    name,
    description,
    interest_rate,
    late_fee_rate,
    late_fee_fixed,
    grace_period_days,
    min_down_payment_rate,
    max_financing_amount,
    cuotas,
    installment_frecuency
  } = financingPlan;

  return (
    <div className="bg-emerald-50 p-6 rounded-lg border border-emerald-200">
      <h4 className="text-xl font-bold text-emerald-800 mb-2 border-b border-emerald-200 pb-2 text-left">
        Plan de Financiamiento Aprobado: <span className="font-normal">{name}</span>
      </h4>
      <p className="text-emerald-700 text-left mb-4">{description}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-left">
        <div>
          <p className="font-semibold text-emerald-700">Tasa de Interés:</p>
          <p className="text-lg font-bold text-emerald-900">{parseFloat(interest_rate).toFixed(2)}%</p>
        </div>
        <div>
          <p className="font-semibold text-emerald-700">Monto Máximo a Financiar:</p>
          <p className="text-lg font-bold text-emerald-900">${parseFloat(max_financing_amount).toFixed(2)}</p>
        </div>
        <div>
          <p className="font-semibold text-emerald-700">Cuotas:</p>
          <p className="text-lg font-bold text-emerald-900">{cuotas}</p>
        </div>
        <div>
          <p className="font-semibold text-emerald-700">Frecuencia de las cuotas:</p>
          <p className="text-lg font-bold text-emerald-900">{installment_frecuency}</p>
        </div>
        <div>
          <p className="font-semibold text-emerald-700">Pago Inicial Mínimo:</p>
          <p className="text-lg font-bold text-emerald-900">{parseFloat(min_down_payment_rate).toFixed(0)}%</p>
        </div>
        <div>
          <p className="font-semibold text-emerald-700">Recargo por Mora:</p>
          <p className="text-lg font-bold text-emerald-900">
            {late_fee_fixed ? `$${parseFloat(late_fee_fixed).toFixed(2)} + ` : ''}
            {late_fee_rate ? `${parseFloat(late_fee_rate).toFixed(2)}%` : 'N/A'}
          </p>
        </div>
        <div>
          <p className="font-semibold text-emerald-700">Período de Gracia:</p>
          <p className="text-lg font-bold text-emerald-900">{grace_period_days} días</p>
        </div>
      </div>
    </div>
  );
};

export default FinancingPlanDetails;