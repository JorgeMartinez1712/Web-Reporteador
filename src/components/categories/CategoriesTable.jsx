import DataTable from '../common/DataTable';

const CategoriesTable = ({ categories = [], onEdit }) => {
  const rows = (Array.isArray(categories) ? categories : []).map((cat) => ({
    id: cat.id,
    code: cat.code,
    name: cat.name,
    description: cat.description,
    retail_name: cat.retail?.comercial_name || cat.retail_id,
  }));

  const columns = [
    { field: 'code', headerName: 'Código', flex: 0.8, minWidth: 120 },
    { field: 'name', headerName: 'Nombre', flex: 1.5, minWidth: 200 },
    { field: 'description', headerName: 'Descripción', flex: 1.5, minWidth: 200 },
    { field: 'retail_name', headerName: 'Empresa', flex: 1, minWidth: 180 },
  ];

  return <DataTable rows={rows} columns={columns} onEdit={onEdit} />;
};

export default CategoriesTable;
