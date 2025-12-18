import DataTable from '../common/DataTable';
import moment from 'moment';
import 'moment/locale/es';

moment.locale('es');

const currencyFormatter = new Intl.NumberFormat('es-DO', {
  style: 'currency',
  currency: 'USD',
  currencyDisplay: 'narrowSymbol',
  minimumFractionDigits: 2,
});

const formatCurrency = (value) => {
  const numericValue = Number(value);
  if (Number.isNaN(numericValue)) return currencyFormatter.format(0);
  return currencyFormatter.format(numericValue);
};

const OrdersTable = ({ orders = [] }) => {
  const rows = orders.map((op, index) => ({
    id: `${op.imei || op.email || op.name || 'order'}-${index}`,
    saleDate: op.sale_date ? moment(op.sale_date).format('DD/MM/YY') : 'N/A',
    imei: op.imei || 'N/A',
    customerName: op.name || 'N/A',
    email: op.email || 'N/A',
    amountSale: formatCurrency(op.amount_sale),
    initialAmount: formatCurrency(op.monto_inicial),
    amountFinanced: formatCurrency(op.amount_financed),
    installments: op.installment_number ?? 'N/A',
    paidAmount: formatCurrency(op.paid_amount ?? 0),
  }));

  const columns = [
    { field: 'saleDate', headerName: 'Fecha', flex: 0.8, minWidth: 110 },
    { field: 'imei', headerName: 'IMEI', flex: 1, minWidth: 140 },
    { field: 'customerName', headerName: 'Cliente', flex: 1.2, minWidth: 180 },
    { field: 'email', headerName: 'Email', flex: 1.4, minWidth: 200 },
  { field: 'amountSale', headerName: 'Monto venta', flex: 1, minWidth: 130, align: 'right', headerAlign: 'right' },
  { field: 'initialAmount', headerName: 'Inicial', flex: 0.9, minWidth: 110, align: 'right', headerAlign: 'right' },
  { field: 'amountFinanced', headerName: 'Financiado', flex: 1, minWidth: 130, align: 'right', headerAlign: 'right' },
    { field: 'installments', headerName: 'Cuotas', flex: 0.6, minWidth: 90 },
  { field: 'paidAmount', headerName: 'Pagado', flex: 0.9, minWidth: 110, align: 'right', headerAlign: 'right' },
  ];

  return <DataTable rows={rows} columns={columns} />;
};

export default OrdersTable;
