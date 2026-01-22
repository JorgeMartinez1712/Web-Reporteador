import { useEffect, useCallback } from 'react';
import { FaSpinner } from 'react-icons/fa';
import useReportes from '../../hooks/useReportes';
import ProfitabilityTable from '../../components/reportes/ProfitabilityTable';
import FiltroReportes from '../../components/reportes/FiltroReportes';
import ErrorNotification from '../../components/common/ErrorNotification';

const ProfitabilityPage = () => {
  const { profitability, loading, errors, fetchProfitabilityReport } = useReportes();

  useEffect(() => {
    fetchProfitabilityReport({})
  }, [fetchProfitabilityReport])

  const handleFilter = useCallback(
    filterParams => {
      const params = {}
      if (filterParams.initialDate) params.initialDate = filterParams.initialDate
      if (filterParams.endDate) params.endDate = filterParams.endDate
      if (filterParams.retailUnitId) params.retailUnitId = filterParams.retailUnitId
      if (filterParams.retailId) params.retailUnitId = filterParams.retailId
      fetchProfitabilityReport(params)
    },
    [fetchProfitabilityReport]
  )

  const isLoading = loading.profitability
  const errorMsg = errors.profitability

  return (
    <div className="min-h-screen p-8 relative">
      {errorMsg && <ErrorNotification message={errorMsg} />} 
      <div className="w-full flex justify-between items-center mb-8">
        <h2 className="text-xl font-extrabold text-hover tracking-tight text-left mr-10">Rentabilidad</h2>
        <FiltroReportes onFilter={handleFilter} />
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center min-h-[240px]">
          <FaSpinner className="animate-spin text-oscuro text-4xl" />
        </div>
      ) : (
        <ProfitabilityTable data={profitability} />
      )}
    </div>
  )
}

export default ProfitabilityPage;
