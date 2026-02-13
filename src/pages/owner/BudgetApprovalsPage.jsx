import { useMemo, useState } from 'react';
import GlassSelect from '../../components/common/GlassSelect';

const mockBudgets = [
  { id: 'pres-001', name: 'Presupuesto 2026 - Comercial', owner: 'Caracas', total: '$1.2M', status: 'Pendiente', analyst: 'Ana Contreras', channel: 'Portal web' },
  { id: 'pres-002', name: 'Capex Planta Occidente', owner: 'Maracaibo', total: '$840k', status: 'Pendiente', analyst: 'Luis Perez', channel: 'API clientes' },
  { id: 'pres-003', name: 'Opex Servicios Cloud', owner: 'Remoto', total: '$320k', status: 'Pendiente', analyst: 'Mariana Ruiz', channel: 'Email programado' },
];

const decisionOptions = [
  { value: 'approve', label: 'Aprobar' },
  { value: 'reject', label: 'Rechazar con comentario' },
];

const BudgetApprovalsPage = () => {
  const [items, setItems] = useState(mockBudgets);
  const [decisions, setDecisions] = useState({});
  const [comments, setComments] = useState({});
  const glassPanel = 'glass-elevation rounded-3xl border border-glass-border bg-glass-card backdrop-blur-xl';

  const pendingCount = useMemo(() => items.filter((i) => i.status === 'Pendiente').length, [items]);

  const handleDecision = (id, value) => {
    setDecisions((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (id) => {
    const decision = decisions[id] || 'approve';
    const comment = comments[id] || '';
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, status: decision === 'approve' ? 'Aprobado' : 'Rechazado', comment: comment || 'Sin comentario' }
          : item,
      ),
    );
  };

  return (
    <div className="min-h-screen bg-app-bg text-text-base p-6 space-y-8">
      <header className="flex flex-col gap-6 mb-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2 text-left mb-4">
            <h1 className="text-3xl font-semibold text-text-base">Filtro final de presupuestos</h1>
            <p className="text-sm text-text-muted">Revisa totales y decide aprobar o rechazar con comentarios para el analista.</p>
          </div>
          <span className="rounded-2xl bg-status-warning-soft px-4 py-2 text-sm font-semibold text-status-warning">{pendingCount} pendientes</span>
        </div>
      </header>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[{ label: 'Pendientes', value: pendingCount }, { label: 'Aprobados', value: items.filter((i) => i.status === 'Aprobado').length }, { label: 'Rechazados', value: items.filter((i) => i.status === 'Rechazado').length }].map((kpi) => (
          <div key={kpi.label} className={`${glassPanel} p-5 space-y-2`}>
            <p className="text-xs uppercase tracking-[0.25em] text-text-muted">{kpi.label}</p>
            <p className="text-3xl font-semibold text-text-base">{kpi.value}</p>
            <p className="text-xs text-text-muted">Actualizado al aprobar</p>
          </div>
        ))}
      </section>

      <section className={`${glassPanel} p-6 space-y-4`}>
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-lg font-semibold text-text-base">Presupuestos esperando tu decision</p>
          </div>
        
        </div>

        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="rounded-2xl border border-glass-border bg-glass-card-strong p-4 space-y-3">
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div className='text-left'>
                  <p className="text-sm font-semibold text-text-base">{item.name}</p>
                  <p className="text-xs text-text-muted">Unidad: {item.owner} • Canal: {item.channel}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-glass-card px-3 py-1 text-xs text-text-muted">Analista {item.analyst}</span>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    item.status === 'Pendiente'
                      ? 'bg-status-warning-soft text-status-warning'
                      : item.status === 'Aprobado'
                        ? 'bg-status-success-soft text-status-success'
                        : 'bg-brand-secondary-soft text-brand-secondary'
                  }`}>
                    {item.status}
                  </span>
                  <span className="text-lg font-semibold text-text-base">{item.total}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                <GlassSelect
                  value={decisions[item.id] || 'approve'}
                  options={decisionOptions}
                  onChange={(value) => handleDecision(item.id, value)}
                  placeholder="Selecciona decision"
                  icon="bi bi-sliders"
                />
                <div className="md:col-span-2">
                  <input
                    type="text"
                    placeholder="Comentario para el analista (opcional)"
                    value={comments[item.id] || ''}
                    onChange={(e) => setComments((prev) => ({ ...prev, [item.id]: e.target.value }))}
                    className="w-full rounded-2xl border border-glass-border bg-glass-card px-4 py-3 text-sm text-text-base focus:outline-none focus:ring-2 focus:ring-brand-secondary"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => handleSubmit(item.id)}
                  className="rounded-2xl bg-brand-secondary px-4 py-2 text-sm font-semibold text-text-base transition hover:bg-brand-secondary-soft"
                >
                  Enviar decision
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default BudgetApprovalsPage;
