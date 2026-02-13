import { useMemo, useState } from 'react';
import GlassSelect from '../../components/common/GlassSelect';

const logsMock = [
  { id: 'l1', user: 'admin@demo.com', action: 'Borró usuario', detail: 'Eliminó acceso de analista-004', date: '2026-02-12 09:14' },
  { id: 'l2', user: 'admin@demo.com', action: 'Cambio de tasa', detail: 'Actualizó tasa BCV a 36.52', date: '2026-02-12 08:43' },
  { id: 'l3', user: 'soporte@demo.com', action: 'Bloqueo', detail: 'Bloqueó IP por 5 intentos fallidos', date: '2026-02-11 22:05' },
  { id: 'l4', user: 'auditor@demo.com', action: 'Descarga masiva', detail: 'Exportó CSV de clientes', date: '2026-02-11 18:32' },
];

const AdminAuditLogsPage = () => {
  const glassPanel = 'glass-elevation rounded-3xl border border-glass-border bg-glass-card backdrop-blur-xl';
  const [filters, setFilters] = useState({ user: 'todos', action: 'todos', date: '' });

  const filteredLogs = useMemo(() => {
    return logsMock.filter((log) => {
      const matchUser = filters.user === 'todos' || log.user === filters.user;
      const matchAction = filters.action === 'todos' || log.action === filters.action;
      const matchDate = !filters.date || log.date.startsWith(filters.date);
      return matchUser && matchAction && matchDate;
    });
  }, [filters]);

  return (
    <div className="min-h-screen bg-app-bg text-text-base p-6 space-y-8">
      <header className="flex flex-col gap-6 mb-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-4">
          <div className="space-y-2 text-left">
            <h1 className="text-3xl font-semibold text-text-base">Logs de auditoría</h1>
            <p className="text-sm text-text-muted">Filtra por fecha, usuario o acción para rastrear movimientos sensibles.</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <GlassSelect
              value={filters.user}
              onChange={(value) => setFilters((prev) => ({ ...prev, user: value }))}
              options={[
                { value: 'todos', label: 'Todos los usuarios' },
                { value: 'admin@demo.com', label: 'admin@demo.com' },
                { value: 'soporte@demo.com', label: 'soporte@demo.com' },
                { value: 'auditor@demo.com', label: 'auditor@demo.com' },
              ]}
              icon="bi bi-person"
              className="w-52"
            />
            <GlassSelect
              value={filters.action}
              onChange={(value) => setFilters((prev) => ({ ...prev, action: value }))}
              options={[
                { value: 'todos', label: 'Todas las acciones' },
                { value: 'Borró usuario', label: 'Borró usuario' },
                { value: 'Cambio de tasa', label: 'Cambio de tasa' },
                { value: 'Bloqueo', label: 'Bloqueo' },
                { value: 'Descarga masiva', label: 'Descarga masiva' },
              ]}
              icon="bi bi-filter-square"
              className="w-52"
            />
            <input
              type="date"
              value={filters.date}
              onChange={(e) => setFilters((prev) => ({ ...prev, date: e.target.value }))}
              className="rounded-2xl border border-glass-border bg-glass-card px-4 py-3 text-sm text-text-base focus:outline-none focus:ring-2 focus:ring-brand-secondary"
            />
          </div>
        </div>
      </header>

      <section className={`${glassPanel} p-6 space-y-3`}>
        <div className="grid grid-cols-1 gap-2 text-sm">
          {filteredLogs.map((log) => (
            <div key={log.id} className="grid grid-cols-12 items-start rounded-2xl border border-glass-border bg-glass-card-strong px-4 py-3">
              <div className="col-span-3 space-y-1">
                <p className="text-xs uppercase tracking-[0.25em] text-text-muted">Usuario</p>
                <p className="font-semibold text-text-base">{log.user}</p>
              </div>
              <div className="col-span-3 space-y-1">
                <p className="text-xs uppercase tracking-[0.25em] text-text-muted">Acción</p>
                <p className="font-semibold text-text-base">{log.action}</p>
              </div>
              <div className="col-span-4 space-y-1">
                <p className="text-xs uppercase tracking-[0.25em] text-text-muted">Detalle</p>
                <p className="text-text-base">{log.detail}</p>
              </div>
              <div className="col-span-2 space-y-1 text-right">
                <p className="text-xs uppercase tracking-[0.25em] text-text-muted">Fecha</p>
                <p className="font-semibold text-text-base">{log.date}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AdminAuditLogsPage;
