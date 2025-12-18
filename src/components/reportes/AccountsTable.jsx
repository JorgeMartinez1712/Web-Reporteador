import DataTable from '../common/DataTable'
import moment from 'moment'
import 'moment/locale/es'

moment.locale('es')

const decimalFormatter = new Intl.NumberFormat('es-DO', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
})

const formatCurrency = value => {
  const numericValue = Number(value)
  if (Number.isNaN(numericValue)) return `$${decimalFormatter.format(0)}`
  return `$${decimalFormatter.format(numericValue)}`
}

const AccountsTable = ({ accounts = [] }) => {
  const rows = accounts.map((account, index) => ({
    id: `${account.sale_code}-${index}`,
    sale_code: account.sale_code,
    full_name: account.full_name,
    sale_date: moment(account.sale_date).format('DD/MM/YYYY hh:mm A'),
    monto_inicial: formatCurrency(account.monto_inicial),
    paid_amount: formatCurrency(account.paid_amount),
    amount_processing_fee: formatCurrency(account.amount_processing_fee),
    amount_sale: formatCurrency(account.amount_sale),
    installment_number: account.installment_number,
    amount_financed: formatCurrency(account.amount_financed)
  }))

  const columns = [
    { field: 'sale_code', headerName: 'Cód. Venta', flex: 1, minWidth: 120 },
    { field: 'full_name', headerName: 'Cliente', flex: 1.5, minWidth: 200 },
    { field: 'sale_date', headerName: 'Fecha Venta', flex: 1, minWidth: 180 },
    { field: 'monto_inicial', headerName: 'Monto Inicial', flex: 1, minWidth: 150, align: 'right', headerAlign: 'right' },
    { field: 'paid_amount', headerName: 'Monto Pagado', flex: 1, minWidth: 150, align: 'right', headerAlign: 'right' },
    { field: 'amount_processing_fee', headerName: 'Comisión', flex: 1, minWidth: 120, align: 'right', headerAlign: 'right' },
    { field: 'amount_sale', headerName: 'Monto Venta', flex: 1, minWidth: 150, align: 'right', headerAlign: 'right' },
    { field: 'installment_number', headerName: 'Cuotas', flex: 0.8, minWidth: 100 },
    { field: 'amount_financed', headerName: 'Monto Financiado', flex: 1, minWidth: 160, align: 'right', headerAlign: 'right' }
  ]

  return <DataTable rows={rows} columns={columns} />
}

export default AccountsTable
