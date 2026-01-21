import { useEffect } from 'react';
import { FaSpinner } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import usePagos from '../../hooks/usePagos';
import PagosTable from '../../components/Pagos/PagosTable';

const InstallmentPaymentsPage = () => {
  const { pagos: payments, loading } = usePagos('/payments');

  useEffect(() => {
    sessionStorage.setItem('lastPaymentCategory', 'cuotas');
  }, []);

  const pagosWithCreatedAt = (payments || []).map((p) => ({
    ...p,
    created_at: p.created_at || p.sale?.sale_date || null,
  }));

  return (
    <div className="min-h-screen p-8 relative">
      <div className="w-full flex justify-between items-center mb-8">
        <h2 className="text-xl font-extrabold text-fuchsia-950 tracking-tight">Pagos cuotas</h2>
        <Link to="/pagos/registrar" className="bg-fuchsia-900 text-white py-2 px-4 rounded-lg hover:bg-fuchsia-950 cursor-pointer">
          Registrar
        </Link>
      </div>
      {loading ? (
        <div className="flex justify-center items-center min-h-screen">
          <FaSpinner className="animate-spin text-fuchsia-900 text-4xl" />
        </div>
      ) : (
        <PagosTable pagos={pagosWithCreatedAt} loading={loading} />
      )}
    </div>
  );
};

export default InstallmentPaymentsPage;
