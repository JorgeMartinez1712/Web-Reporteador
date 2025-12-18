import { useEffect, useCallback } from 'react'
import { FaSpinner } from 'react-icons/fa'
import useReportes from '../../hooks/useReportes'
import AccountsTable from '../../components/reportes/AccountsTable'
import FiltroReportes from '../../components/reportes/FiltroReportes'
import ErrorNotification from '../../components/common/ErrorNotification'

const AccountsPage = () => {
  const { accounts, loading, errors, fetchAccountsReport } = useReportes()

  useEffect(() => {
    fetchAccountsReport({})
  }, [fetchAccountsReport])

  const handleFilter = useCallback(
    filterParams => {
      const params = {}
      if (filterParams.initialDate) params.initialDate = filterParams.initialDate
      if (filterParams.endDate) params.endDate = filterParams.endDate
      if (filterParams.retailId) params.retailId = filterParams.retailId
      fetchAccountsReport(params)
    },
    [fetchAccountsReport]
  )

  const isLoadingAccounts = loading.accounts
  const errorAccounts = errors.accounts

  return (
    <div className="min-h-screen p-8 relative">
      {errorAccounts && <ErrorNotification message={errorAccounts} />}
      <div className="w-full flex justify-between items-center mb-8">
        <h2 className="text-xl font-extrabold text-emerald-700 tracking-tight text-left mr-10">Cuentas por cobrar</h2>
        <FiltroReportes onFilter={handleFilter} />
      </div>

      {isLoadingAccounts ? (
        <div className="flex justify-center items-center min-h-[240px]">
          <FaSpinner className="animate-spin text-emerald-600 text-4xl" />
        </div>
      ) : (
        <AccountsTable accounts={accounts} />
      )}
    </div>
  )
};

export default AccountsPage;