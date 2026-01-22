import ErrorNotification from '../common/ErrorNotification';
// PlansGrid receives `levels`, `loading` and `hookError` from its parent to avoid
// re-running the initial data fetch (usePlans) inside this presentational component.
import JsonDisplay from '../common/JsonDisplay';
import { FaSpinner } from 'react-icons/fa';

const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(2);
    return `${day}/${month}/${year}`;
};

const PlansGrid = ({ plans = [], onPlanClick, levels = [], loading = false, hookError = null }) => {

    const DetailItem = ({ label, value, unit = '' }) => (
        <div className="flex flex-col text-left">
            <span className="font-medium text-gray-700 text-xs">{label}</span>
            <span className="text-gray-900 text-sm font-semibold">
                {typeof value === 'number' ? value.toFixed(2) : value}{unit}
            </span>
        </div>
    );

    const getLevelName = (levelId) => {
        const level = levels.find(l => l.id === levelId);
        return level ? level.descripcion : 'N/A';
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <FaSpinner className="animate-spin text-oscuro text-4xl" />
            </div>
        );
    }

    if (!Array.isArray(plans) || plans.length === 0) {
        return (
            <div className="text-center text-gray-500 text-lg mt-8">
                No hay planes de financiamiento registrados.
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-10 w-full">
            {hookError && <ErrorNotification message={hookError} />}

            {plans.map((plan) => (
                <div
                    key={plan.id}
                    className="rounded-lg shadow-2xl hover:shadow-lg transition-shadow duration-300 overflow-hidden flex flex-col h-auto min-h-[300px] border-1 border-claro cursor-pointer"
                    onClick={() => onPlanClick(plan.id)}
                >
                    <div className="p-5 flex-grow text-left">
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">{plan.name}</h3>
                        <p className="text-gray-600 mb-4 text-sm">{plan.description}</p>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-4">
                            {plan.level_id && <DetailItem label="Nivel Cliente" value={getLevelName(plan.level_id)} />}
                            {!plan.level_id && <DetailItem label="Nivel Cliente Mínimo" value={plan.min_customer_level} />}
                            <DetailItem label="Interés" value={parseFloat(plan.interest_rate)} unit="%" />

                            {plan.late_fee_rate && <DetailItem label="Tasa Mora" value={parseFloat(plan.late_fee_rate)} unit="%" />}
                            {plan.late_fee_fixed && <DetailItem label="Mora Fija" value={parseFloat(plan.late_fee_fixed)} unit="$" />}
                            {plan.grace_period_days && <DetailItem label="Días de Gracia" value={plan.grace_period_days} />}
                            {plan.processing_fee_rate && <DetailItem label="Tasa Procesamiento" value={parseFloat(plan.processing_fee_rate)} unit="%" />}
                            {plan.processing_fee_fixed && <DetailItem label="Costo Procesamiento Fijo" value={parseFloat(plan.processing_fee_fixed)} unit="$" />}
                            {plan.min_down_payment_rate && <DetailItem label="Tasa Cuota Inicial Mínima" value={parseFloat(plan.min_down_payment_rate)} unit="%" />}
                            {plan.min_down_payment_fixed && <DetailItem label="Cuota Inicial Fija Mínima" value={parseFloat(plan.min_down_payment_fixed)} unit="$" />}
                            <DetailItem label="Monto Máximo Financiado" value={parseFloat(plan.max_financing_amount)} unit="$" />
                            {plan.cuotas && <DetailItem label="Cuotas" value={plan.cuotas} />}
                            <DetailItem label="Estado" value={plan.status?.name || 'N/A'} />
                            <DetailItem label="Fecha de Registro" value={formatDate(plan.created_at)} />

                            {plan.conditions && (
                                <div className="col-span-1">
                                    <span className="font-medium text-gray-700 text-xs block mb-1">Condiciones:</span>
                                    <JsonDisplay data={plan.conditions} />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default PlansGrid;