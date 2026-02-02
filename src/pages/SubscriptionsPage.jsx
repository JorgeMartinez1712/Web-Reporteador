import { useMemo, useState } from 'react';
import DataTable from '../components/common/DataTable';
import GlassSelect from '../components/common/GlassSelect';

const tenantSubscriptions = [
  {
    id: 'atlantic-retail',
    name: 'Atlantic Retail Group',
    industry: 'Retail / Moda',
    status: 'activa',
    plan: 'Empresarial',
    seats: 120,
    seatsUsed: 108,
    billingCycle: 'Anual',
    mrr: 7800,
    renewalDate: '2026-03-12T00:00:00Z',
    contact: 'gabriela.vera@atlantic.com',
    region: 'LATAM Norte',
    devices: { web: 80, mobile: 160 },
  },
  {
    id: 'sierra-foods',
    name: 'Sierra Foods Holding',
    industry: 'Consumo masivo',
    status: 'expira',
    plan: 'Plus',
    seats: 80,
    seatsUsed: 74,
    billingCycle: 'Mensual',
    mrr: 4200,
    renewalDate: '2026-02-18T00:00:00Z',
    contact: 'licencias@sierrafoods.com',
    region: 'Región Andina',
    devices: { web: 40, mobile: 80 },
  },
  {
    id: 'pacifico-pharma',
    name: 'Pacífico Pharma',
    industry: 'Salud y farma',
    status: 'activa',
    plan: 'Plus',
    seats: 55,
    seatsUsed: 37,
    billingCycle: 'Trimestral',
    mrr: 2500,
    renewalDate: '2026-05-05T00:00:00Z',
    contact: 'finanzas@pacificopharma.com',
    region: 'LATAM Sur',
    devices: { web: 32, mobile: 64 },
  },
  {
    id: 'aurora-energy',
    name: 'Aurora Energy Partners',
    industry: 'Energía y petróleo',
    status: 'suspendida',
    plan: 'Essential',
    seats: 25,
    seatsUsed: 0,
    billingCycle: 'Mensual',
    mrr: 950,
    renewalDate: '2026-01-22T00:00:00Z',
    contact: 'ops@auroraenergy.io',
    region: 'Caribe',
    devices: { web: 10, mobile: 20 },
  },
  {
    id: 'delta-logistics',
    name: 'Delta Logistics',
    industry: 'Logística y transporte',
    status: 'activa',
    plan: 'Essential',
    seats: 30,
    seatsUsed: 19,
    billingCycle: 'Mensual',
    mrr: 1200,
    renewalDate: '2026-02-02T00:00:00Z',
    contact: 'licencias@deltalogistics.co',
    region: 'LATAM Norte',
    devices: { web: 12, mobile: 24 },
  },
];

const planBadgeStyles = {
  Empresarial: 'bg-brand-primary-soft text-brand-primary',
  Plus: 'bg-brand-secondary-soft text-brand-secondary',
  Essential: 'bg-surface-mid text-text-base',
};

const statusStyles = {
  activa: 'bg-status-success-soft text-status-success',
  expira: 'bg-brand-accent/20 text-brand-accent',
  suspendida: 'bg-status-warning-soft text-status-warning',
};

const filterOptions = {
  status: [
    { label: 'Todas', value: 'all' },
    { label: 'Activas', value: 'active' },
    { label: 'Por expirar', value: 'expiring' },
    { label: 'Suspendidas', value: 'suspended' },
  ],
  plan: [
    { label: 'Todos los planes', value: 'all' },
    { label: 'Empresarial', value: 'Empresarial' },
    { label: 'Plus', value: 'Plus' },
    { label: 'Essential', value: 'Essential' },
  ],
};

const SubscriptionsPage = () => {
  const [filters, setFilters] = useState({ query: '', status: 'all', plan: 'all' });
  const [tenants] = useState(tenantSubscriptions);

  const renewalFormatter = useMemo(
    () => new Intl.DateTimeFormat('es-VE', { month: 'short', day: 'numeric', year: 'numeric' }),
    [],
  );

  const currencyFormatter = useMemo(
    () => new Intl.NumberFormat('es-VE', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }),
    [],
  );

  const filteredTenants = useMemo(() => {
    const query = filters.query.trim().toLowerCase();
    return tenants.filter((tenant) => {
      const matchesQuery = !query
        || tenant.name.toLowerCase().includes(query)
        || tenant.industry.toLowerCase().includes(query)
        || tenant.region.toLowerCase().includes(query);
      const matchesStatus =
        filters.status === 'all'
        || (filters.status === 'active' && tenant.status === 'activa')
        || (filters.status === 'expiring' && tenant.status === 'expira')
        || (filters.status === 'suspended' && tenant.status === 'suspendida');
      const matchesPlan = filters.plan === 'all' || tenant.plan === filters.plan;
      return matchesQuery && matchesStatus && matchesPlan;
    });
  }, [filters, tenants]);

  const stats = useMemo(() => {
    const total = tenants.length;
    const active = tenants.filter((tenant) => tenant.status === 'activa').length;
    const totalSeats = tenants.reduce((sum, tenant) => sum + tenant.seats, 0);
    const usedSeats = tenants.reduce((sum, tenant) => sum + tenant.seatsUsed, 0);
    const mrr = tenants.reduce((sum, tenant) => sum + tenant.mrr, 0);

    const nextRenewal = tenants
      .filter((tenant) => tenant.status !== 'suspendida')
      .sort((a, b) => new Date(a.renewalDate) - new Date(b.renewalDate))[0];

    return {
      total,
      active,
      utilization: totalSeats ? Math.round((usedSeats / totalSeats) * 100) : 0,
      mrr,
      nextRenewal,
    };
  }, [tenants]);

  const upcomingExpirations = useMemo(
    () => tenants
      .filter((tenant) => tenant.status !== 'suspendida')
      .sort((a, b) => new Date(a.renewalDate) - new Date(b.renewalDate))
      .slice(0, 4),
    [tenants],
  );

  const columns = useMemo(
    () => [
      {
        field: 'name',
        headerName: 'Empresa',
        minWidth: 220,
        renderCell: ({ row }) => (
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold text-text-base">{row.name}</span>
            <span className="text-xs text-text-muted">{row.industry}</span>
          </div>
        ),
      },
      {
        field: 'plan',
        headerName: 'Plan',
        minWidth: 150,
        renderCell: ({ row }) => (
          <span className={`inline-flex w-fit items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${planBadgeStyles[row.plan] || 'bg-glass-card'}`}>
            <span className="h-2 w-2 rounded-full bg-current" />
            {row.plan}
          </span>
        ),
      },
      {
        field: 'seats',
        headerName: 'Licencias',
        minWidth: 180,
        renderCell: ({ row }) => (
          <div className="space-y-1">
            <p className="text-sm font-semibold text-text-base">{row.seatsUsed}/{row.seats}</p>
            <div className="h-1.5 rounded-full bg-glass-card">
              <div
                className="h-full rounded-full bg-brand-secondary"
                style={{ width: `${Math.min(100, Math.round((row.seatsUsed / row.seats) * 100))}%` }}
              />
            </div>
          </div>
        ),
      },
      {
        field: 'billingCycle',
        headerName: 'Ciclo',
        minWidth: 120,
      },
      {
        field: 'mrr',
        headerName: 'MRR',
        minWidth: 140,
        align: 'right',
        renderCell: ({ value }) => (
          <span className="font-semibold">{currencyFormatter.format(value)}</span>
        ),
      },
      {
        field: 'renewalDate',
        headerName: 'Renovación',
        minWidth: 160,
        renderCell: ({ value }) => renewalFormatter.format(new Date(value)),
      },
      {
        field: 'status',
        headerName: 'Estado',
        minWidth: 130,
        renderCell: ({ value }) => (
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[value] || 'bg-glass-card text-text-muted'}`}>
            {value === 'activa' && 'Activa'}
            {value === 'expira' && 'Por expirar'}
            {value === 'suspendida' && 'Suspendida'}
          </span>
        ),
      },
    ],
    [currencyFormatter, renewalFormatter],
  );

  const handleFilterChange = (patch) => {
    setFilters((prev) => ({ ...prev, ...patch }));
  };

  return (
    <div className="min-h-screen bg-app-bg text-text-base p-6 space-y-8">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-[0.35em] text-text-muted flex">Administración de clientes</p>
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold flex">Suscripciones y tenants</h1>
            <p className="text-sm text-text-muted mb-4">Monitorea qué empresas tienen acceso, su plan y la fecha de renovación.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button className="rounded-2xl border border-glass-border px-5 py-3 text-sm font-semibold text-text-base hover:border-brand-secondary">
              <i className="bi bi-download me-2" /> Exportar cartera
            </button>
            <button className="rounded-2xl bg-brand-primary px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-primary/30 hover:bg-brand-secondary">
              <i className="bi bi-plus-circle me-2" /> Registrar empresa
            </button>
          </div>
        </div>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="glass-elevation rounded-2xl border border-glass-border bg-glass-card p-5 space-y-2">
          <p className="text-xs uppercase tracking-[0.35em] text-text-muted">Empresas activas</p>
          <p className="text-3xl font-semibold">{stats.active}/{stats.total}</p>
          <p className="text-xs text-text-muted">Tenants con acceso vigente</p>
        </div>
        <div className="glass-elevation rounded-2xl border border-glass-border bg-glass-card p-5 space-y-2">
          <p className="text-xs uppercase tracking-[0.35em] text-text-muted">Uso de licencias</p>
          <p className="text-3xl font-semibold">{stats.utilization}%</p>
          <p className="text-xs text-text-muted">Promedio global sobre el inventario</p>
        </div>
        <div className="glass-elevation rounded-2xl border border-glass-border bg-glass-card p-5 space-y-2">
          <p className="text-xs uppercase tracking-[0.35em] text-text-muted">MRR consolidado</p>
          <p className="text-3xl font-semibold">{currencyFormatter.format(stats.mrr)}</p>
          <p className="text-xs text-text-muted">Ingresos recurrentes mensuales</p>
        </div>
        <div className="glass-elevation rounded-2xl border border-glass-border bg-glass-card p-5 space-y-2">
          <p className="text-xs uppercase tracking-[0.35em] text-text-muted">Próxima renovación</p>
          {stats.nextRenewal ? (
            <div>
              <p className="text-base font-semibold">{stats.nextRenewal.name}</p>
              <p className="text-xs text-text-muted">{renewalFormatter.format(new Date(stats.nextRenewal.renewalDate))}</p>
            </div>
          ) : (
            <p className="text-sm text-text-muted">Sin eventos próximos.</p>
          )}
        </div>
      </section>

      <section className="glass-elevation rounded-3xl border border-glass-border bg-glass-card p-6 space-y-6">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-col gap-3 w-full xl:flex-row xl:items-center">
            <div className="relative w-full xl:w-72">
              <i className="bi bi-search absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                className="w-full rounded-2xl border border-glass-border bg-transparent py-3 pl-11 pr-4 text-sm text-text-base placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand-secondary"
                placeholder="Buscar por empresa, industria o región"
                value={filters.query}
                onChange={(event) => handleFilterChange({ query: event.target.value })}
              />
            </div>
            <GlassSelect
              className="w-full xl:w-56"
              value={filters.plan}
              options={filterOptions.plan}
              onChange={(value) => handleFilterChange({ plan: value })}
              icon="bi bi-layers"
            />
            <GlassSelect
              className="w-full xl:w-56"
              value={filters.status}
              options={filterOptions.status}
              onChange={(value) => handleFilterChange({ status: value })}
              icon="bi bi-activity"
            />
          </div>
          <button
            type="button"
            className="rounded-2xl border border-glass-border px-4 py-3 text-sm font-semibold text-text-base hover:border-brand-secondary"
          >
            <i className="bi bi-arrow-clockwise me-2" /> Sync GALAC/CRM
          </button>
        </div>

        <DataTable
          rows={filteredTenants}
          columns={columns}
          onViewDetails={(row) => console.log('details', row)}
          onEdit={(row) => console.log('edit', row)}
          onDelete={(row) => console.log('delete', row)}
        />
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="glass-elevation rounded-2xl border border-glass-border bg-glass-card p-6 space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold flex">Próximas renovaciones</h2>
              <p className="text-sm text-text-muted">Tenants con pago durante los próximos 45 días.</p>
            </div>
            <button className="text-sm text-brand-secondary">Ver calendario</button>
          </div>
          <div className="space-y-3">
            {upcomingExpirations.map((tenant) => (
              <div key={tenant.id} className="flex items-center justify-between rounded-2xl border border-glass-border bg-glass-card-strong px-4 py-3">
                <div>
                  <p className="text-sm font-semibold text-text-base">{tenant.name}</p>
                  <p className="text-xs text-text-muted">{tenant.region} • {tenant.plan}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-text-base">{renewalFormatter.format(new Date(tenant.renewalDate))}</p>
                  <p className="text-xs text-text-muted">{tenant.billingCycle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="glass-elevation rounded-2xl border border-glass-border bg-glass-card p-6 space-y-4">
          <div>
            <h2 className="text-lg font-semibold">Alertas de capacidad</h2>
            <p className="text-sm text-text-muted">Organizaciones con más del 80% de uso.</p>
          </div>
          <div className="space-y-3">
            {tenants.filter((tenant) => tenant.seatsUsed / tenant.seats >= 0.8).map((tenant) => (
              <div key={tenant.id} className="rounded-2xl border border-status-warning/40 bg-status-warning-soft/40 p-4">
                <div className="flex items-center justify-between text-sm font-semibold text-text-base">
                  <span>{tenant.name}</span>
                  <span>{Math.round((tenant.seatsUsed / tenant.seats) * 100)}%</span>
                </div>
                <p className="text-xs text-text-muted">{tenant.seatsUsed}/{tenant.seats} licencias en uso</p>
                <button className="mt-3 text-xs font-semibold text-brand-secondary">Contactar administrador</button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default SubscriptionsPage;
