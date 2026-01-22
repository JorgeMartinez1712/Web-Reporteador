import { useEffect } from 'react';
import { FaSpinner } from 'react-icons/fa';
import usePagos from '../../hooks/usePagos';
import PagosTable from '../../components/Pagos/PagosTable';

const InitialPaymentsPage = () => {
  const { pagos: payments, loading } = usePagos('/payments/initial');

  useEffect(() => {
    sessionStorage.setItem('lastPaymentCategory', 'iniciales');
  }, []);

  const pagosWithCreatedAt = (payments || []).map((p) => ({
    ...p,
    created_at: p.created_at || p.sale?.sale_date || null,
  }));

  return (
    <div className="min-h-screen p-8 relative">
      <div className="w-full flex justify-between items-center mb-8">
        <h2 className="text-xl font-extrabold text-hover tracking-tight">Pagos iniciales</h2>
      </div>
      {loading ? (
        <div className="flex justify-center items-center min-h-screen">
          <FaSpinner className="animate-spin text-oscuro text-4xl" />
        </div>
      ) : (
        <PagosTable pagos={pagosWithCreatedAt} loading={loading} />
      )}
    </div>
  );
};

export default InitialPaymentsPage;
