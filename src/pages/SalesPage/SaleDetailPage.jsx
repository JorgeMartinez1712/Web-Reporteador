import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useSales from '../../hooks/useSales';
import { FaSpinner, FaArrowLeft, FaUser, FaStore, FaCalendarAlt, FaAddressCard, FaPhone, FaMapMarkerAlt, FaStickyNote } from 'react-icons/fa';
import ErrorNotification from '../../components/common/ErrorNotification';
import GenerateSalePDF from '../../components/sales/GenerateSalePDF';

const SaleDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchSaleById, loading, error } = useSales({ autoFetchSales: false });
  const [sale, setSale] = useState(null);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const getSale = async () => {
      if (id) {
        try {
          const saleData = await fetchSaleById(id);
          if (saleData && !['COMPLETADA', 'RECHAZADA', 'PAGO INICIAL'].includes(saleData.sale_status?.name?.toUpperCase())) {
            navigate('/ventas', { replace: true });
            return;
          }
          setSale(saleData);
        } catch (err) {
          console.error("Failed to fetch sale details:", err);
        }
      }
    };
    getSale();
  }, [id, fetchSaleById, navigate]);

  useEffect(() => {
    if (showError) {
      const timer = setTimeout(() => {
        setShowError(false);
        setErrorMessage('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showError]);

  const getStatusClass = (status) => {
    const statusString = typeof status === 'string' ? status : String(status);
    switch (statusString.toUpperCase()) {
      case 'PENDIENTE':
        return 'text-yellow-800 bg-yellow-100';
      case 'APROBADA':
        return 'text-blue-800 bg-blue-100';
      case 'RECHAZADA':
        return 'text-red-800 bg-red-100';
      case 'COMPLETADA':
        return 'text-emerald-800 bg-emerald-100';
      case 'PAGO INICIAL':
        return 'text-purple-800 bg-purple-100';
      default:
        return 'text-gray-800 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <FaSpinner className="animate-spin text-emerald-600 text-5xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-600 bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Error al cargar la venta</h2>
          <p>{error.message || 'Ocurrió un error desconocido.'}</p>
        </div>
      </div>
    );
  }

  if (!sale) {
    return null;
  }

  const {
    retail_unit,
    customer,
    seller,
    currency,
    sale_status,
    sale_code,
    sale_items,
    financing_contract,
    sale_date,
    notes,
  } = sale;

  const displaySaleStatus = sale_status?.name || 'ID ' + sale_status?.id || 'Desconocido';

  const regularInstallments = financing_contract?.installments
    ?.filter(inst => !inst.is_inicial)
    .sort((a, b) => a.number - b.number);

  const allPayments = financing_contract?.installments
    ?.flatMap(inst =>
      inst.payments.map(payment => ({
        ...payment,
        installmentNumber: inst.number === 0 ? 'Inicial' : inst.number,
      }))
    ) || [];

  const showProductsAndButtons = sale_status?.name?.toUpperCase() !== 'RECHAZADA';

  return (
    <div className="bg-white min-h-screen p-8">
      <ErrorNotification isOpen={showError} message={errorMessage} />
      <div className="max-w-full mx-auto">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8">
          <h1 className="text-2xl font-bold text-emerald-700">
            Orden N°{sale_code}
          </h1>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors font-semibold"
          >
            <FaArrowLeft />
            Volver
          </button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 p-6 bg-white rounded-lg shadow-sm border border-emerald-200 space-y-8">
            <div>
              <h3 className="text-md font-bold text-gray-900 mb-4 text-left">Datos de la orden</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-start">
                <div className="flex items-center gap-2">
                  <FaUser className="text-gray-500" />
                  <p className="mt-1 text-md text-gray-900 text-left">{seller?.user?.name || 'N/A'}</p>
                </div>
                <div className="flex items-center gap-2">
                  <FaStore className="text-gray-500" />
                  <p className="mt-1 text-md text-gray-900 text-left">{retail_unit?.name || 'N/A'}</p>
                </div>
                <div className="flex items-center gap-2">
                  <FaCalendarAlt className="text-gray-500" />
                  <p className="mt-1 text-md text-gray-900 text-left">{sale_date ? new Date(sale_date).toLocaleDateString() : 'N/A'}</p>
                </div>

              </div>
              <h3 className="text-md font-bold text-gray-900 mt-6 mb-4 text-left">Datos de facturación</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 items-start">
                <div className="flex items-center gap-2">
                  <FaUser className="text-gray-500" />
                  <p className="mt-1 text-md text-gray-900 text-left">{customer?.full_name || 'N/A'}</p>
                </div>
                <div className="flex items-center gap-2">
                  <FaAddressCard className="text-gray-500" />
                  <p className="mt-1 text-md text-gray-900 text-left">{customer?.document_number || 'N/A'}</p>
                </div>
                <div className="flex items-center gap-2">
                  <FaPhone className="text-gray-500" />
                  <p className="mt-1 text-md text-gray-900 text-left">{customer?.phone_number || 'N/A'}</p>
                </div>
                <div className="flex items-center gap-2">
                  <FaMapMarkerAlt className="text-gray-500" />
                  <p className="mt-1 text-md text-gray-900 text-left">{customer?.address || 'N/A'}</p>
                </div>
              </div>
            </div>
            {notes && (
              <div className="col-span-1 sm:col-span-3">
                <div className="flex items-start gap-2">
                  <div>
                    <p className="text-sm font-bold text-left">Notas de la Orden</p>
                    <p className="mt-1 text-md text-gray-900 text-left whitespace-pre-wrap">{notes}</p>
                  </div>
                </div>
              </div>
            )}
            {showProductsAndButtons && (
              <div>
                <h3 className="text-md font-bold text-gray-900 mb-4 text-left">Producto</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">SKU</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">Descripción</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 tracking-wider">Monto</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {sale_items?.length > 0 ? (
                        sale_items.map((item) => (
                          <tr key={item.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-left">
                              {item.product?.sku || 'N/A'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-left">
                              {item.product?.name || 'N/A'}
                              <br />
                              <span className="text-xs text-gray-400">
                                {item.product_inventory?.imei || item.product_inventory?.serial_number || ''}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-right">
                              {`${currency?.symbol || ''} ${parseFloat(item.total_price).toFixed(2)}`}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="3" className="py-4 px-4 text-center text-sm text-gray-500">
                            No hay productos asociados.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            {showProductsAndButtons && financing_contract && (
              <div>
                <h3 className="text-md font-bold text-gray-900 mb-4 text-left">Detalle del contrato de financiamiento</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-12 gap-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500 text-left">Plan de financiamiento</p>
                    <p className="mt-1 text-md text-gray-900 text-left">{financing_contract.financing_plan?.name || 'N/A'}</p>
                  </div>
                  {parseFloat(financing_contract.amount_financed) > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-500 text-left">Monto financiado</p>
                      <p className="mt-1 text-md text-gray-900 text-left">{`${currency?.symbol || ''} ${parseFloat(financing_contract.amount_financed).toFixed(2)}`}</p>
                    </div>
                  )}
                  {parseFloat(financing_contract.amount_processing_fee) > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-500 text-left">Comisión de procesamiento</p>
                      <p className="mt-1 text-md text-gray-900 text-left">{`${currency?.symbol || ''} ${parseFloat(financing_contract.amount_processing_fee).toFixed(2)}`}</p>
                    </div>
                  )}
                  {financing_contract.installment_frecuency > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-500 text-left">Frecuencia de cuotas</p>
                      <p className="mt-1 text-md text-gray-900 text-left">{financing_contract.installment_frecuency} días</p>
                    </div>
                  )}
                  {financing_contract.day_grace_period > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-500 text-left">Días de gracia</p>
                      <p className="mt-1 text-md text-gray-900 text-left">{financing_contract.day_grace_period}</p>
                    </div>
                  )}
                  {parseFloat(financing_contract.amount_late_fee) > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-500 text-left">Recargo por mora</p>
                      <p className="mt-1 text-md text-gray-900 text-left">
                        {`${currency?.symbol || ''}${parseFloat(financing_contract.amount_late_fee).toFixed(2)}`}
                      </p>
                    </div>
                  )}
                  {financing_contract.day_penalty > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-500 text-left">Días de penalidad</p>
                      <p className="mt-1 text-md text-gray-900 text-left">{financing_contract.day_penalty}</p>
                    </div>
                  )}
                  {parseFloat(financing_contract.amount_penalty) > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-500 text-left">Penalidad</p>
                      <p className="mt-1 text-md text-gray-900 text-left">
                        {`${currency?.symbol || ''}${parseFloat(financing_contract.amount_penalty).toFixed(2)}`}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
            {showProductsAndButtons && regularInstallments && regularInstallments.length > 0 && (
              <div>
                <h3 className="text-md font-bold text-gray-900 mb-4 text-left">Detalle de cuotas</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">#Cuota</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">Fecha de vencimiento</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 tracking-wider">Monto</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {regularInstallments.map((installment) => (
                        <tr key={installment.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-left">
                            {installment.number}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-left">
                            {installment.due_date ? new Date(installment.due_date).toLocaleDateString() : 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-right">
                            {`${currency?.symbol || ''} ${parseFloat(installment.amount).toFixed(2)}`}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            {showProductsAndButtons && allPayments.length > 0 && (
              <div>
                <h3 className="text-md font-bold text-gray-900 mb-4 text-left">Detalle de pagos</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">#Cuota</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">Método de pago</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">Fecha</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 tracking-wider">Monto</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {allPayments.map((payment) => (
                        <tr key={payment.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-left">
                            {payment.installmentNumber}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-left">
                            {payment.payment_method?.name || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-left">
                            {payment.pivot.created_at ? new Date(payment.pivot.created_at).toLocaleDateString() : 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-right">
                            {`${currency?.symbol || ''} ${parseFloat(payment.pivot.amount_applied).toFixed(2)}`}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
          <div className="lg:col-span-1 space-y-6">
            <div className="p-6 bg-white rounded-lg shadow-sm border border-emerald-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-md font-bold text-gray-900 text-left">Resumen de la orden</h3>
                <span className={`inline-block px-3 py-1 text-sm font-semibold rounded-full ${getStatusClass(sale_status?.name)}`}>
                  {displaySaleStatus}
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-semibold">{`${currency?.symbol || ''} ${parseFloat(financing_contract?.amount_sale || 0).toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between border-t mt-4 pt-4">
                  <span className="text-gray-500">Total de la orden</span>
                  <span className="font-bold text-lg">{`${currency?.symbol || ''} ${parseFloat(financing_contract?.total_amount_pay || 0).toFixed(2)}`}</span>
                </div>
              </div>
              {showProductsAndButtons && (
                <div className="flex justify-around gap-4 mt-6 pt-4 border-t border-gray-200">
                  <GenerateSalePDF
                    saleData={sale}
                    allPayments={allPayments}
                    sellerName={seller?.user?.name}
                    saleCode={sale_code}
                  />
                  <button className="flex items-center justify-center w-12 h-12 rounded-full p-2 bg-green-500 hover:bg-green-600 text-white transition-colors">
                    <i className="bi bi-whatsapp text-xl"></i>
                  </button>
                  <button className="flex items-center justify-center w-12 h-12 rounded-full p-2 bg-blue-500 hover:bg-blue-600 text-white transition-colors">
                    <i className="bi bi-envelope-fill text-xl"></i>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SaleDetailPage;