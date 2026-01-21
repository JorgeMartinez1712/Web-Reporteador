import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import moment from 'moment';
import 'moment/locale/es';
import { FaSpinner } from 'react-icons/fa';
import usePagos from '../../hooks/usePagos';
import ErrorNotification from '../../components/common/ErrorNotification';

moment.locale('es');

const Badge = ({ children, color = 'fuchsia' }) => {
  const map = {
    fuchsia: 'bg-fuchsia-100 text-fuchsia-800',
    yellow: 'bg-yellow-100 text-yellow-800',
    red: 'bg-red-100 text-red-800',
    gray: 'bg-gray-100 text-gray-800',
  };
  const cls = map[color] || map.gray;
  return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${cls}`}>{children}</span>;
};

const Field = ({ label, value }) => (
  <div className="flex flex-col gap-1 text-left">
    <span className="text-xs uppercase tracking-wide text-gray-500 text-left">{label}</span>
    <span className="text-sm font-medium text-gray-900 break-all text-left">{value ?? '—'}</span>
  </div>
);

const currencyFormat = (amount, symbol) => {
  if (amount === null || amount === undefined) return '—';
  const n = Number(amount);
  if (Number.isNaN(n)) return String(amount);
  return `${symbol || ''}${n.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const DetallePagoPage = () => {
  const { id } = useParams();
  const { fetchPagoById } = usePagos(null, { autoFetch: false });
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setLoading(true);
        const data = await fetchPagoById(id);
        if (!mounted) return;
        setPayment(data);
      } catch (e) {
        if (!mounted) return;
        setError(e.message || 'No se pudo cargar el pago.');
        setShowError(true);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, [id, fetchPagoById]);

  useEffect(() => {
    if (!showError) return;
    const t = setTimeout(() => setShowError(false), 4000);
    return () => clearTimeout(t);
  }, [showError]);


  const currencySymbol = payment?.payment_method?.currency?.symbol || '';




  const safeJson = (value) => {
    if (!value || value === 'null') return null;
    try {
      const parsed = typeof value === 'string' ? JSON.parse(value) : value;
      return JSON.stringify(parsed, null, 2);
    } catch {
      return null;
    }
  };

  const PaymentDetailsUI = ({ payment }) => {
    if (!payment) return null;

    const getStatusColor = (status) => {
      const s = String(status || '').toUpperCase();
      if (s.includes('COMPLET') || s.includes('COMPLETADO') || s.includes('COMPLETED')) return 'bg-fuchsia-900 text-white';
      if (s.includes('PEND')) return 'bg-yellow-500 text-white';
      if (s.includes('RECH') || s.includes('FALL')) return 'bg-red-500 text-white';
      return 'bg-gray-500 text-white';
    };


    const formatCurrencyLocal = (amount, currency) => {
      if (amount === null || amount === undefined) return '—';
      const n = Number(amount);
      if (Number.isNaN(n)) return String(amount);
      return `${n.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${currency || ''}`;
    };

    return (
      <div className="space-y-6">

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex flex-wrap gap-4 items-center">
            <span className={`${getStatusColor(payment.status?.code || payment.status?.name)} inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold`}>{payment.status?.name || payment.status?.code}</span>
            <div className="flex items-center gap-2 text-gray-600">
              <i className="bi bi-file-text text-lg" />
              <span>{payment.sale?.sale_code ? `VENTA #${payment.sale.sale_code}` : payment.sale?.id}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <i className="bi bi-calendar text-lg" />
              <span>{payment.created_at ? moment(payment.created_at).format('DD MMM YYYY, HH:mm') : '—'}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <span>#{payment.id}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-3 mb-3">
                <i className="bi bi-person-fill text-fuchsia-900 text-2xl" />
                <h3 className="text-sm font-semibold text-gray-700">Información del Cliente</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Field label="Cliente" value={payment.customer?.full_name || payment.customer?.name} />
                <Field label="ID Cliente" value={payment.customer?.id || payment.customer_id} />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-3 mb-3">
                <i className="bi bi-credit-card text-fuchsia-900 text-2xl" />
                <h3 className="text-sm font-semibold text-gray-700">Información del Pago</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                <Field label="Método de Pago" value={payment.payment_method?.name || payment.payment_method_name} />
                <Field label="Referencia" value={payment.reference_number} />
                <Field label="Monto" value={currencyFormat(payment.amount)} />
                <Field label="Monto Convertido" value={payment.amount_converted ? `Bs ${currencyFormat(payment.amount_converted)}` : '—'} />
              </div>
            </div>


            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-3 mb-3">
                <i className="bi bi-arrow-right text-fuchsia-900 text-2xl" />
                <h3 className="text-sm font-semibold text-gray-700">Cuotas Aplicadas</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-2">Cuota</th>
                      <th className="text-left py-3 px-2">Tipo</th>
                      <th className="text-right py-3 px-2">Monto</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(payment.installments || []).map((inst) => (
                      <tr key={inst.id || inst.installment_id} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="py-3 px-2 text-left">{inst.is_inicial ? 'Inicial' : `Cuota #${inst.number ?? inst.installment_number}`}</td>
                        <td className="py-3 px-2 text-left">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-blue-50 text-blue-700 border border-blue-200">{inst.payment_type || inst.payment_type_name}</span>
                        </td>
                        <td className="py-3 px-2 text-right">{formatCurrencyLocal(inst.amount_applied, payment.bcv_currency?.code || payment.bcv_currency_id || 'VES')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-3 mb-3">
                <i className="bi bi-info-circle text-fuchsia-900 text-2xl" />
                <h3 className="text-sm font-semibold text-gray-700">Información Técnica</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-gray-500 text-sm mb-1 text-left">Solicitud Gateway</p>
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                    {safeJson(payment.request_gateway) ? (
                      <pre className="text-xs text-gray-700 overflow-x-auto whitespace-pre-wrap text-left">{safeJson(payment.request_gateway)}</pre>
                    ) : (
                      <div className="text-sm text-gray-500">—</div>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-gray-500 text-sm mb-1 text-left">Respuesta Gateway</p>
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                    {safeJson(payment.response_gateway) ? (
                      <pre className="text-xs text-gray-700 overflow-x-auto whitespace-pre-wrap text-left">{safeJson(payment.response_gateway)}</pre>
                    ) : (
                      <div className="text-sm text-gray-500">—</div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Notas */}
            {payment.notes && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center gap-3 mb-3">
                  <i className="bi bi-file-text text-fuchsia-900 text-2xl" />
                  <h3 className="text-sm font-semibold text-gray-700">Notas</h3>
                </div>
                <div>
                  <p className="text-gray-700">{payment.notes}</p>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            {(payment.retail_unit?.retail?.comercial_name || payment.retail_unit_name || payment.processed_by?.user?.name || payment.processed_by_name) && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center gap-3 mb-3">
                  <i className="bi bi-building text-fuchsia-900 text-2xl" />
                  <h3 className="text-sm font-semibold text-gray-700">Información Administrativa</h3>
                </div>
                <div className="space-y-4">
                  {payment.retail_unit?.retail?.comercial_name || payment.retail_unit_name ? (
                    <div className='text-left'>
                      <p className="text-gray-500 text-sm">Unidad Retail</p>
                      <p className="text-gray-700">{payment.retail_unit?.retail?.comercial_name || payment.retail_unit_name}</p>
                    </div>
                  ) : null}
                  {payment.processed_by?.user?.name || payment.processed_by_name ? (
                    <div className='text-left'>
                      <p className="text-gray-500 text-sm">Procesado Por</p>
                      <div className="flex items-center gap-2 mt-1">
                        <i className="bi bi-person-check text-fuchsia-900 text-lg" />
                        <p className="text-gray-700">{payment.processed_by?.user?.name || payment.processed_by_name}</p>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            )}

            <div className="bg-gradient-to-br from-fuchsia-50 to-teal-50 border border-fuchsia-200 rounded-xl p-6">
              <h4 className="text-fuchsia-800 font-semibold text-left">Resumen</h4>
              <div className="space-y-3 mt-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Estado:</span>
                  <span className={`${getStatusColor(payment.status?.code || payment.status?.name)} inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold`}>{payment.status?.name || payment.status?.code}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Pagado:</span>
                  <span className="text-fuchsia-950 font-semibold">{payment.amount_converted ? `${currencyFormat(payment.amount_converted)} VES` : currencyFormat(payment.amount, currencySymbol)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Cuotas Aplicadas:</span>
                  <span className="text-fuchsia-950 font-semibold">{(payment.installments || []).length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-full mx-auto  p-8">
      <div className="w-full flex justify-between items-center mb-6">
        <h2 className="text-xl font-extrabold text-fuchsia-950 tracking-tight">Detalle de pago</h2>
        <div className="flex items-center gap-3">
          {payment?.sale?.id && (
            <Link to={`/ventas/${payment.sale.id}`} className="bg-fuchsia-900 text-white py-2 px-4 rounded-lg hover:bg-fuchsia-950 cursor-pointer">
              Ver venta
            </Link>
          )}
        </div>
      </div>

      {loading && (
        <div className="flex justify-center items-center min-h-[200px]">
          <FaSpinner className="animate-spin text-fuchsia-900 text-4xl" />
        </div>
      )}

      {showError && error && (
        <div className="mb-4">
          <ErrorNotification message={error} onClose={() => setShowError(false)} />
        </div>
      )}

      {!loading && payment && <PaymentDetailsUI payment={payment} />}
    </div>
  );
};

export default DetallePagoPage;