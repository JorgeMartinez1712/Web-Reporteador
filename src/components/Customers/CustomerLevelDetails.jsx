const CustomerLevelDetails = ({ customer }) => {
  const hasLevels = customer.levels && customer.levels.length > 0;

  if (!hasLevels) {
    return null;
  }

  const level = customer.levels[0];
  const pivot = level.pivot || {};

  const creditTotal = Number(pivot.credit || 0);
  const creditDisponible = Number(pivot.credit_available || 0);
  const creditUsado = creditTotal - creditDisponible;
  const utilizacion = creditTotal > 0 ? (creditUsado / creditTotal) * 100 : 0;

  return (
    <div className="w-full rounded-xl shadow-sm">
      <div className="px-6 pt-5 pb-3">
        <h3 className="flex items-center gap-2 text-oscuro text-lg font-medium">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-bg text-oscuro">
            <i className="bi bi-award-fill" />
          </span>
          <span>Nivel Actual del Cliente</span>
        </h3>
      </div>
      <div className="px-6 py-5">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
          <div>
            <label className="text-sm text-gray-500">Nivel</label>
            <div className="mt-1 flex items-center gap-2 text-gray-900">
              <i className="bi bi-award-fill text-yellow-500" />
              <span>{level.descripcion}</span>
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-500">Crédito Total</label>
            <div className="mt-1 text-gray-900">
              ${creditTotal.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-500">Crédito Disponible</label>
            <div className="mt-1 text-green-600">
              ${creditDisponible.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-500">Crédito Usado</label>
            <div className="mt-1 text-blue-600">
              ${creditUsado.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-500">Puntos Acumulados</label>
            <div className="mt-1 text-gray-900">{(pivot.point || 0).toLocaleString('es-ES')}</div>
          </div>

          <div>
            <label className="text-sm text-gray-500">Score Crediticio</label>
            <div className="mt-1 text-gray-900">{customer.status ? customer.status.code : '-'}</div>
          </div>

          <div>
            <label className="text-sm text-gray-500">Estado</label>
            <div className="mt-1">
              <span className={
                pivot.estatus
                  ? 'inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800'
                  : 'inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-800'
              }>
                {pivot.estatus ? 'ACTIVO' : 'INACTIVO'}
              </span>
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-500">Utilización de Crédito</label>
            <div className="mt-1 text-gray-900">{utilizacion.toFixed(1)}%</div>
            <div className="mt-2 h-2 w-full rounded-full bg-gray-200 overflow-hidden">
              <div
                className="h-2 rounded-full bg-claro"
                style={{ width: `${Math.min(utilizacion, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerLevelDetails;