import { useMemo, useState } from 'react';
import GlassSelect from '../../components/common/GlassSelect';

const clientsMock = [
  { id: 'c1', company: 'LogiTrans C.A.', rif: 'J-40112233-9', plan: 'Corporativo', expires: '15 Mar 2026', status: 'Activo', users: 18, devices: 24 },
  { id: 'c2', company: 'Innova Retail', rif: 'J-29887766-1', plan: 'Pro', expires: '02 Mar 2026', status: 'Moroso', users: 8, devices: 12 },
  { id: 'c3', company: 'AgroServicios Andes', rif: 'J-12003456-7', plan: 'Basico', expires: '28 Feb 2026', status: 'Suspendido', users: 4, devices: 6 },
  { id: 'c4', company: 'Banca Nova', rif: 'J-55443322-0', plan: 'Enterprise', expires: '30 Abr 2026', status: 'Activo', users: 42, devices: 55 },
];

const statusTone = {
  Activo: 'bg-status-success-soft text-status-success',
  Moroso: 'bg-status-warning-soft text-status-warning',
  Suspendido: 'bg-status-danger-soft text-status-danger',
};

const AdminClientsPage = () => {
  const glassPanel = 'glass-elevation rounded-3xl border border-glass-border bg-glass-card backdrop-blur-xl';
  const [filter, setFilter] = useState('todos');

  const filtered = useMemo(() => {
    if (filter === 'todos') return clientsMock;
    if (filter === 'morosos') return clientsMock.filter((c) => c.status === 'Moroso');
    if (filter === 'suspendidos') return clientsMock.filter((c) => c.status === 'Suspendido');
    return clientsMock;
  }, [filter]);

  return (
    <div className="min-h-screen bg-app-bg text-text-base p-6 space-y-8">
      <header className="flex flex-col gap-6 mb-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-4">
          <div className="space-y-2 text-left">
            <h1 className="text-3xl font-semibold text-text-base">Gestión de clientes</h1>
            <p className="text-sm text-text-muted">Maestro de suscriptores, dispositivos y usuarios ocupados.</p>
          </div>
          <GlassSelect
            value={filter}
            onChange={setFilter}
            options={[
              { value: 'todos', label: 'Todos' },
              { value: 'morosos', label: 'Morosos' },
              { value: 'suspendidos', label: 'Suspendidos' },
            ]}
            icon="bi bi-funnel"
            className="w-48"
          />
        </div>
      </header>

      <section className={`${glassPanel} p-6 space-y-4`}>
        <div className="grid grid-cols-1 gap-3 text-sm">
          <div className="grid grid-cols-12 items-center px-3 py-2 text-xs uppercase tracking-[0.25em] text-text-muted">
            <span className="col-span-3">Empresa</span>
            <span className="col-span-2">Plan</span>
            <span className="col-span-2">Vencimiento</span>
            <span className="col-span-2">Estatus</span>
            <span className="col-span-3 text-right">Usuarios / Dispositivos</span>
          </div>
          {filtered.map((client) => (
            <div key={client.id} className="grid grid-cols-12 items-center rounded-2xl border border-glass-border bg-glass-card-strong px-3 py-3">
              <div className="col-span-3 space-y-1">
                <p className="font-semibold text-text-base">{client.company}</p>
                <p className="text-xs text-text-muted">{client.rif}</p>
              </div>
              <div className="col-span-2 text-sm text-text-base">{client.plan}</div>
              <div className="col-span-2 text-sm text-text-base">{client.expires}</div>
              <div className="col-span-2">
                <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusTone[client.status] || 'bg-glass-card text-text-muted'}`}>
                  {client.status}
                </span>
              </div>
              <div className="col-span-3 flex items-center justify-end gap-2">
                <span className="text-sm text-text-base">{client.users} usuarios</span>
                <span className="text-sm text-text-muted">{client.devices} disp.</span>
                <button className="rounded-xl border border-glass-border bg-glass-card px-3 py-1 text-xs font-semibold text-text-base transition hover:border-brand-secondary">
                  Suspender acceso
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AdminClientsPage;
