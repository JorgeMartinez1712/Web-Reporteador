import { useMemo } from 'react';
import ReportCard from '../../components/common/ReportCard';
import GlassSelect from '../../components/common/GlassSelect';

const overviewCards = [
  { id: 'mrr', label: 'MRR mensual', value: '$124k', detail: '+6% vs mes anterior', icon: 'bi bi-cash-coin' },
  { id: 'subs', label: 'Suscriptores activos', value: '186', detail: 'Empresas en producción', icon: 'bi bi-people-fill' },
  { id: 'pending', label: 'Solicitudes pendientes', value: '14', detail: 'Expedientes listos para aprobar', icon: 'bi bi-hourglass-split' },
  { id: 'churn', label: 'Churn', value: '2.1%', detail: 'Tasa de deserción mensual', icon: 'bi bi-graph-down' },
];

const AdminHomePage = () => {
  const glassPanel = 'glass-elevation rounded-3xl border border-glass-border bg-glass-card backdrop-blur-xl';

  const newCompaniesChart = useMemo(
    () => ({
      labels: ['Sep', 'Oct', 'Nov', 'Dic', 'Ene', 'Feb'],
      datasets: [
        { label: 'Nuevas empresas', data: [12, 15, 18, 21, 25, 28] },
      ],
    }),
    [],
  );

  return (
    <div className="min-h-screen bg-app-bg text-text-base p-6 space-y-8">
      <header className="space-y-3">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-4">
          <div className="space-y-2 text-left">
            <h1 className="text-3xl font-semibold text-text-base">Panel de control</h1>
            <p className="text-sm text-text-muted ">MRR, suscriptores, onboarding y churn en una sola vista.</p>
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

      <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <ReportCard
          className="xl:col-span-2"
          title="Crecimiento de empresas"
          description="Nuevos registros por mes"
          chartConfig={newCompaniesChart}
          chartInitialType="line"
          chartHeight={320}
        />
        <div className={`${glassPanel} p-6 space-y-4`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-text-muted">Cola de pendientes</p>
              <p className="text-lg font-semibold text-text-base">Acciones rápidas</p>
            </div>
            <GlassSelect
              value="semana"
              options={[
                { value: 'hoy', label: 'Hoy' },
                { value: 'semana', label: 'Semana' },
                { value: 'mes', label: 'Mes' },
              ]}
              icon="bi bi-calendar-event"
              className="w-32"
              onChange={() => {}}
            />
          </div>
          <div className="space-y-3 text-sm">
            <button className="w-full text-left rounded-2xl border border-glass-border bg-glass-card-strong px-4 py-3 font-semibold text-text-base transition hover:border-brand-secondary">
              Revisar {overviewCards.find((c) => c.id === 'pending')?.value} expedientes de onboarding
            </button>
            <button className="w-full text-left rounded-2xl border border-glass-border bg-glass-card-strong px-4 py-3 font-semibold text-text-base transition hover:border-brand-secondary">
              Auditar movimientos sensibles de hoy
            </button>
            <button className="w-full text-left rounded-2xl border border-glass-border bg-glass-card-strong px-4 py-3 font-semibold text-text-base transition hover:border-brand-secondary">
              Revisar morosidad de clientes
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminHomePage;
