import { useMemo } from 'react';
import { Link } from 'react-router-dom';

const STATUS_STORAGE_KEY = 'interestedOnboardingStatus';

const statusConfig = {
  in_review: {
    label: 'En revision',
    badge: 'bg-brand-secondary-soft text-brand-secondary',
    message: 'Tu expediente esta siendo revisado por nuestro equipo.',
  },
  rejected: {
    label: 'Con observaciones',
    badge: 'bg-status-warning-soft text-status-warning',
    message: 'Existen documentos que requieren correcciones.',
  },
  approved: {
    label: 'Aprobado',
    badge: 'bg-status-success-soft text-status-success',
    message: 'Puedes continuar con el pago para activar la suscripcion.',
  },
};

const paymentMethods = [
  { id: 'card', label: 'Tarjeta corporativa', detail: 'Visa, MasterCard, Amex', icon: 'bi bi-credit-card' },
  { id: 'transfer', label: 'Transferencia bancaria', detail: 'Cuenta empresarial', icon: 'bi bi-bank' },
  { id: 'invoice', label: 'Factura proforma', detail: 'Aprobacion interna', icon: 'bi bi-receipt' },
];

const getStoredStatus = () => {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(STATUS_STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch (err) {
    return null;
  }
};

const InterestedHomePage = () => {
  const glassPanel = 'glass-elevation rounded-3xl border border-glass-border bg-glass-card backdrop-blur-xl';
  const storedStatus = getStoredStatus() || { status: 'in_review', observations: [] };
  const statusKey = storedStatus.status || 'in_review';
  const statusMeta = statusConfig[statusKey] || statusConfig.in_review;
  const observationCount = useMemo(
    () => (Array.isArray(storedStatus.observations) ? storedStatus.observations.length : 0),
    [storedStatus.observations],
  );

  return (
    <div className="min-h-screen bg-app-bg text-text-base p-6 space-y-8">
      <header className="space-y-3">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold text-text-base flex">Resumen de activacion</h1>
            <p className="text-sm text-text-muted mb-4">{statusMeta.message}</p>
          </div>
          <span className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] ${statusMeta.badge}`}>
            {statusMeta.label}
          </span>
        </div>
      </header>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className={`${glassPanel} p-6 space-y-4`}>
          <p className="text-xs uppercase tracking-[0.25em] text-text-muted">Checklist</p>
          <h2 className="text-lg font-semibold text-text-base">Documentos legales</h2>
          <p className="text-sm text-text-muted">
            {statusKey === 'rejected'
              ? 'Corrige los documentos observados para continuar.'
              : 'Completa la carga para iniciar la revision.'}
          </p>
          <Link
            to="/requisitos"
            className="inline-flex items-center gap-2 rounded-2xl border border-glass-border px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-text-base transition hover:border-brand-secondary"
          >
            Ir a requisitos
            <i className="bi bi-arrow-right" />
          </Link>
          <div className="rounded-2xl border border-glass-border bg-glass-card-strong p-4">
            <p className="text-xs uppercase tracking-[0.25em] text-text-muted">Observaciones</p>
            <p className="text-2xl font-semibold text-text-base">{observationCount}</p>
            <p className="text-xs text-text-muted">Pendientes de revision</p>
          </div>
        </div>

        <div className={`${glassPanel} p-6 space-y-4`}>
          <p className="text-xs uppercase tracking-[0.25em] text-text-muted">Estatus</p>
          <h2 className="text-lg font-semibold text-text-base">Revision del expediente</h2>
          <p className="text-sm text-text-muted">Consulta el detalle y comentarios del equipo.</p>
          <Link
            to="/revision"
            className="inline-flex items-center gap-2 rounded-2xl border border-glass-border px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-text-base transition hover:border-brand-secondary"
          >
            Ver estatus
            <i className="bi bi-arrow-right" />
          </Link>
          <div className="rounded-2xl border border-glass-border bg-glass-card-strong p-4">
            <p className="text-xs uppercase tracking-[0.25em] text-text-muted">Tiempo estimado</p>
            <p className="text-2xl font-semibold text-text-base">24-48 h</p>
            <p className="text-xs text-text-muted">Validacion legal</p>
          </div>
        </div>

        <div className={`${glassPanel} p-6 space-y-4`}>
          <p className="text-xs uppercase tracking-[0.25em] text-text-muted">Pago</p>
          <h2 className="text-lg font-semibold text-text-base">Metodos disponibles</h2>
          <div className="space-y-3">
            {paymentMethods.map((method) => (
              <div key={method.id} className="rounded-2xl border border-glass-border bg-glass-card-strong p-3">
                <div className="flex items-start gap-3 text-left">
                  <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-glass-card">
                    <i className={`${method.icon} text-lg text-brand-secondary`} />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-text-base">{method.label}</p>
                    <p className="text-xs text-text-muted">{method.detail}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Link
            to="/pago"
            className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] transition ${
              statusKey === 'approved'
                ? 'bg-brand-secondary text-text-base hover:bg-brand-secondary-soft'
                : 'border border-glass-border text-text-muted cursor-not-allowed'
            }`}
            aria-disabled={statusKey !== 'approved'}
          >
            Ir a pago
            <i className={`bi ${statusKey === 'approved' ? 'bi-unlock' : 'bi-lock'}`} />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default InterestedHomePage;
