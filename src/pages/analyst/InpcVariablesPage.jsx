import { useMemo, useState } from 'react';

const initialInpc = [
  { month: '2026-01', label: 'Enero 2026', value: 4.1, source: 'Manual', evidence: 'evidencia-enero.pdf' },
  { month: '2025-12', label: 'Diciembre 2025', value: 3.9, source: 'BCV', evidence: '' },
  { month: '2025-11', label: 'Noviembre 2025', value: 3.7, source: 'Manual', evidence: 'inpc-nov.xlsx' },
];

const formulaDescription = 'FCCPV: (INPC mes actual / INPC mes anterior) - 1';

const monthsOptions = [
  '2026-01',
  '2025-12',
  '2025-11',
  '2025-10',
  '2025-09',
].map((month) => ({ value: month, label: new Date(`${month}-01`).toLocaleDateString('es-VE', { month: 'long', year: 'numeric' }) }));

const accountMappings = [
  { account: '4-01-01 Ventas netas', category: 'Ingresos' },
  { account: '5-02-10 Costos de ventas', category: 'Costos' },
  { account: '6-03-05 Gasto de ventas', category: 'Gastos' },
];

const InpcVariablesPage = () => {
  const glassPanel = 'glass-elevation rounded-3xl border border-glass-border bg-glass-card backdrop-blur-xl';
  const [activeTab, setActiveTab] = useState('inpc');
  const [inpcValues, setInpcValues] = useState(initialInpc);
  const [form, setForm] = useState({ month: '2026-02', value: '4.3', evidence: '', source: 'Manual' });
  const [automation, setAutomation] = useState({ bcvAuto: true, schedule: '07:00', notify: true });
  const [params, setParams] = useState({ legalReserve: '5', vat: '16', incomeTax: '34', effectiveFrom: '2026-01-01' });
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  const stats = useMemo(() => {
    const publishedMonths = inpcValues.length;
    const lastValue = inpcValues[0];
    return { publishedMonths, lastValue };
  }, [inpcValues]);

  const resetFeedback = () => setFeedback({ type: '', message: '' });

  const handleAddInpc = () => {
    resetFeedback();
    const exists = inpcValues.some((item) => item.month === form.month);
    if (exists) {
      setFeedback({ type: 'error', message: 'Ya existe un valor para ese mes. Evita duplicados.' });
      return;
    }

    const label = new Date(`${form.month}-01`).toLocaleDateString('es-VE', { month: 'long', year: 'numeric' });
    const next = {
      month: form.month,
      label,
      value: Number(form.value),
      source: form.source,
      evidence: form.evidence,
    };
    setInpcValues((prev) => [next, ...prev]);
    setFeedback({ type: 'success', message: 'INPC agregado. Puedes cargar evidencia y calcular variables.' });
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setForm((prev) => ({ ...prev, evidence: file.name }));
  };

  const handleAutomationToggle = (field) => {
    setAutomation((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleParamChange = (field, value) => {
    setParams((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveParams = () => {
    resetFeedback();
    const numericFields = ['legalReserve', 'vat', 'incomeTax'];
    const invalid = numericFields.some((field) => {
      const num = Number(params[field]);
      return Number.isNaN(num) || num < 0 || num > 100;
    });
    if (invalid) {
      setFeedback({ type: 'error', message: 'Los porcentajes deben ser numéricos y estar entre 0% y 100%.' });
      return;
    }
    setFeedback({ type: 'success', message: 'Parámetros guardados. Afectarán reportes generados desde ahora.' });
  };

  return (
    <div className="min-h-screen bg-app-bg text-text-base p-6 space-y-8">
      <div className="space-y-2">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2 text-left">
            <h1 className="text-3xl font-semibold text-text-base">Gestión de INPC y parámetros fiscales</h1>
            <p className="text-sm text-text-muted">Carga INPC y configura impuestos legales; los cambios aplican a reportes futuros.</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={() => setActiveTab('inpc')}
              className={`rounded-2xl px-4 py-3 text-sm font-semibold transition ${activeTab === 'inpc' ? 'bg-brand-secondary text-text-base' : 'border border-glass-border bg-glass-card text-text-base'}`}
            >
              <i className="bi bi-graph-up-arrow mr-1" /> INPC
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('params')}
              className={`rounded-2xl px-4 py-3 text-sm font-semibold transition ${activeTab === 'params' ? 'bg-brand-secondary text-text-base' : 'border border-glass-border bg-glass-card text-text-base'}`}
            >
              <i className="bi bi-sliders2 mr-1" /> Parámetros
            </button>
          </div>
        </div>
      </div>

      {feedback.message && (
        <div className={`${glassPanel} border-l-4 ${feedback.type === 'error' ? 'border-glass-border' : 'border-brand-secondary'} p-4 flex items-center gap-3`}>
          <i className={`bi ${feedback.type === 'error' ? 'bi-exclamation-triangle' : 'bi-check-lg'} text-text-base`} />
          <p className="text-sm text-text-base">{feedback.message}</p>
        </div>
      )}

      {activeTab === 'inpc' && (
        <div className="space-y-6">
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className={`${glassPanel} p-5 space-y-2`}>
              <p className="text-xs uppercase tracking-[0.25em] text-text-muted">Meses con INPC</p>
              <p className="text-3xl font-semibold text-text-base">{stats.publishedMonths}</p>
              <p className="text-xs text-text-muted">Valores listos para ajustes</p>
            </div>
            <div className={`${glassPanel} p-5 space-y-2`}>
              <p className="text-xs uppercase tracking-[0.25em] text-text-muted">Último INPC</p>
              <p className="text-3xl font-semibold text-text-base">{stats.lastValue?.value}%</p>
              <p className="text-xs text-text-muted">{stats.lastValue?.label}</p>
            </div>
            <div className={`${glassPanel} p-5 space-y-2`}>
              <p className="text-xs uppercase tracking-[0.25em] text-text-muted">Fórmula FCCPV</p>
              <p className="text-sm text-text-base">{formulaDescription}</p>
              <p className="text-xs text-text-muted">Se recalcula al publicar un nuevo mes</p>
            </div>
          </section>

          <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className={`${glassPanel} p-6 space-y-4`}>
              <p className="text-xs uppercase tracking-[0.25em] text-text-muted">Carga manual</p>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <select
                  value={form.month}
                  onChange={(e) => setForm((prev) => ({ ...prev, month: e.target.value }))}
                  className="w-full rounded-2xl border border-glass-border bg-glass-card px-4 py-3 text-sm text-text-base focus:outline-none focus:ring-2 focus:ring-brand-secondary"
                >
                  <option value="2026-02">Febrero 2026</option>
                  {monthsOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <input
                  type="number"
                  value={form.value}
                  onChange={(e) => setForm((prev) => ({ ...prev, value: e.target.value }))}
                  className="w-full rounded-2xl border border-glass-border bg-glass-card px-4 py-3 text-sm text-text-base focus:outline-none focus:ring-2 focus:ring-brand-secondary"
                  placeholder="Valor INPC"
                />
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="w-full rounded-2xl border border-dashed border-glass-border bg-glass-card px-4 py-3 text-sm text-text-muted file:text-text-base"
                />
                <div className="flex text-xs text-text-muted">
                  <i className="bi bi-shield-check" />
                  <span>Validamos un único registro por mes.</span>
                </div>
              </div>
              <button
                type="button"
                onClick={handleAddInpc}
                className="w-full rounded-2xl bg-brand-secondary px-4 py-3 text-sm font-semibold text-text-base transition hover:bg-brand-secondary-soft"
              >
                Publicar INPC
              </button>
              {form.evidence && <p className="text-xs text-text-muted">Evidencia cargada: {form.evidence}</p>}
            </div>

            <div className={`${glassPanel} p-6 space-y-4`}>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-text-base">Programa captura y notificaciones</h2>
                </div>
                <div className="flex items-center gap-2 text-xs text-text-muted">
                  <i className="bi bi-bell" />
                  <span>{automation.notify ? 'Notifica por email' : 'Notificaciones apagadas'}</span>
                </div>
              </div>
              <div className="space-y-3 text-left">
                <div className="flex items-center justify-between rounded-2xl border border-glass-border bg-glass-card px-4 py-3">
                  <div>
                    <p className="text-sm font-semibold text-text-base">Activar captura automática</p>
                    <p className="text-xs text-text-muted">Consulta diaria al BCV</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleAutomationToggle('bcvAuto')}
                    className={`rounded-full px-3 py-1 text-xs font-semibold transition ${automation.bcvAuto ? 'bg-brand-secondary text-text-base' : 'border border-glass-border bg-glass-card text-text-muted'}`}
                  >
                    {automation.bcvAuto ? 'Activa' : 'Inactiva'}
                  </button>
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-glass-border bg-glass-card px-4 py-3">
                  <div>
                    <p className="text-sm font-semibold text-text-base">Horario de captura</p>
                    <p className="text-xs text-text-muted">Usa horario local</p>
                  </div>
                  <input
                    type="time"
                    value={automation.schedule}
                    onChange={(e) => setAutomation((prev) => ({ ...prev, schedule: e.target.value }))}
                    className="rounded-2xl border border-glass-border bg-glass-card px-3 py-2 text-sm text-text-base focus:outline-none focus:ring-2 focus:ring-brand-secondary"
                  />
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-glass-border bg-glass-card px-4 py-3">
                  <div>
                    <p className="text-sm font-semibold text-text-base">Notificar cuando falle</p>
                    <p className="text-xs text-text-muted">Adjunta evidencia para auditoría</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleAutomationToggle('notify')}
                    className={`rounded-full px-3 py-1 text-xs font-semibold transition ${automation.notify ? 'bg-brand-secondary text-text-base' : 'border border-glass-border bg-glass-card text-text-muted'}`}
                  >
                    {automation.notify ? 'Sí' : 'No'}
                  </button>
                </div>
              </div>
            </div>
          </section>

          <section className="grid grid-cols-1 gap-6">
            <div className={`${glassPanel} p-6 space-y-4`}>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-text-base">Valores mensuales y evidencias</h2>
                </div>
                <div className="flex items-center gap-2 text-xs text-text-muted">
                  <i className="bi bi-folder" />
                  <span>Evidencias opcionales</span>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3 max-h-[440px] overflow-y-auto pr-1">
                {inpcValues.map((item) => (
                  <div key={item.month} className="rounded-2xl border border-glass-border bg-glass-card-strong p-4 space-y-2">
                    <div className="flex items-center justify-between text-left">
                      <div>
                        <p className="text-sm font-semibold text-text-base">{item.label}</p>
                        <p className="text-xs text-text-muted">Fuente {item.source}</p>
                      </div>
                      <span className="text-lg font-semibold text-text-base">{item.value}%</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-text-muted">
                      <div className="flex items-center gap-2">
                        <i className="bi bi-shield-check" />
                        <span>Validado</span>
                      </div>
                      <span>{item.evidence || 'Sin evidencia'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      )}

      {activeTab === 'params' && (
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className={`${glassPanel} p-6 space-y-4`}>
            <p className="text-xs uppercase tracking-[0.25em] text-text-muted">Impuestos y reservas</p>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs text-text-muted">Reserva legal (%)</label>
                <input
                  type="number"
                  value={params.legalReserve}
                  onChange={(e) => handleParamChange('legalReserve', e.target.value)}
                  className="w-full rounded-2xl border border-glass-border bg-glass-card px-4 py-3 text-sm text-text-base focus:outline-none focus:ring-2 focus:ring-brand-secondary"
                  placeholder="5"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs text-text-muted">IVA / impuesto indirecto (%)</label>
                <input
                  type="number"
                  value={params.vat}
                  onChange={(e) => handleParamChange('vat', e.target.value)}
                  className="w-full rounded-2xl border border-glass-border bg-glass-card px-4 py-3 text-sm text-text-base focus:outline-none focus:ring-2 focus:ring-brand-secondary"
                  placeholder="16"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs text-text-muted">Impuesto sobre la renta (%)</label>
                <input
                  type="number"
                  value={params.incomeTax}
                  onChange={(e) => handleParamChange('incomeTax', e.target.value)}
                  className="w-full rounded-2xl border border-glass-border bg-glass-card px-4 py-3 text-sm text-text-base focus:outline-none focus:ring-2 focus:ring-brand-secondary"
                  placeholder="34"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs text-text-muted">Aplicar desde</label>
                <input
                  type="date"
                  value={params.effectiveFrom}
                  onChange={(e) => handleParamChange('effectiveFrom', e.target.value)}
                  className="w-full rounded-2xl border border-glass-border bg-glass-card px-4 py-3 text-sm text-text-base focus:outline-none focus:ring-2 focus:ring-brand-secondary"
                />
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-text-muted">
              <i className="bi bi-shield-check" />
              <span>Los cambios aplican a reportes generados después de guardar.</span>
            </div>
            <button
              type="button"
              onClick={handleSaveParams}
              className="w-full rounded-2xl bg-brand-secondary px-4 py-3 text-sm font-semibold text-text-base transition hover:bg-brand-secondary-soft"
            >
              Guardar parámetros
            </button>
          </div>

          <div className={`${glassPanel} p-6 space-y-4`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-text-muted">Mapeo de cuentas</p>
                <h2 className="text-lg font-semibold text-text-base">GALAC hacia categorías de reporte</h2>
              </div>
              <div className="flex items-center gap-2 text-xs text-text-muted">
                <i className="bi bi-diagram-3" />
                <span>Ingresos · Costos · Gastos</span>
              </div>
            </div>
            <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
              {accountMappings.map((item) => (
                <div key={item.account} className="rounded-2xl border border-glass-border bg-glass-card-strong p-4 flex items-center justify-between text-left">
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-text-base">{item.account}</p>
                    <p className="text-xs text-text-muted">Asociado a {item.category}</p>
                  </div>
                  <span className="rounded-2xl bg-glass-card px-3 py-1 text-xs font-semibold text-brand-secondary">{item.category}</span>
                </div>
              ))}
              <div className="rounded-2xl border border-dashed border-glass-border bg-glass-card px-4 py-3 text-sm text-text-muted">
                Carga completa del mapeo se integrará desde GALAC. Aquí validamos que cada cuenta tenga categoría.
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default InpcVariablesPage;
