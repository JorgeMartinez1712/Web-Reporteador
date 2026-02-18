import { useMemo, useState } from 'react';
import GlassSelect from '../../components/common/GlassSelect';

const periodOptions = [
  { value: 'week', label: 'Semana actual' },
  { value: 'month', label: 'Mes actual' },
  { value: 'quarter', label: 'Trimestre' },
];

const cashflowLines = [
  { id: 'ing1', label: 'Cobros clientes', amount: 180000 },
  { id: 'ing2', label: 'Ingresos operativos', amount: 92000 },
  { id: 'eg1', label: 'Nómina', amount: -82000 },
  { id: 'eg2', label: 'Proveedores', amount: -64000 },
  { id: 'eg3', label: 'Impuestos', amount: -28000 },
];

const CashflowPage = () => {
  const [period, setPeriod] = useState(periodOptions[1].value);
  const [projection, setProjection] = useState(false);
  const glassPanel = 'glass-elevation rounded-3xl border border-glass-border bg-glass-card backdrop-blur-xl';

  const totals = useMemo(() => {
    const base = cashflowLines.reduce((sum, line) => sum + line.amount, 0);
    const projected = projection ? base + 25000 : base;
    return { base, projected };
  }, [projection]);

  const format = (amount) => new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);

  return (
    <div className="min-h-screen bg-app-bg text-text-base p-6 space-y-8">
      <header className="flex flex-col gap-6 mb-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-4">
          <div className="space-y-2 text-left">
            <h1 className="text-3xl font-semibold text-text-base">Flujo de caja real</h1>
            <p className="text-sm text-text-muted">Ingresos y egresos basados en bancos y caja de GALAC.</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <GlassSelect value={period} onChange={setPeriod} options={periodOptions} icon="bi bi-calendar4-week" placeholder="Periodo" className="w-48" />
            <label className="flex items-center gap-2 rounded-2xl border border-glass-border bg-glass-card px-4 py-3 text-sm text-text-base">
              <input type="checkbox" checked={projection} onChange={(e) => setProjection(e.target.checked)} className="rounded border-glass-border" />
              Activar modo proyección
            </label>
          </div>
        </div>
      </header>

      <section className={`${glassPanel} p-6 space-y-4`}>
        <div className="space-y-3">
          {cashflowLines.map((line) => (
            <div key={line.id} className="flex items-center justify-between rounded-2xl border border-glass-border bg-glass-card-strong px-4 py-3">
              <span className="text-sm font-semibold text-text-base">{line.label}</span>
              <span className={`text-sm font-semibold ${line.amount < 0 ? 'text-status-warning' : 'text-text-base'}`}>{format(line.amount)}</span>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-glass-border bg-glass-card px-4 py-3 text-sm font-semibold text-text-base flex items-center justify-between">
            <span>Saldo real</span>
            <span>{format(totals.base)}</span>
          </div>
          <div className="rounded-2xl border border-glass-border bg-brand-secondary-soft px-4 py-3 text-sm font-semibold text-brand-secondary flex items-center justify-between">
            <span>Saldo con proyección</span>
            <span>{format(totals.projected)}</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CashflowPage;
