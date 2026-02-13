import { useMemo, useState } from 'react';
import GlassSelect from '../../components/common/GlassSelect';

const requestsMock = [
  {
    id: 'req-01',
    company: 'LogiTrans C.A.',
    rif: 'J-40112233-9',
    plan: 'Corporativo',
    submittedAt: '12 Feb 2026',
    documents: [
      { name: 'RIF.pdf', type: 'PDF', size: '420 KB' },
      { name: 'Acta Constitutiva.pdf', type: 'PDF', size: '1.2 MB' },
      { name: 'Estado Cuenta Bancaria.png', type: 'PNG', size: '850 KB' },
    ],
  },
  {
    id: 'req-02',
    company: 'Innova Retail',
    rif: 'J-29887766-1',
    plan: 'Pro',
    submittedAt: '11 Feb 2026',
    documents: [
      { name: 'RIF.pdf', type: 'PDF', size: '400 KB' },
      { name: 'Estado Financiero.xlsx', type: 'XLSX', size: '320 KB' },
    ],
  },
  {
    id: 'req-03',
    company: 'AgroServicios Andes',
    rif: 'J-12003456-7',
    plan: 'Basico',
    submittedAt: '10 Feb 2026',
    documents: [
      { name: 'RIF.pdf', type: 'PDF', size: '380 KB' },
      { name: 'Permiso Municipal.pdf', type: 'PDF', size: '610 KB' },
      { name: 'Referencias Bancarias.pdf', type: 'PDF', size: '250 KB' },
    ],
  },
];

const AdminRequestsPage = () => {
  const glassPanel = 'glass-elevation rounded-3xl border border-glass-border bg-glass-card backdrop-blur-xl';
  const [selectedId, setSelectedId] = useState(requestsMock[0].id);
  const [decision, setDecision] = useState({ action: '', comment: '' });

  const selectedRequest = useMemo(() => requestsMock.find((r) => r.id === selectedId), [selectedId]);

  const handleAction = (action) => {
    setDecision({ action, comment: '' });
  };

  return (
    <div className="min-h-screen bg-app-bg text-text-base p-6 space-y-8">
      <header className="flex flex-col gap-6 mb-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2 text-left mb-4 ">
            <h1 className="text-3xl font-semibold text-text-base">Bandeja de solicitudes</h1>
            <p className="text-sm text-text-muted">Interesados con requisitos completos, listos para aprobar o rechazar.</p>
          </div>
          <GlassSelect
            value="todas"
            options={[
              { value: 'todas', label: 'Todas' },
              { value: 'pendientes', label: 'Pendientes' },
              { value: 'revisadas', label: 'Revisadas' },
            ]}
            icon="bi bi-funnel"
            className="w-44"
            onChange={() => {}}
          />
        </div>
      </header>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className={`${glassPanel} p-6 space-y-3 lg:col-span-1`}>
          <div className="flex items-center justify-between">
            <p className="text-xs uppercase tracking-[0.25em] text-text-muted">Solicitudes</p>
            <span className="rounded-full bg-status-info-soft px-3 py-1 text-xs font-semibold text-brand-secondary">{requestsMock.length} en cola</span>
          </div>
          <div className="space-y-2">
            {requestsMock.map((req) => (
              <button
                key={req.id}
                type="button"
                onClick={() => setSelectedId(req.id)}
                className={`w-full rounded-2xl border px-4 py-3 text-left transition ${
                  selectedId === req.id
                    ? 'border-brand-secondary bg-glass-card text-text-base'
                    : 'border-glass-border bg-glass-card-strong text-text-muted hover:border-brand-secondary'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-semibold">{req.company}</p>
                    <p className="text-xs text-text-muted">{req.rif}</p>
                  </div>
                  <span className="rounded-full bg-glass-card px-3 py-1 text-xs text-text-muted">{req.plan}</span>
                </div>
                <p className="text-xs text-text-muted mt-2">Subido: {req.submittedAt}</p>
              </button>
            ))}
          </div>
        </div>

        <div className={`${glassPanel} p-6 space-y-4 lg:col-span-2`}>
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-text-muted">Expediente</p>
              <p className="text-lg font-semibold text-text-base">{selectedRequest?.company}</p>
              <p className="text-sm text-text-muted">RIF {selectedRequest?.rif} • Plan {selectedRequest?.plan}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleAction('aprobar')}
                className={`rounded-2xl px-4 py-2 text-sm font-semibold transition ${
                  decision.action === 'aprobar'
                    ? 'bg-status-success-soft text-status-success'
                    : 'border border-glass-border bg-glass-card text-text-base hover:border-brand-secondary'
                }`}
              >
                Aprobar
              </button>
              <button
                type="button"
                onClick={() => handleAction('rechazar')}
                className={`rounded-2xl px-4 py-2 text-sm font-semibold transition ${
                  decision.action === 'rechazar'
                    ? 'bg-status-danger-soft text-status-danger'
                    : 'border border-glass-border bg-glass-card text-text-base hover:border-brand-secondary'
                }`}
              >
                Rechazar
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-glass-border bg-glass-card-strong p-4 space-y-3">
              <p className="text-xs uppercase tracking-[0.25em] text-text-muted">Documentos</p>
              <div className="space-y-2 text-sm">
                {selectedRequest?.documents.map((doc) => (
                  <div key={doc.name} className="flex items-center justify-between rounded-xl border border-glass-border bg-glass-card px-3 py-2">
                    <div>
                      <p className="font-semibold text-text-base">{doc.name}</p>
                      <p className="text-xs text-text-muted">{doc.type} • {doc.size}</p>
                    </div>
                    <i className="bi bi-box-arrow-up-right text-text-muted" />
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-glass-border bg-glass-card-strong p-4 space-y-3">
              <p className="text-xs uppercase tracking-[0.25em] text-text-muted">Decision</p>
              <textarea
                className="w-full rounded-2xl border border-glass-border bg-glass-card px-3 py-2 text-sm text-text-base focus:outline-none focus:ring-2 focus:ring-brand-secondary"
                rows={6}
                placeholder="Comentarios para el cliente (opcional)"
                value={decision.comment}
                onChange={(e) => setDecision((prev) => ({ ...prev, comment: e.target.value }))}
              />
              <button
                type="button"
                className="w-full rounded-2xl bg-brand-secondary px-4 py-2 text-sm font-semibold text-text-base transition hover:bg-brand-secondary-soft"
              >
                Confirmar y notificar
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminRequestsPage;
