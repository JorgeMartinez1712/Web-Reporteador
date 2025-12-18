import DataTable from '../common/DataTable';
import moment from 'moment';
import 'moment/locale/es';

moment.locale('es');

const InventoryTable = ({ inventories }) => {
  const rows = (inventories || []).map(item => ({
    ...item,
    id: item.id,
    imei: item.imei || 'N/A',
    productName: item.product ? item.product.name : 'N/A',
    brandName: item.product?.brand ? item.product.brand.name : 'N/A',
    categoryName: item.product?.category ? item.product.category.name : 'N/A',
    retailUnitName: item.retail_unit ? item.retail_unit.name : 'N/A',
    statusName: item.status ? item.status.name : 'N/A',
    deviceLockStatusName: item.device_lock_status ? item.device_lock_status.name : 'N/A',
    statusDate: item.status_device_date ? moment(item.status_device_date).format('DD/MM/YY HH:mm') : 'N/A'
  }));

  const columns = [
    { field: 'imei', headerName: 'IMEI', flex: 1, minWidth: 140 },
    { field: 'productName', headerName: 'Producto', flex: 1.2, minWidth: 160 },
    { field: 'brandName', headerName: 'Marca', flex: 1, minWidth: 120 },
    { field: 'categoryName', headerName: 'Categoría', flex: 1, minWidth: 140 },
    { field: 'retailUnitName', headerName: 'Sucursal', flex: 1, minWidth: 140 },
    { field: 'statusName', headerName: 'Estado', flex: 0.9, minWidth: 120 },
    { field: 'deviceLockStatusName', headerName: 'Bloqueo', flex: 0.9, minWidth: 120 }
  ];

  return <DataTable rows={rows} columns={columns} />;
};

export default InventoryTable;