const overviewCards = [
  { id: 'onboarding', label: 'Onboarding en revision', value: '12', detail: 'expedientes activos', icon: 'bi bi-hourglass-split' },
  { id: 'subs', label: 'Suscripciones activas', value: '86', detail: 'SaaS operadores', icon: 'bi bi-people-fill' },
  { id: 'compliance', label: 'Alertas de compliance', value: '4', detail: 'documentos vencidos', icon: 'bi bi-shield-exclamation' },
  { id: 'support', label: 'Tickets abiertos', value: '9', detail: 'prioridad media', icon: 'bi bi-chat-dots' },
];

const SuperAdminHomePage = () => {
  const glassPanel = 'glass-elevation rounded-3xl border border-glass-border bg-glass-card backdrop-blur-xl';

  return (
    <div className="min-h-screen bg-app-bg text-text-base p-6 space-y-8">
      <header className="space-y-3">
        <p className="text-xs uppercase tracking-[0.35em] text-text-muted">Operador SaaS</p>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold text-text-base">Control global de suscripciones</h1>
            <p className="text-sm text-text-muted">Supervisa planes, aprobaciones y cumplimiento legal.</p>
          </div>
          <button className="rounded-2xl bg-brand-secondary px-5 py-3 text-sm font-semibold text-text-base transition hover:bg-brand-secondary-soft">
            Crear nuevo plan
          </button>
        </div>
      </header>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {overviewCards.map((card) => (
          <div key={card.id} className={`${glassPanel} p-5 space-y-3`}>
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-[0.25em] text-text-muted">{card.label}</p>
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-glass-card">
                <i className={`${card.icon} text-lg text-brand-secondary`} />
              </span>
            </div>
            <p className="text-3xl font-semibold text-text-base">{card.value}</p>
            <p className="text-sm text-text-muted">{card.detail}</p>
          </div>
        ))}
      </section>

      <section className={`${glassPanel} p-6 space-y-4`}>
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-text-muted">Procesos criticos</p>
          <p className="text-lg font-semibold text-text-base">Queue de aprobaciones</p>
        </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <button className="rounded-2xl border border-glass-border px-4 py-3 text-sm font-semibold text-text-base hover:border-brand-secondary">
            Revisar onboarding
          </button>
          <button className="rounded-2xl border border-glass-border px-4 py-3 text-sm font-semibold text-text-base hover:border-brand-secondary">
            Auditoria global
          </button>
          <button className="rounded-2xl border border-glass-border px-4 py-3 text-sm font-semibold text-text-base hover:border-brand-secondary">
            Ver suscriptores
          </button>
        </div>
      </section>
    </div>
  );
};

export default SuperAdminHomePage;
