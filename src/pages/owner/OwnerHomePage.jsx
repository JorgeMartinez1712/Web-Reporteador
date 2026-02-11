const highlights = [
  { id: 'subs', label: 'Suscripciones activas', value: '18', detail: 'en tu grupo empresarial', icon: 'bi bi-building-check' },
  { id: 'devices', label: 'Dispositivos autorizados', value: '132', detail: 'capacidad total 180', icon: 'bi bi-laptop' },
  { id: 'users', label: 'Usuarios asignados', value: '74', detail: 'roles activos', icon: 'bi bi-people' },
  { id: 'approvals', label: 'Aprobaciones pendientes', value: '5', detail: 'presupuestos en cola', icon: 'bi bi-clipboard-check' },
];

const OwnerHomePage = () => {
  const glassPanel = 'glass-elevation rounded-3xl border border-glass-border bg-glass-card backdrop-blur-xl';

  return (
    <div className="min-h-screen bg-app-bg text-text-base p-6 space-y-8">
      <header className="space-y-3">
        <p className="text-xs uppercase tracking-[0.35em] text-text-muted">Administracion de suscripcion</p>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold text-text-base">Home del administrador</h1>
            <p className="text-sm text-text-muted">Controla usuarios, dispositivos y el estado de tus empresas.</p>
          </div>
          <button className="rounded-2xl border border-glass-border px-5 py-3 text-sm font-semibold text-text-base transition hover:border-brand-secondary">
            Invitar usuarios
          </button>
        </div>
      </header>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {highlights.map((item) => (
          <div key={item.id} className={`${glassPanel} p-5 space-y-3`}>
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-[0.25em] text-text-muted">{item.label}</p>
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-glass-card">
                <i className={`${item.icon} text-lg text-brand-secondary`} />
              </span>
            </div>
            <p className="text-3xl font-semibold text-text-base">{item.value}</p>
            <p className="text-sm text-text-muted">{item.detail}</p>
          </div>
        ))}
      </section>

      <section className={`${glassPanel} p-6 space-y-4`}>
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-text-muted">Acciones rapidas</p>
          <p className="text-lg font-semibold text-text-base">Gestion de suscripciones</p>
        </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <button className="rounded-2xl border border-glass-border px-4 py-3 text-sm font-semibold text-text-base hover:border-brand-secondary">
            Revisar empresas
          </button>
          <button className="rounded-2xl border border-glass-border px-4 py-3 text-sm font-semibold text-text-base hover:border-brand-secondary">
            Aprobar presupuestos
          </button>
          <button className="rounded-2xl border border-glass-border px-4 py-3 text-sm font-semibold text-text-base hover:border-brand-secondary">
            Ver dispositivos
          </button>
        </div>
      </section>
    </div>
  );
};

export default OwnerHomePage;
