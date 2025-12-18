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

const ProfitabilityTable = ({ data = [] }) => {
  const rows = data.map((item, index) => ({
    id: `profit-${index}`,
    saleDate: item.sale_date ? moment(item.sale_date).format('DD/MM/YY') : 'N/A',
    saleAmount: formatCurrency(item.sale_amount),
    initialAmount: formatCurrency(item.monto_inicial),
    amountFinanced: formatCurrency(item.amount_financed),
    processingFee: formatCurrency(item.amount_processing_fee),
  }));

  const columns = [
    { field: 'saleDate', headerName: 'Fecha', flex: 0.8, minWidth: 110 },
    { field: 'saleAmount', headerName: 'Monto venta', flex: 1, minWidth: 130, align: 'right', headerAlign: 'right' },
    { field: 'initialAmount', headerName: 'Inicial', flex: 0.9, minWidth: 110, align: 'right', headerAlign: 'right' },
    { field: 'amountFinanced', headerName: 'Financiado', flex: 1, minWidth: 130, align: 'right', headerAlign: 'right' },
    { field: 'processingFee', headerName: 'Tarifa procesamiento', flex: 1.2, minWidth: 170, align: 'right', headerAlign: 'right' },
  ];

  return <DataTable rows={rows} columns={columns} />;
};

export default ProfitabilityTable;
