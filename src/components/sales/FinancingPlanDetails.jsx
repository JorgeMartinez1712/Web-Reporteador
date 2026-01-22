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
    <div className="bg-bg p-6 rounded-lg border border-claro">
      <h4 className="text-xl font-bold text-oscuro mb-2 border-b border-claro pb-2 text-left">
        Plan de Financiamiento Aprobado: <span className="font-normal">{name}</span>
      </h4>
      <p className="text-hover text-left mb-4">{description}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-left">
        <div>
          <p className="font-semibold text-hover">Tasa de Interés:</p>
          <p className="text-lg font-bold text-oscuro">{parseFloat(interest_rate).toFixed(2)}%</p>
        </div>
        <div>
          <p className="font-semibold text-hover">Monto Máximo a Financiar:</p>
          <p className="text-lg font-bold text-oscuro">${parseFloat(max_financing_amount).toFixed(2)}</p>
        </div>
        <div>
          <p className="font-semibold text-hover">Cuotas:</p>
          <p className="text-lg font-bold text-oscuro">{cuotas}</p>
        </div>
        <div>
          <p className="font-semibold text-hover">Frecuencia de las cuotas:</p>
          <p className="text-lg font-bold text-oscuro">{installment_frecuency}</p>
        </div>
        <div>
          <p className="font-semibold text-hover">Pago Inicial Mínimo:</p>
          <p className="text-lg font-bold text-oscuro">{parseFloat(min_down_payment_rate).toFixed(0)}%</p>
        </div>
        <div>
          <p className="font-semibold text-hover">Recargo por Mora:</p>
          <p className="text-lg font-bold text-oscuro">
            {late_fee_fixed ? `$${parseFloat(late_fee_fixed).toFixed(2)} + ` : ''}
            {late_fee_rate ? `${parseFloat(late_fee_rate).toFixed(2)}%` : 'N/A'}
          </p>
        </div>
        <div>
          <p className="font-semibold text-hover">Período de Gracia:</p>
          <p className="text-lg font-bold text-oscuro">{grace_period_days} días</p>
        </div>
      </div>
    </div>
  );
};

export default FinancingPlanDetails;