import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const mockSubscription = {
  plan: 'Corporativo',
  daysLeft: 24,
  renewalDate: '15 Mar 2026',
  status: 'Activa',
  users: { used: 12, limit: 20 },
  devices: { used: 18, limit: 30 },
};

const quickLinks = [
  { id: 'people', label: 'Gestionar personal', icon: 'bi bi-people', hint: 'Invita o revoca accesos', to: '/usuarios' },
  { id: 'companies', label: 'Ver empresas', icon: 'bi bi-building', hint: 'Multiempresa y branding' },
  { id: 'billing', label: 'Facturacion', icon: 'bi bi-receipt', hint: 'Metodo de pago y facturas' },
];

const serviceHighlights = [
  { id: 'sla', label: 'SLA operativo', value: '99.5%', caption: 'Disponibilidad semanal' },
  { id: 'alerts', label: 'Alertas abiertas', value: '2', caption: 'Requieren revision' },
  { id: 'tickets', label: 'Tickets soporte', value: '3', caption: 'En curso' },
];

const OwnerHomePage = () => {
  const navigate = useNavigate();
  const glassPanel = 'glass-elevation rounded-3xl border border-glass-border bg-glass-card backdrop-blur-xl';
  const [setupStatus, setSetupStatus] = useState(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem('ownerSetupStatus') : null;
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        return { completion: parsed.completion || 0, completed: !!parsed.completed };
      } catch (err) {
        return { completion: 0, completed: false };
      }
    }
    return { completion: 0, completed: false };
  });

  const usageBars = useMemo(
    () => [
      { id: 'users', label: 'Usuarios creados', used: mockSubscription.users.used, limit: mockSubscription.users.limit },
      { id: 'devices', label: 'Dispositivos vinculados', used: mockSubscription.devices.used, limit: mockSubscription.devices.limit },
    ],
    [],
  );

  useEffect(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem('ownerSetupStatus') : null;
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setSetupStatus({ completion: parsed.completion || 0, completed: !!parsed.completed });
      } catch (err) {
        setSetupStatus({ completion: 0, completed: false });
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-app-bg text-text-base p-6 space-y-8">
      <header className="flex flex-col gap-6 mb-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2 text-left mb-4">
            <h1 className="text-3xl font-semibold text-text-base">Panel de servicio</h1>
            <p className="text-sm text-text-muted">Estado general, cupos y accesos rapidos para operar la suscripcion.</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="rounded-2xl bg-status-success-soft px-4 py-2 text-sm font-semibold text-status-success">{mockSubscription.status}</span>
            <button className="rounded-2xl border border-glass-border bg-glass-card px-4 py-2 text-sm font-semibold text-text-base transition hover:bg-glass-card-strong">
              Descargar factura
            </button>
          </div>
        </div>
      </header>

      <section className={`${glassPanel} p-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between`}>
        <div className="space-y-1 text-left">
          <p className="text-lg font-semibold text-text-base">Progreso de la configuración</p>
          <p className="text-sm text-text-muted">Completa los pasos para cerrar la activación.</p>
        </div>
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-6 w-full md:w-auto">
          <div className="flex items-center gap-3">
            <div className="h-14 w-14 rounded-full border-2 border-brand-secondary flex items-center justify-center text-lg font-semibold text-text-base">
              {setupStatus.completion}%
            </div>
            <div className="text-sm text-text-muted">
              {setupStatus.completed ? 'Setup completado' : 'Pendiente de finalizar'}
            </div>
          </div>
          {setupStatus.completed ? (
            <button
              type="button"
              onClick={() => navigate('/ajustes')}
              className="rounded-2xl bg-brand-secondary px-4 py-2 text-sm font-semibold text-text-base transition hover:bg-brand-secondary-soft"
            >
              Ir a ajustes
            </button>
          ) : (
            <button
              type="button"
              onClick={() => navigate('/setup')}
              className="rounded-2xl border border-glass-border bg-glass-card px-4 py-2 text-sm font-semibold text-text-base transition hover:border-brand-secondary"
            >
              Continuar configuración
            </button>
          )}
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className={`${glassPanel} p-6 space-y-4 xl:col-span-2`}>
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-text-muted">Estado de suscripcion</p>
              <p className="text-lg font-semibold text-text-base">Plan {mockSubscription.plan}</p>
              <p className="text-sm text-text-muted">Renueva el {mockSubscription.renewalDate} • {mockSubscription.daysLeft} dias restantes</p>
            </div>
            <div className="flex items-center gap-2 rounded-2xl border border-glass-border bg-glass-card px-4 py-3 text-sm text-text-base">
              <i className="bi bi-clock-history text-brand-secondary" />
              <span>Renovacion automatica activa</span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {usageBars.map((item) => {
              const pct = Math.min(100, Math.round((item.used / item.limit) * 100));
              return (
                <div key={item.id} className="rounded-2xl border border-glass-border bg-glass-card-strong p-4 space-y-2">
                  <div className="flex items-center justify-between text-sm text-text-base">
                    <span className="font-semibold">{item.label}</span>
                    <span className="text-text-muted">{item.used}/{item.limit}</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-glass-card">
                    <div className="h-full rounded-full bg-brand-secondary" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className={`${glassPanel} p-6 space-y-4`}>
          <p className="text-xs uppercase tracking-[0.25em] text-text-muted">Accesos rapidos</p>
          <div className="space-y-3">
            {quickLinks.map((link) => (
              <button
                key={link.id}
                type="button"
                onClick={() => link.to && navigate(link.to)}
                className="flex w-full items-center justify-between rounded-2xl border border-glass-border bg-glass-card-strong px-4 py-3 text-left text-sm font-semibold text-text-base transition hover:border-brand-secondary"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-glass-card">
                    <i className={`${link.icon} text-lg text-brand-secondary`} />
                  </span>
                  <div className="space-y-1">
                    <p>{link.label}</p>
                    <p className="text-xs text-text-muted">{link.hint}</p>
                  </div>
                </div>
                <i className="bi bi-arrow-right-short text-xl text-text-muted" />
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className={`${glassPanel} p-6 space-y-4`}>
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div className='text-left'>
            <p className="text-xs uppercase tracking-[0.25em] text-text-muted">Salud del servicio</p>
            <p className="text-lg font-semibold text-text-base">Visor ejecutivo</p>
          </div>
          <button className="rounded-2xl bg-brand-secondary px-4 py-2 text-sm font-semibold text-text-base transition hover:bg-brand-secondary-soft">
            Ver detalle
          </button>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {serviceHighlights.map((item) => (
            <div key={item.id} className="rounded-2xl border border-glass-border bg-glass-card-strong p-4 space-y-1">
              <p className="text-xs uppercase tracking-[0.25em] text-text-muted">{item.label}</p>
              <p className="text-2xl font-semibold text-text-base">{item.value}</p>
              <p className="text-xs text-text-muted">{item.caption}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default OwnerHomePage;
