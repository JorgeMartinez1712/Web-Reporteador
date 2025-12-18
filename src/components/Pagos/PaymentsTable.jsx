import { FaMoneyBillWave, FaCreditCard, FaRegCalendarAlt, FaDollarSign } from 'react-icons/fa';
import moment from 'moment';

const iconMap = {
    FaMoneyBillWave: FaMoneyBillWave,
    FaCreditCard: FaCreditCard,
};

const PaymentsTable = ({ paymentResponseData }) => {
    if (!paymentResponseData || !paymentResponseData.data || !paymentResponseData.data.financing_contract || !paymentResponseData.data.financing_contract.installments) {
        return <p className="text-gray-500 text-center py-4">No hay datos de pagos para mostrar.</p>;
    }

    const allPayments = paymentResponseData.data.financing_contract.installments
        .filter(installment => !installment.is_inicial && installment.payments && installment.payments.length > 0)
        .flatMap(installment => {
            return installment.payments.map(payment => {
                const amount = parseFloat(payment.pivot.amount_applied || payment.amount);
                const paymentDate = payment.pivot.created_at;
                const installmentNumber = installment.number;
                const paymentMethodName = payment.payment_method.name;
                const PaymentIcon = iconMap[payment.payment_method.icon] || FaCreditCard;

                return {
                    installmentNumber: installmentNumber,
                    paymentDate: paymentDate,
                    amount: amount,
                    methodName: paymentMethodName,
                    MethodIcon: PaymentIcon,
                };
            });
        })
        .sort((a, b) => new Date(b.paymentDate) - new Date(a.paymentDate));

    if (allPayments.length === 0) {
        return <p className="text-gray-500 text-center py-4">No se han encontrado pagos aplicados a cuotas regulares.</p>;
    }

    return (
        <div className="overflow-x-auto mt-4">
            <h4 className="font-bold text-gray-800 mb-3 flex items-center">
                Historial de Pagos
            </h4>
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            <span className="flex items-center"><FaRegCalendarAlt className="mr-1" /> Cuota</span>
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            <span className="flex items-center"><FaRegCalendarAlt className="mr-1" /> Fecha de Pago</span>
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Monto Aplicado (USD)
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Método
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {allPayments.map((payment, index) => (
                        <tr key={index} className={payment.installmentNumber === null ? 'bg-yellow-50' : ''}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-left">
                                {payment.installmentNumber}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-left">
                                {moment(payment.paymentDate).format('DD/MM/YYYY hh:mm A')}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-left">
                                ${payment.amount.toFixed(2)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-left">
                                <span className="flex items-center">
                                    {payment.methodName}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default PaymentsTable;