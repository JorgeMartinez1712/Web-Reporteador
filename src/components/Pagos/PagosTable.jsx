import DataTable from '../common/DataTable';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaSpinner } from 'react-icons/fa';
import moment from 'moment';
import 'moment/locale/es';

moment.locale('es');

const PagosTable = ({ pagos, loading }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const category = location.pathname.startsWith('/pagos/iniciales') ? 'iniciales' : location.pathname.startsWith('/pagos/cuotas') ? 'cuotas' : null;
  const processedPagos = pagos.map((pago) => ({
    ...pago,
    id: pago.id,
    customerName: pago.customer ? pago.customer.full_name : 'N/A',
    saleCode: pago.sale ? pago.sale.sale_code : 'N/A',
    paymentMethod: pago.payment_method ? pago.payment_method.name : 'N/A',
    retailUnit: pago.retail_unit ? pago.retail_unit.name : 'N/A',
    amount: `${pago.amount} USD`,
    registrationDate: moment(pago.created_at).format('DD/MM/YY'),
  }));

  const columns = [
    { field: 'saleCode', headerName: 'Código de venta', flex: 1, minWidth: 120 },
    { field: 'customerName', headerName: 'Cliente', flex: 1.5, minWidth: 180 },
    { field: 'paymentMethod', headerName: 'Método de pago', flex: 1, minWidth: 150 },
    { field: 'amount', headerName: 'Monto', flex: 0.8, minWidth: 100 },
    { field: 'retailUnit', headerName: 'Sucursal', flex: 1.2, minWidth: 150 },
    { field: 'registrationDate', headerName: 'Registro', flex: 1, minWidth: 100 },
  ];

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center min-h-screen">
          <FaSpinner className="animate-spin text-emerald-600 text-4xl" />
        </div>
      ) : (
        <DataTable
          rows={processedPagos}
          columns={columns}
          onViewDetails={(row) => {
            if (category) sessionStorage.setItem('lastPaymentCategory', category);
            navigate(`/pagos/detalle/${row.id}`, { state: { paymentCategory: category } });
          }}
          onEdit={null}
          onDelete={null}
        />
      )}
    </>
  );
};

export default PagosTable;