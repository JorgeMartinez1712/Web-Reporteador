const CustomerAppUserDetails = ({ customer }) => {
  if (!customer.app_user) {
    return null;
  }

  const isVerified = customer.status_id === 4;
  const hasPurchases = customer.is_active === true;
  const appUser = customer.app_user;

  return (
    <div className="w-full rounded-xl shadow-sm">
      <div className="px-6 pt-5 pb-3">
        <h3 className="flex items-center gap-2 text-emerald-600 text-lg font-medium">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
            <i className="bi bi-gear-fill" />
          </span>
          <span>Datos del Usuario de la Aplicación</span>
        </h3>
      </div>
      <div className="px-6 py-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="text-left">
            <label className="text-sm text-gray-500">Nombre de Usuario</label>
            <div className="mt-1 text-gray-900">{appUser.username}</div>
          </div>

          <div className="text-left">
            <label className="text-sm text-gray-500">Correo de Usuario</label>
            <div className="mt-1 text-gray-900">{appUser.email}</div>
          </div>

        <div className="text-left">
            <label className="text-sm text-gray-500">Estado de Verificación</label>
            <div className="mt-1">
              <span className={
                isVerified
                  ? 'inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800'
                  : 'inline-flex items-center rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-800'
              }>
                {isVerified ? 'Verificado' : 'No Verificado'}
              </span>
            </div>
          </div>

         <div className="text-left">
            <label className="text-sm text-gray-500">Compras Registradas</label>
            <div className="mt-1">
              <span className={
                hasPurchases
                  ? 'inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800'
                  : 'inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-800'
              }>
                {hasPurchases ? 'SÍ' : 'NO'}
              </span>
            </div>
          </div>

         <div className="text-left">
            <label className="text-sm text-gray-500">Fecha de Creación</label>
            <div className="mt-1 text-gray-900">
              {new Date(appUser.created_at).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </div>
          </div>

          <div className="text-left">
            <label className="text-sm text-gray-500">Última Actualización</label>
            <div className="mt-1 text-gray-900">
              {new Date(appUser.updated_at).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerAppUserDetails;