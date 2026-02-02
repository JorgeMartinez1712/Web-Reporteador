import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import './DataTable.css';

const actionStyles = {
  view: 'bg-brand-secondary-soft text-brand-secondary hover:bg-brand-secondary-soft/80',
  edit: 'bg-brand-primary-soft text-brand-primary hover:bg-brand-primary-soft/80',
  delete: 'bg-status-warning-soft text-status-warning hover:bg-status-warning-soft/80',
};

const DataTable = ({
  rows = [],
  columns = [],
  onViewDetails,
  onEdit,
  onDelete,
  viewDetailsCondition = () => true,
  editCondition = () => true,
  renderEditAction,
}) => {
  const hasActions = Boolean(onViewDetails || onEdit || onDelete);

  const renderCellValue = (column, row) => {
    const cellParams = {
      row,
      value: row[column.field],
      field: column.field,
    };
    if (typeof column.renderCell === 'function') {
      return column.renderCell(cellParams);
    }
    return cellParams.value ?? '—';
  };

  const renderActions = (row) => (
    <div className="table-actions flex flex-wrap items-center gap-2">
      {onViewDetails && viewDetailsCondition(row) && (
        <Tippy content="Ver detalles" placement="bottom">
          <button
            className={`table-action-btn ${actionStyles.view}`}
            onClick={() => onViewDetails(row)}
            type="button"
          >
            <i className="bi bi-eye text-base" />
          </button>
        </Tippy>
      )}
      {onEdit && editCondition(row) && (
        renderEditAction ? (
          renderEditAction(row, onEdit)
        ) : (
          <Tippy content="Editar" placement="bottom">
            <button
              className={`table-action-btn ${actionStyles.edit}`}
              onClick={() => onEdit(row)}
              type="button"
            >
              <i className="bi bi-pencil-square text-base" />
            </button>
          </Tippy>
        )
      )}
      {onDelete && (
        <Tippy content="Eliminar" placement="bottom">
          <button
            className={`table-action-btn ${actionStyles.delete}`}
            onClick={() => onDelete(row)}
            type="button"
          >
            <i className="bi bi-trash text-base text-status-warning" />
          </button>
        </Tippy>
      )}
    </div>
  );

  return (
    <div className="custom-table-wrapper">
      <div className="custom-table-scroll">
        <div className="custom-table-scroll-inner">
          <table className="custom-table">
          <thead>
            <tr>
              <th className="table-index">#</th>
              {columns.map((column) => (
                <th
                  key={column.field}
                  style={{
                    minWidth: column.minWidth ? `${column.minWidth}px` : undefined,
                    width: column.width ? `${column.width}px` : undefined,
                    textAlign: column.align || 'left',
                  }}
                >
                  {column.headerName || column.field}
                </th>
              ))}
              {hasActions && (
                <th className="table-actions-header">
                  <i className="bi bi-nut" />
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td
                  className="table-empty"
                  colSpan={columns.length + 1 + (hasActions ? 1 : 0)}
                >
                  <div className="flex flex-col items-center gap-2 text-center">
                    <i className="bi bi-inboxes text-2xl text-brand-secondary" />
                    <p className="text-sm text-text-muted">No hay registros disponibles.</p>
                  </div>
                </td>
              </tr>
            ) : (
              rows.map((row, index) => (
                <tr key={row.id ?? `row-${index}`}>
                  <td className="table-index-value">{index + 1}</td>
                  {columns.map((column) => (
                    <td
                      key={`${row.id ?? index}-${column.field}`}
                      style={{ textAlign: column.align || 'left' }}
                    >
                      {renderCellValue(column, row)}
                    </td>
                  ))}
                  {hasActions && <td className="table-actions-cell">{renderActions(row)}</td>}
                </tr>
              ))
            )}
          </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DataTable;