import { useMemo } from 'react';

const mockRows = [
  { id: 'ventas', label: 'Ventas', budget: 620000, actual: 608000 },
  { id: 'costos', label: 'Costos', budget: -320000, actual: -338000 },
  { id: 'gastos', label: 'Gastos operativos', budget: -140000, actual: -128000 },
  { id: 'capex', label: 'Capex', budget: -25000, actual: -30000 },
];

const ComparativeReportPage = () => {
  const glassPanel = 'glass-elevation rounded-3xl border border-glass-border bg-glass-card backdrop-blur-xl';

  const rows = useMemo(() => {
    return mockRows.map((row) => {
      const variance = row.actual - row.budget;
      const pct = row.budget !== 0 ? (variance / Math.abs(row.budget)) * 100 : 0;
      return { ...row, variance, pct };
    });
  }, []);

  const format = (amount) => new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);

  const getBadge = (pct) => {
    if (pct > 5) return 'bg-status-warning-soft text-status-warning';
    if (pct < -5) return 'bg-status-success-soft text-status-success';
    return 'bg-glass-card text-text-base';
  };

  return (
    <div className="min-h-screen bg-app-bg text-text-base p-6 space-y-8">
      <header className="flex flex-col gap-6 mb-4">
        <p className="text-xs uppercase tracking-[0.25em] text-text-muted">Analisis de variaciones</p>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2 text-left">
            <h1 className="text-3xl font-semibold text-text-base">Comparativa Presupuestaria</h1>
            <p className="text-sm text-text-muted">Cruza presupuesto aprobado vs realidad GALAC con semaforos de desviacion.</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="rounded-2xl border border-glass-border px-4 py-2 text-sm font-semibold text-text-base transition hover:border-brand-secondary">Exportar PDF</button>
            <button className="rounded-2xl bg-brand-secondary px-4 py-2 text-sm font-semibold text-text-base transition hover:bg-brand-secondary-soft">Exportar Excel</button>
          </div>
        </div>
      </header>

      <section className={`${glassPanel} p-6 space-y-4`}>
        <div className="grid grid-cols-4 gap-2 text-xs uppercase tracking-[0.2em] text-text-muted px-2">
          <span>Rubro</span>
          <span>Presupuesto</span>
          <span>Real</span>
          <span>Desviacion</span>
        </div>
        <div className="divide-y divide-glass-border">
          {rows.map((row) => (
            <div key={row.id} className="grid grid-cols-4 items-center px-2 py-3 text-sm">
              <span className="font-semibold text-text-base">{row.label}</span>
              <span className="text-text-muted">{format(row.budget)}</span>
              <span className="text-text-base">{format(row.actual)}</span>
              <span className="flex items-center gap-2">
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getBadge(row.pct)}`}>
                  {row.pct.toFixed(1)}%
                </span>
                <span className="text-xs text-text-muted">{format(row.variance)}</span>
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ComparativeReportPage;
