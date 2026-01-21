import { useEffect, useCallback } from 'react';
import { FaSpinner } from 'react-icons/fa';
import useReportes from '../../hooks/useReportes';
import ShopPaymentsTable from '../../components/reportes/ShopPaymentsTable';
import FiltroReportes from '../../components/reportes/FiltroReportes';
import ErrorNotification from '../../components/common/ErrorNotification';

const ShopPage = () => {
  const { shopPayments, loading, errors, fetchShopPaymentsReport } = useReportes();

  useEffect(() => {
    fetchShopPaymentsReport({});
  }, [fetchShopPaymentsReport]);

  const handleFilter = useCallback(
    (filterParams) => {
      const params = {};
      if (filterParams.initialDate) params.initialDate = filterParams.initialDate;
      if (filterParams.endDate) params.endDate = filterParams.endDate;
      if (filterParams.retailId) params.retailId = filterParams.retailId;
      fetchShopPaymentsReport(params);
    },
    [fetchShopPaymentsReport]
  );

  const isLoading = loading.shopPayments;
  const errorShopPayments = errors.shopPayments;

  return (
    <div className="min-h-screen p-8 relative">
      {errorShopPayments && <ErrorNotification message={errorShopPayments} />}
      <div className="w-full flex justify-between items-center mb-8">
        <h2 className="text-xl font-extrabold text-fuchsia-950 tracking-tight text-left mr-10">Pagos en tienda</h2>
        <FiltroReportes onFilter={handleFilter} />
      </div>


      {isLoading ? (
        <div className="flex justify-center items-center min-h-[240px]">
          <FaSpinner className="animate-spin text-fuchsia-900 text-4xl" />
        </div>
      ) : (
        <ShopPaymentsTable payments={shopPayments} />
      )}
    </div>
  );
};

export default ShopPage;