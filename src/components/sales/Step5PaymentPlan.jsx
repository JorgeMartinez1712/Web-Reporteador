import { useState, useMemo, useEffect } from 'react';
import * as FaIcons from 'react-icons/fa';
import PaymentFormModal from './PaymentFormModal';
import useSales from '../../hooks/useSales';
import { useNavigate } from 'react-router-dom';

const PaymentDetailsTable = ({ payments, currency }) => {
  return (
    <div className="mt-6 pt-4 text-left">
      <p className="text-md font-semibold text-gray-800 mb-4">Pagos realizados:</p>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">
                Fecha de Pago
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">
                Método de Pago
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 tracking-wider">
                Monto
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {payments.map((payment, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {payment.date ? new Date(payment.date).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }) : 'Fecha no disponible'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {payment.method || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-700">
                  {`${currency?.symbol || ''} ${parseFloat(payment.amount).toFixed(2)}`}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const InstallmentDetailsCard = ({ currency, payments, initialPaymentAmount }) => {
  const displayAmount = (initialPaymentAmount && !isNaN(initialPaymentAmount)) ? parseFloat(initialPaymentAmount).toFixed(2) : '0.00';

  return (
    <div className=" bg-white">
      <h3 className="text-xl font-semibold text-gray-800 text-left">Detalle del pago</h3>
      <div className="mt-2 pt-2 border-gray-200 text-left">
        <div className="flex justify-between items-center">
          <h4 className="text-md font-normal text-gray-800">Pago Inicial:</h4>
          <span className="font-semibold text-gray-900">{`${currency?.symbol || ''} ${displayAmount}`}</span>
        </div>
      </div>
      {payments.length > 0 && <PaymentDetailsTable payments={payments} currency={currency} />}
    </div>
  );
};

const Step5PaymentPlan = ({ onConfirm, onPrev, saleData, currentUser, onError, onShowSuccess, onShowWarning, isEnrollmentReady }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [paymentData, setPaymentData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { submitInitialPayment, paymentMethods, completeSale, fetchPaymentMethods } = useSales({ autoFetchSales: false });
  const navigate = useNavigate();

  useEffect(() => {
    fetchPaymentMethods();
  }, [fetchPaymentMethods]);

  const saleId = saleData?.saleDetails?.id || saleData?.saleId;
  const currency = saleData?.saleDetails?.currency || { symbol: '$' };

  const handleOpenModal = async (methodId) => {
    if (!saleId) {
      onError('Error: ID de venta no disponible para procesar el pago.');
      return;
    }

    try {
      const payload = {
        sale_id: saleId,
        payment_method_id: methodId
      };
      const response = await submitInitialPayment(payload);
      setPaymentData(response.data);
      setIsModalOpen(true);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error al obtener el detalle del método de pago.';
      onError(errorMessage);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setPaymentData(null);
  };

  const handlePaymentComplete = (apiResponse, isCompleted) => {
    let newPayments = saleData.payments || [];

    if (apiResponse.installment_summary && apiResponse.installment_summary.payments) {
      newPayments = apiResponse.installment_summary.payments.map(payment => ({
        date: payment.date,
        amount: payment.amount_applied,
        method: payment.payment_methods || 'N/A'
      }));
    }

    const updatedSaleData = {
      ...saleData,
      payments: newPayments,
      saleDetails: { 
        ...saleData.saleDetails,
        ...(apiResponse.sale || {}),
      },
    };

    onConfirm(updatedSaleData, isCompleted);
    handleCloseModal();
  };

  const handleCompleteSale = async () => {
    if (!saleId) {
      onError('Error: ID de venta no disponible para finalizar.');
      return;
    }

    setIsLoading(true);
    try {
      await completeSale(saleId);
      onShowSuccess('Venta finalizada con éxito. Redirigiendo...');
      setTimeout(() => {
        navigate(`/ventas/${saleId}`);
      }, 2000);
    } catch (error) {
      const errorMessage = error.message || error.response?.data?.message || 'Error al finalizar la venta.';
      onError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const getIconComponent = (iconName) => {
    const IconComponent = FaIcons[iconName];
    return IconComponent ? IconComponent : null;
  };

  const payments = useMemo(() => {
    if (!saleData?.payments) return [];

    return saleData.payments.map(payment => {
      const pivotInfo = payment.pivot;

      if (pivotInfo) {
        return {
          date: pivotInfo.created_at || pivotInfo.date,
          amount: pivotInfo.amount_applied,
          method: payment.payment_method?.name,
        };
      }

      return {
        date: payment.date,
        amount: payment.amount,
        method: payment.method || payment.payment_method?.name,
      };
    });
  }, [saleData]);

  const filteredPaymentMethods = paymentMethods.filter(method => method.type === 1 || method.type === 3);

 

  return (
    <div className="bg-white p-8 rounded-lg max-w-full mx-auto space-y-6">
      <div>
        <label className="block text-2xl pb-4 font-semibold border-gray-200 text-gray-800 mb-4 text-left border-b">
          Selecciona Método de Pago Inicial
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {filteredPaymentMethods.map((method) => {
            const IconComponent = getIconComponent(method.icon);
            if (!IconComponent) return null;
            const isSelected = paymentData?.method_payment?.id === method.id;
            return (
              <div
                key={method.id}
                className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 text-left
								${isSelected ? 'border-claro bg-bg shadow-lg' : 'border-gray-300 bg-white hover:border-gray-400'}`}
                onClick={() => handleOpenModal(method.id)}
              >
                <IconComponent className={`text-3xl mr-3 ${isSelected ? 'text-oscuro' : 'text-gray-500'}`} />
                <span className={`text-md font-medium ${isSelected ? 'text-oscuro' : 'text-gray-700'}`}>{method.name}</span>
              </div>
            );
          })}
        </div>
      </div>
      <InstallmentDetailsCard
        financingContract={saleData.financingContract}
        installments={saleData.installments}
        currency={currency}
        payments={payments}
        initialPaymentAmount={saleData.initialPaymentAmount}
      />
      {isEnrollmentReady && (
        <div className="mt-6 pt-6 border-gray-200">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-6 md:space-y-0 md:space-x-8">
            <div className="flex-1 w-full md:w-auto">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Detalle de la Venta</h2>
              <div className="bg-gray-100 p-6 rounded-lg shadow-inner">
                <p className="text-lg text-gray-700 font-semibold mb-2">Producto: {saleData?.product?.name}</p>
                <p className="text-gray-600 mb-2">Monto Total: ${saleData?.totalAmount}</p>
                <p className="text-gray-600 mb-2">Plan de Financiamiento: {saleData?.financingPlan?.name}</p>
              </div>
            </div>
            
          </div>
        </div>
      )}
      <div className="flex justify-between items-center mt-6 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={onPrev}
          className="bg-gray-300 text-gray-800 px-5 py-2 rounded-lg hover:bg-gray-400 transition duration-300 font-medium"
        >
          Anterior
        </button>
        <div className="flex space-x-4">
          {isEnrollmentReady && (
            <button
              type="button"
              onClick={handleCompleteSale}
              disabled={isLoading}
              className={`flex items-center justify-center px-5 py-2 rounded-lg transition duration-300 font-medium text-white
							${isLoading
                  ? 'bg-claro cursor-not-allowed'
                  : 'bg-oscuro hover:bg-hover'
                }`}
            >
              {isLoading ? (
                <>
                  <FaIcons.FaSpinner className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                  Finalizando...
                </>
              ) : (
                'Finalizar Venta'
              )}
            </button>
          )}
        </div>
      </div>
      <PaymentFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onPaymentComplete={handlePaymentComplete}
        paymentData={paymentData}
        saleData={saleData}
        currentUser={currentUser}
        onShowWarning={onShowWarning}
        onError={onError}
        onShowSuccess={onShowSuccess}
      />
    </div>
  );
};

export default Step5PaymentPlan;