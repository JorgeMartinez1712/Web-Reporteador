import { DataGrid } from '@mui/x-data-grid';
import { esES } from '@mui/x-data-grid/locales';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

const DataTable = ({
  rows,
  columns,
  onViewDetails,
  onEdit,
  onDelete,
  viewDetailsCondition = () => true,
  editCondition = () => true,
  renderEditAction,
}) => {
  const enhancedColumns = [
    {
      field: 'rowNumber',
      headerName: '#',
      width: 70,
      headerClassName: 'custom-header',
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        const rowIndex = rows.findIndex((row) => row.id === params.row.id);
        return rowIndex !== -1 ? rowIndex + 1 : '';
      },
    },
    ...columns.map((col) => ({
      ...col,
      headerClassName: 'custom-header',
    })),
  ];

  if (onViewDetails || onEdit || onDelete) {
    enhancedColumns.push({
      field: 'actions',
      headerName: '',
      flex: 1,
      minWidth: 150,
      headerClassName: 'custom-header',
      sortable: false,
      filterable: false,
      renderHeader: () => (
        <div className="flex justify-center w-full">
          <i className="bi bi-nut text-base text-gray"></i>
        </div>
      ),
      renderCell: (params) => (
        <div className="flex gap-3 h-full items-center">
          {onViewDetails && viewDetailsCondition(params.row) && (
            <Tippy content="Ver detalles" placement="bottom">
              <button
                className="w-6 h-6 flex items-center justify-center rounded-full p-0 cursor-pointer bg-blue-200 hover:bg-blue-300 text-blue-500"
                onClick={() => onViewDetails(params.row)}
              >
                <i className="bi bi-eye text-base"></i>
              </button>
            </Tippy>
          )}
          {onEdit && editCondition(params.row) && (
            renderEditAction ? (
              renderEditAction(params.row, onEdit)
            ) : (
              <Tippy content="Editar" placement="bottom">
                <button
                  className="w-6 h-6 flex items-center justify-center rounded-full p-0 cursor-pointer bg-yellow-200 hover:bg-yellow-300 text-yellow-700"
                  onClick={() => onEdit(params.row)}
                >
                  <i className="bi bi-pencil-square text-base"></i>
                </button>
              </Tippy>
            )
          )}
          {onDelete && (
            <Tippy content="Eliminar" placement="bottom">
              <button
                className="w-6 h-6 flex items-center justify-center rounded-full p-0 cursor-pointer bg-red-200 hover:bg-red-300 text-red-500"
                onClick={() => onDelete(params.row)}
              >
                <i className="bi bi-trash text-base text-red-500"></i>
              </button>
            </Tippy>
          )}
        </div>
      ),
    });
  }

  return (
    <div style={{ width: '100%', padding: 16 }}>
      <DataGrid
        rows={rows}
        columns={enhancedColumns}
        autoHeight
        localeText={esES.components.MuiDataGrid.defaultProps.localeText}
        className="custom-data-grid"
        disableExtendRowFullWidth={false}
      />
    </div>
  );
};

export default DataTable;