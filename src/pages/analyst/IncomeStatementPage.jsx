import { useMemo, useState } from 'react';
import GlassSelect from '../../components/common/GlassSelect';

const periodOptions = [
  { value: '2026-02', label: 'Febrero 2026' },
  { value: '2026-01', label: 'Enero 2026' },
  { value: '2025-12', label: 'Diciembre 2025' },
];

const currencyOptions = [
  { value: 'usd', label: 'USD' },
  { value: 'ves', label: 'VES' },
];

const erLines = [
  { id: 'ing', label: 'Ingresos operativos', amount: 620000 },
  { id: 'cost', label: 'Costos de ventas', amount: -320000 },
  { id: 'gross', label: 'Margen bruto', amount: 300000, highlight: true },
  { id: 'op', label: 'Gastos operativos', amount: -140000 },
  { id: 'ebitda', label: 'EBITDA', amount: 160000, highlight: true },
  { id: 'islr', label: 'ISLR (34%)', amount: -54400 },
  { id: 'res', label: 'Reservas', amount: -12000 },
  { id: 'net', label: 'Resultado neto', amount: 93600, highlight: true },
];

const IncomeStatementPage = () => {
  const [period, setPeriod] = useState(periodOptions[0].value);
  const [currency, setCurrency] = useState(currencyOptions[0].value);
  const glassPanel = 'glass-elevation rounded-3xl border border-glass-border bg-glass-card backdrop-blur-xl';

  const totals = useMemo(() => {
    const total = erLines.reduce((sum, line) => sum + line.amount, 0);
    return { total, margin: 0.24 };
  }, []);

  const format = (amount) => new Intl.NumberFormat('es-ES', { style: 'currency', currency: currency === 'usd' ? 'USD' : 'VES' }).format(amount);

  return (
    <div className="min-h-screen bg-app-bg text-text-base p-6 space-y-8">
      <header className="flex flex-col gap-6 mb-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-4">
          <div className="space-y-2 text-left">
            <h1 className="text-3xl font-semibold text-text-base">Estado de Resultados</h1>
            <p className="text-sm text-text-muted">Visor principal con subtotales, ISLR y reservas listos para exportar.</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <GlassSelect value={period} onChange={setPeriod} options={periodOptions} icon="bi bi-calendar-event" placeholder="Periodo" className="w-48" />
            <GlassSelect value={currency} onChange={setCurrency} options={currencyOptions} icon="bi bi-cash-coin" placeholder="Moneda" className="w-40" />
            <button className="rounded-2xl bg-brand-secondary px-4 py-3 text-sm font-semibold text-text-base transition hover:bg-brand-secondary-soft">Exportar PDF</button>
            <button className="rounded-2xl border border-glass-border px-4 py-3 text-sm font-semibold text-text-base transition hover:border-brand-secondary">Exportar Excel</button>
          </div>
        </div>
      </header>

      <section className={`${glassPanel} p-6 space-y-4`}>
        <div className="grid grid-cols-1 gap-3">
          {erLines.map((line) => (
            <div
              key={line.id}
              className={`flex items-center justify-between rounded-2xl border border-glass-border bg-glass-card-strong px-4 py-3 ${line.highlight ? 'border-brand-secondary-soft' : ''}`}
            >
              <span className="text-sm font-semibold text-text-base">{line.label}</span>
              <span className={`text-sm font-semibold ${line.amount < 0 ? 'text-status-warning' : 'text-text-base'}`}>{format(line.amount)}</span>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-glass-border bg-glass-card px-4 py-3">
          <p className="text-sm text-text-muted">Resultado neto y margen</p>
          <div className="flex items-center gap-3 text-sm font-semibold text-text-base">
            <span>{format(totals.total)}</span>
            <span className="rounded-full bg-brand-secondary-soft px-3 py-1 text-brand-secondary">Margen {Math.round(totals.margin * 100)}%</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default IncomeStatementPage;
