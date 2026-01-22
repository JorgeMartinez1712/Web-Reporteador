import { useEffect, useCallback } from 'react';
import { FaSpinner } from 'react-icons/fa';
import useReportes from '../../hooks/useReportes';
import OrdersTable from '../../components/reportes/OrdersTable';
import FiltroReportes from '../../components/reportes/FiltroReportes';
import ErrorNotification from '../../components/common/ErrorNotification';

const OrdersPage = () => {
  const { orders, loading, errors, fetchOrdersReport } = useReportes();

  useEffect(() => {
    fetchOrdersReport({})
  }, [fetchOrdersReport])

  const handleFilter = useCallback(
    filterParams => {
      const params = {}
      if (filterParams.initialDate) params.initialDate = filterParams.initialDate
      if (filterParams.endDate) params.endDate = filterParams.endDate
      if (filterParams.retailId) params.retailId = filterParams.retailId
      fetchOrdersReport(params)
    },
    [fetchOrdersReport]
  )

  const isLoading = loading.orders
  const errorOperations = errors.orders

  return (
    <div className="min-h-screen p-8 relative">
      {errorOperations && <ErrorNotification message={errorOperations} />}
      <div className="w-full flex justify-between items-center mb-8">
        <h2 className="text-xl font-extrabold text-hover tracking-tight text-left mr-10">Ordenes</h2>
        <FiltroReportes onFilter={handleFilter} />
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center min-h-[240px]">
          <FaSpinner className="animate-spin text-oscuro text-4xl" />
        </div>
      ) : (
        <OrdersTable orders={orders} />
      )}
    </div>
  )
}

export default OrdersPage;