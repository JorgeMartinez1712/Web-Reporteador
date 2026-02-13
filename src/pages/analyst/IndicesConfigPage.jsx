import { useMemo, useState } from 'react';

const bcvOptions = [
  { id: 'today', label: 'Tasa del día (BCV)', value: 36.52, updatedAt: '2026-02-13 09:00' },
  { id: 'yesterday', label: 'Cierre previo', value: 36.28, updatedAt: '2026-02-12 09:00' },
];

const inpcHistory = [
  { month: 'Enero 2026', value: 4.1 },
  { month: 'Diciembre 2025', value: 3.9 },
  { month: 'Noviembre 2025', value: 3.7 },
  { month: 'Octubre 2025', value: 3.5 },
];

const IndicesConfigPage = () => {
  const glassPanel = 'glass-elevation rounded-3xl border border-glass-border bg-glass-card backdrop-blur-xl';
  const [customRate, setCustomRate] = useState('36.80');
  const [customInpc, setCustomInpc] = useState('4.2');
  const [syncing, setSyncing] = useState(false);

  const stats = useMemo(() => ({
    bcv: bcvOptions[0].value,
    lastInpc: inpcHistory[0].value,
  }), []);

  const handleSync = () => {
    setSyncing(true);
    setTimeout(() => setSyncing(false), 900);
  };

  return (
    <div className="min-h-screen bg-app-bg text-text-base p-6 space-y-8">
      <header className="flex flex-col gap-6 mb-4">
        <p className="text-xs uppercase tracking-[0.25em] text-text-muted">Configuracion tecnica</p>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2 text-left">
            <h1 className="text-3xl font-semibold text-text-base">Tasas BCV e INPC</h1>
            <p className="text-sm text-text-muted">Gestiona la tasa del día y el histórico del INPC que alimentan reportes y calculos.</p>
          </div>
          <button
            type="button"
            onClick={handleSync}
            className={`rounded-2xl px-5 py-3 text-sm font-semibold text-text-base transition ${syncing ? 'bg-brand-secondary/60' : 'bg-brand-secondary hover:bg-brand-secondary-soft'}`}
          >
            {syncing ? 'Sincronizando...' : 'Sincronizar con BCV'}
          </button>
        </div>
      </header>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[{ label: 'Tasa BCV hoy', value: `$${stats.bcv}` }, { label: 'Ultimo INPC', value: `${stats.lastInpc}%` }, { label: 'Origen', value: 'GALAC + BCV' }].map((item) => (
          <div key={item.label} className={`${glassPanel} p-5 space-y-2`}>
            <p className="text-xs uppercase tracking-[0.25em] text-text-muted">{item.label}</p>
            <p className="text-3xl font-semibold text-text-base">{item.value}</p>
            <p className="text-xs text-text-muted">Actualizado cada mañana</p>
          </div>
        ))}
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className={`${glassPanel} p-6 space-y-4`}>
          <p className="text-xs uppercase tracking-[0.25em] text-text-muted">Tasa del dia</p>
          <div className="space-y-3">
            {bcvOptions.map((option) => (
              <div key={option.id} className="rounded-2xl border border-glass-border bg-glass-card-strong p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-text-base">{option.label}</p>
                  <p className="text-xs text-text-muted">{option.updatedAt}</p>
                </div>
                <span className="text-lg font-semibold text-text-base">${option.value}</span>
              </div>
            ))}
            <div className="rounded-2xl border border-dashed border-glass-border bg-glass-card-strong p-4 space-y-3">
              <p className="text-sm font-semibold text-text-base">Carga manual</p>
              <input
                type="number"
                value={customRate}
                onChange={(e) => setCustomRate(e.target.value)}
                className="w-full rounded-2xl border border-glass-border bg-glass-card px-4 py-3 text-sm text-text-base focus:outline-none focus:ring-2 focus:ring-brand-secondary"
                placeholder="36.50"
              />
              <button className="w-full rounded-2xl bg-brand-secondary px-4 py-3 text-sm font-semibold text-text-base transition hover:bg-brand-secondary-soft">Publicar tasa</button>
            </div>
          </div>
        </div>

        <div className={`${glassPanel} p-6 space-y-4`}>
          <p className="text-xs uppercase tracking-[0.25em] text-text-muted">Historico INPC</p>
          <div className="space-y-3">
            {inpcHistory.map((item) => (
              <div key={item.month} className="rounded-2xl border border-glass-border bg-glass-card-strong p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-text-base">{item.month}</p>
                  <p className="text-xs text-text-muted">Publicacion SENIAT</p>
                </div>
                <span className="text-lg font-semibold text-text-base">{item.value}%</span>
              </div>
            ))}
            <div className="rounded-2xl border border-dashed border-glass-border bg-glass-card-strong p-4 space-y-3">
              <p className="text-sm font-semibold text-text-base">Agregar INPC manual</p>
              <input
                type="number"
                value={customInpc}
                onChange={(e) => setCustomInpc(e.target.value)}
                className="w-full rounded-2xl border border-glass-border bg-glass-card px-4 py-3 text-sm text-text-base focus:outline-none focus:ring-2 focus:ring-brand-secondary"
                placeholder="4.0"
              />
              <button className="w-full rounded-2xl bg-brand-secondary px-4 py-3 text-sm font-semibold text-text-base transition hover:bg-brand-secondary-soft">Guardar INPC</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default IndicesConfigPage;
