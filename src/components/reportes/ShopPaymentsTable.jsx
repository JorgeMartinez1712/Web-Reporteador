import DataTable from '../common/DataTable';
import moment from 'moment';
import 'moment/locale/es';

moment.locale('es');

const currencyFormatter = new Intl.NumberFormat('es-DO', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
});

const formatCurrency = (value) => {
  const numericValue = Number(value);
  if (Number.isNaN(numericValue)) return currencyFormatter.format(0);
  return currencyFormatter.format(numericValue);
};

const ShopPaymentsTable = ({ payments = [] }) => {
  const rows = payments.map((p, index) => ({
    id: `shop-payment-${index}`,
    date: p.sale_date ? moment(p.sale_date).format('DD/MM/YY') : 'N/A',
    comercialName: p.comercial_name || 'N/A',
    saleAmount: formatCurrency(p.sale_amount),
    montoInicial: formatCurrency(p.monto_inicial),
    amountFinanced: formatCurrency(p.amount_financed),
    amount: formatCurrency(p.amount),
    amountProcessingFee: formatCurrency(p.amount_processing_fee),
    totalPagar: formatCurrency(p.total_pagar),
  }));

  const moneyAlign = { align: 'right', headerAlign: 'right' };

  const columns = [
    { field: 'date', headerName: 'Fecha', flex: 0.8, minWidth: 120 },
    { field: 'comercialName', headerName: 'Comercio', flex: 1.2, minWidth: 200 },
    { field: 'saleAmount', headerName: 'Venta', flex: 0.9, minWidth: 130, ...moneyAlign },
    { field: 'montoInicial', headerName: 'Monto inicial', flex: 0.9, minWidth: 150, ...moneyAlign },
    { field: 'amountFinanced', headerName: 'Monto financiado', flex: 1, minWidth: 160, ...moneyAlign },
    { field: 'amount', headerName: 'Monto', flex: 0.9, minWidth: 130, ...moneyAlign },
    { field: 'amountProcessingFee', headerName: 'Fee procesamiento', flex: 1, minWidth: 170, ...moneyAlign },
    { field: 'totalPagar', headerName: 'Total a pagar', flex: 1, minWidth: 150, ...moneyAlign },
  ];

  return <DataTable rows={rows} columns={columns} />;
};

export default ShopPaymentsTable;
