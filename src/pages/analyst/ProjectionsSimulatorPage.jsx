import { useMemo, useState } from 'react';

const baseScenario = [
  { id: 'ventas', label: 'Ventas', current: 620000, projected: 650000 },
  { id: 'costos', label: 'Costos', current: -320000, projected: -330000 },
  { id: 'gastos', label: 'Gastos operativos', current: -140000, projected: -150000 },
  { id: 'capex', label: 'Capex', current: -25000, projected: -28000 },
];

const ProjectionsSimulatorPage = () => {
  const [rows, setRows] = useState(baseScenario);
  const [saving, setSaving] = useState(false);
  const glassPanel = 'glass-elevation rounded-3xl border border-glass-border bg-glass-card backdrop-blur-xl';

  const totals = useMemo(() => {
    const current = rows.reduce((sum, row) => sum + row.current, 0);
    const projected = rows.reduce((sum, row) => sum + row.projected, 0);
    return { current, projected, delta: projected - current };
  }, [rows]);

  const format = (amount) => new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);

  const handleChange = (id, value) => {
    setRows((prev) => prev.map((row) => (row.id === id ? { ...row, projected: Number(value) } : row)));
  };

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => setSaving(false), 900);
  };

  return (
    <div className="min-h-screen bg-app-bg text-text-base p-6 space-y-8">
      <header className="flex flex-col gap-6 mb-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-4">
          <div className="space-y-2 text-left">
            <h1 className="text-3xl font-semibold text-text-base">Simulador de escenarios</h1>
            <p className="text-sm text-text-muted">Edita montos proyectados y observa el impacto inmediato en el saldo final.</p>
          </div>
          <button
            type="button"
            onClick={handleSave}
            className={`rounded-2xl px-4 py-3 text-sm font-semibold text-text-base transition ${saving ? 'bg-brand-secondary/60' : 'bg-brand-secondary hover:bg-brand-secondary-soft'}`}
          >
            {saving ? 'Guardando...' : 'Guardar escenario'}
          </button>
        </div>
      </header>

      <section className={`${glassPanel} p-6 space-y-4`}>
        <div className="grid grid-cols-1 gap-3">
          {rows.map((row) => (
            <div key={row.id} className="grid grid-cols-1 gap-3 md:grid-cols-3 items-center rounded-2xl border border-glass-border bg-glass-card-strong px-4 py-3">
              <div className="text-sm font-semibold text-text-base">{row.label}</div>
              <div className="text-sm text-text-muted">Actual: {format(row.current)}</div>
              <input
                type="number"
                value={row.projected}
                onChange={(e) => handleChange(row.id, e.target.value)}
                className="w-full rounded-2xl border border-glass-border bg-glass-card px-3 py-2 text-sm text-text-base focus:outline-none focus:ring-2 focus:ring-brand-secondary"
              />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-glass-border bg-glass-card px-4 py-3 text-sm font-semibold text-text-base">Actual: {format(totals.current)}</div>
          <div className="rounded-2xl border border-glass-border bg-brand-secondary-soft px-4 py-3 text-sm font-semibold text-brand-secondary">Proyectado: {format(totals.projected)}</div>
          <div className={`rounded-2xl border px-4 py-3 text-sm font-semibold ${totals.delta >= 0 ? 'border-status-success-soft text-status-success' : 'border-status-warning-soft text-status-warning'}`}>
            Impacto: {format(totals.delta)}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProjectionsSimulatorPage;
