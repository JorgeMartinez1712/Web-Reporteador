import { useMemo } from 'react';
import { Link } from 'react-router-dom';

const STATUS_STORAGE_KEY = 'interestedOnboardingStatus';

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

const statusConfig = {
  in_review: {
    label: 'En revision',
    description: 'Tu expediente esta siendo revisado por nuestro equipo.',
    badge: 'bg-brand-secondary-soft text-brand-secondary',
  },
  rejected: {
    label: 'Con observaciones',
    description: 'Hay documentos que requieren correcciones.',
    badge: 'bg-status-warning-soft text-status-warning',
  },
  approved: {
    label: 'Aprobado',
    description: 'Tu expediente fue aprobado. Puedes proceder al pago.',
    badge: 'bg-status-success-soft text-status-success',
  },
};

const InterestedReviewPage = () => {
  const glassPanel = 'glass-elevation rounded-3xl border border-glass-border bg-glass-card backdrop-blur-xl';
  const storedStatus = getStoredStatus() || { status: 'in_review', observations: [] };
  const statusKey = storedStatus.status || 'in_review';
  const statusMeta = statusConfig[statusKey] || statusConfig.in_review;

  const observationItems = useMemo(() => {
    if (Array.isArray(storedStatus.observations) && storedStatus.observations.length > 0) {
      return storedStatus.observations;
    }
    return [];
  }, [storedStatus.observations]);

  return (
    <div className="min-h-screen bg-app-bg text-text-base p-6 space-y-8">
      <header className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2 text-left">
            <h1 className="text-3xl font-semibold text-text-base">Estatus de revision</h1>
            <p className="text-sm text-text-muted mb-4">{statusMeta.description}</p>
          </div>
          <span className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] ${statusMeta.badge}`}>
            {statusMeta.label}  
          </span>
        </div>
      </header>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className={`${glassPanel} lg:col-span-2 p-6 space-y-4`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-text-muted">Bandeja de observaciones</p>
              <p className="text-lg font-semibold text-text-base flex">Validaciones legales</p>
            </div>
            <span className="text-sm text-text-muted">
              {observationItems.length > 0 ? `${observationItems.length} observaciones` : 'Sin observaciones'}
            </span>
          </div>

          <div className="space-y-3">
            {observationItems.length === 0 ? (
              <div className="rounded-2xl border border-glass-border bg-glass-card-strong p-5 text-sm text-text-muted">
                Tu expediente se encuentra en revision. Aqui apareceran comentarios si algun documento es rechazado.
              </div>
            ) : (
              observationItems.map((item) => (
                <div key={item.id} className="rounded-2xl border border-glass-border bg-glass-card-strong p-5">
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-text-base">{item.title}</p>
                      <p className="text-sm text-text-muted">{item.message}</p>
                    </div>
                    <Link
                      to={`/requisitos?focus=${item.requirementId || 'rif'}`}
                      className="rounded-2xl border border-glass-border px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-text-base transition hover:border-brand-secondary"
                    >
                      Volver a requisitos
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className={`${glassPanel} p-6 space-y-6`}>
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-text-muted">Paso siguiente</p>
            <p className="text-lg font-semibold text-text-base">Pago de suscripcion</p>
            <p className="text-sm text-text-muted">
              El boton se habilitara cuando el equipo apruebe tu expediente.
            </p>
          </div>

          <button
            type="button"
            disabled={statusKey !== 'approved'}
            className={`flex w-full items-center justify-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
              statusKey === 'approved'
                ? 'bg-brand-secondary text-text-base hover:bg-brand-secondary-soft'
                : 'border border-glass-border text-text-muted cursor-not-allowed'
            }`}
          >
            <i className={`bi ${statusKey === 'approved' ? 'bi-unlock' : 'bi-lock'}`} />
            Pagar suscripcion
          </button>

          {statusKey === 'approved' && (
            <Link
              to="/pago"
              className="text-xs uppercase tracking-[0.25em] text-text-muted hover:text-text-base"
            >
              Ir a pantalla de pago
            </Link>
          )}
        </div>
      </section>
    </div>
  );
};

export default InterestedReviewPage;
