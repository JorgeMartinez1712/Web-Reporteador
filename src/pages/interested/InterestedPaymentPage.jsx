import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const STATUS_STORAGE_KEY = 'interestedOnboardingStatus';

const planPriceMap = {
  basic: { label: 'Basico', amount: '$29' },
  pro: { label: 'Profesional', amount: '$39' },
  corp: { label: 'Corporativo', amount: '$79' },
};

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

const InterestedPaymentPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [method, setMethod] = useState('card');

  const status = getStoredStatus() || { status: 'in_review' };
  const statusKey = status.status || 'in_review';

  useEffect(() => {
    if (statusKey !== 'approved') {
      navigate('/revision');
    }
  }, [navigate, statusKey]);

  const planInfo = useMemo(() => planPriceMap[user?.plan] || planPriceMap.basic, [user?.plan]);
  const glassPanel = 'glass-elevation rounded-3xl border border-glass-border bg-glass-card backdrop-blur-xl';

  return (
    <div className="min-h-screen bg-app-bg text-text-base p-6 space-y-8">
      <header className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2 text-left">
            <h1 className="text-3xl font-semibold text-text-base">Pantalla de pago</h1>
            <p className="text-sm text-text-muted">Finaliza la activacion para iniciar el servicio.</p>
          </div>
          <span className="rounded-full bg-status-success-soft px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-status-success">
            Aprobado
          </span>
        </div>
      </header>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className={`${glassPanel} lg:col-span-2 p-6 space-y-6`}>
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-text-muted">Metodo de pago</p>
            <p className="text-lg font-semibold text-text-base">Selecciona tu pasarela</p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setMethod('card')}
              className={`rounded-2xl border px-4 py-3 text-left transition ${
                method === 'card'
                  ? 'border-brand-secondary bg-glass-card-strong text-text-base'
                  : 'border-glass-border text-text-muted'
              }`}
            >
              <p className="text-sm font-semibold">Tarjeta</p>
              <p className="text-xs text-text-muted">Visa, MasterCard, Amex</p>
            </button>
            <button
              type="button"
              onClick={() => setMethod('transfer')}
              className={`rounded-2xl border px-4 py-3 text-left transition ${
                method === 'transfer'
                  ? 'border-brand-secondary bg-glass-card-strong text-text-base'
                  : 'border-glass-border text-text-muted'
              }`}
            >
              <p className="text-sm font-semibold">Transferencia</p>
              <p className="text-xs text-text-muted">Cuenta bancaria corporativa</p>
            </button>
          </div>

          {method === 'card' ? (
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-muted" htmlFor="card-number">
                  Numero de tarjeta
                </label>
                <input
                  id="card-number"
                  type="text"
                  placeholder="0000 0000 0000 0000"
                  className="mt-2 w-full rounded-2xl border border-glass-border bg-glass-card-strong p-3 text-text-base focus:outline-none focus:ring-2 focus:ring-brand-secondary"
                />
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-text-muted" htmlFor="card-exp">
                    Expiracion
                  </label>
                  <input
                    id="card-exp"
                    type="text"
                    placeholder="MM/AA"
                    className="mt-2 w-full rounded-2xl border border-glass-border bg-glass-card-strong p-3 text-text-base focus:outline-none focus:ring-2 focus:ring-brand-secondary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-muted" htmlFor="card-cvc">
                    CVC
                  </label>
                  <input
                    id="card-cvc"
                    type="text"
                    placeholder="123"
                    className="mt-2 w-full rounded-2xl border border-glass-border bg-glass-card-strong p-3 text-text-base focus:outline-none focus:ring-2 focus:ring-brand-secondary"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-muted" htmlFor="card-name">
                  Nombre del titular
                </label>
                <input
                  id="card-name"
                  type="text"
                  placeholder="Nombre y apellido"
                  className="mt-2 w-full rounded-2xl border border-glass-border bg-glass-card-strong p-3 text-text-base focus:outline-none focus:ring-2 focus:ring-brand-secondary"
                />
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-glass-border bg-glass-card-strong p-4 text-sm text-text-muted">
              <p className="text-text-base font-semibold">Datos bancarios</p>
              <p className="mt-2">Banco Mercantil - Cuenta corriente</p>
              <p>RIF: J-12345678-9</p>
              <p>Cuenta: 0105 0123 45 1234567890</p>
            </div>
          )}
        </div>

        <div className={`${glassPanel} p-6 space-y-5`}>
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-text-muted">Resumen de factura</p>
            <p className="text-lg font-semibold text-text-base">Plan {planInfo.label}</p>
            <p className="text-sm text-text-muted">Facturacion mensual</p>
          </div>

          <div className="rounded-2xl border border-glass-border bg-glass-card-strong p-4 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-text-muted">Subtotal</span>
              <span className="text-text-base font-semibold">{planInfo.amount}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-text-muted">Impuestos</span>
              <span className="text-text-base">$0</span>
            </div>
            <div className="flex items-center justify-between text-base font-semibold">
              <span>Total</span>
              <span>{planInfo.amount}</span>
            </div>
          </div>

          <button
            type="button"
            className="w-full rounded-2xl bg-brand-secondary px-4 py-3 text-sm font-semibold text-text-base transition hover:bg-brand-secondary-soft"
          >
            Finalizar pago
          </button>
          <p className="text-xs text-text-muted">
            Al confirmar, tu suscripcion quedara activa y se habilitara el acceso completo.
          </p>
        </div>
      </section>
    </div>
  );
};

export default InterestedPaymentPage;
