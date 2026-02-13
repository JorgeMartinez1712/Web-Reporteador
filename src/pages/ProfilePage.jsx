import { useMemo, useState } from 'react';

const mockSessions = [
  { id: 'sess-1', device: 'Chrome · Windows', location: 'Caracas, VE', date: '12 Feb 2026 · 09:12' },
  { id: 'sess-2', device: 'Safari · iPhone', location: 'Miami, US', date: '11 Feb 2026 · 22:08' },
  { id: 'sess-3', device: 'Edge · MacOS', location: 'Panamá, PA', date: '10 Feb 2026 · 17:45' },
];

const ProfilePage = () => {
  const [security, setSecurity] = useState({
    twoFA: true,
    passwordOpen: false,
  });

  const sessionCount = useMemo(() => mockSessions.length, []);

  const glassCard = 'glass-elevation rounded-3xl border border-glass-border bg-glass-card backdrop-blur-xl';

  const togglePasswordForm = () => setSecurity((prev) => ({ ...prev, passwordOpen: !prev.passwordOpen }));

  return (
    <div className="min-h-screen bg-app-bg text-text-base p-6 space-y-8">
      <header className="space-y-3">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2 text-left mb-4">
            <h1 className="text-3xl font-semibold text-text-base">Mi Perfil</h1>
            <p className="text-sm text-text-muted">Gestiona tu información personal y la seguridad de tu cuenta.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button className="rounded-2xl border border-glass-border bg-glass-card px-4 py-2 text-sm font-semibold text-text-base transition hover:border-brand-secondary">
              Actualizar foto
            </button>
            <button className="rounded-2xl bg-brand-secondary px-4 py-2 text-sm font-semibold text-text-base transition hover:bg-brand-secondary-soft">
              Guardar cambios
            </button>
          </div>
        </div>
      </header>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className={`${glassCard} p-6 space-y-4 lg:col-span-2`}>
          <p className="text-xs uppercase tracking-[0.25em] text-text-muted">Información personal</p>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm text-text-muted" htmlFor="full-name">Nombre completo</label>
              <input
                id="full-name"
                type="text"
                defaultValue="Carla Mendoza"
                className="w-full rounded-2xl border border-glass-border bg-glass-card-strong px-4 py-3 text-sm text-text-base focus:outline-none focus:ring-2 focus:ring-brand-secondary"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-text-muted" htmlFor="email">Correo electrónico</label>
              <input
                id="email"
                type="email"
                defaultValue="carla.mendoza@manapro.com"
                readOnly
                className="w-full cursor-not-allowed rounded-2xl border border-dashed border-glass-border bg-glass-card px-4 py-3 text-sm text-text-muted"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-text-muted" htmlFor="role">Rol actual</label>
              <div className="flex items-center gap-2 rounded-2xl border border-glass-border bg-glass-card-strong px-4 py-3 text-sm text-text-base">
                <i className="bi bi-person-badge text-brand-secondary" />
                <span>Dueño</span>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm text-text-muted" htmlFor="phone">Teléfono</label>
              <input
                id="phone"
                type="text"
                placeholder="Opcional"
                className="w-full rounded-2xl border border-glass-border bg-glass-card-strong px-4 py-3 text-sm text-text-base focus:outline-none focus:ring-2 focus:ring-brand-secondary"
              />
            </div>
          </div>
        </div>

        <div className={`${glassCard} p-6 space-y-3`}>
          <p className="text-xs uppercase tracking-[0.25em] text-text-muted">Resumen</p>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between rounded-2xl border border-glass-border bg-glass-card-strong px-4 py-3">
              <div className="space-y-1">
                <p className="text-text-muted">2FA</p>
                <p className="font-semibold text-text-base">{security.twoFA ? 'Activado' : 'Desactivado'}</p>
              </div>
              <i className="bi bi-shield-lock text-brand-secondary" />
            </div>
            <div className="flex items-center justify-between rounded-2xl border border-glass-border bg-glass-card-strong px-4 py-3">
              <div className="space-y-1">
                <p className="text-text-muted">Sesiones activas</p>
                <p className="font-semibold text-text-base">{sessionCount}</p>
              </div>
              <i className="bi bi-laptop text-brand-secondary" />
            </div>
            <div className="flex items-center justify-between rounded-2xl border border-glass-border bg-glass-card-strong px-4 py-3">
              <div className="space-y-1">
                <p className="text-text-muted">Correo</p>
                <p className="font-semibold text-text-base">Verificado</p>
              </div>
              <i className="bi bi-patch-check text-brand-secondary" />
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className={`${glassCard} p-6 space-y-4`}>
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-text-muted">Seguridad</p>
              <p className="text-lg font-semibold text-text-base">Contraseña y autenticación</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-text-muted">
              <span className="rounded-full bg-glass-card px-3 py-1">2FA {security.twoFA ? 'activo' : 'inactivo'}</span>
            </div>
          </div>

          <div className="space-y-3">
            <button
              type="button"
              onClick={togglePasswordForm}
              className="w-full rounded-2xl border border-glass-border bg-glass-card px-4 py-3 text-sm font-semibold text-text-base transition hover:border-brand-secondary"
            >
              {security.passwordOpen ? 'Ocultar cambio de contraseña' : 'Cambiar contraseña'}
            </button>

            {security.passwordOpen && (
              <div className="space-y-3">
                <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                  <div className="space-y-2">
                    <label className="text-sm text-text-muted" htmlFor="current-pass">Contraseña actual</label>
                    <input
                      id="current-pass"
                      type="password"
                      className="w-full rounded-2xl border border-glass-border bg-glass-card-strong px-4 py-3 text-sm text-text-base focus:outline-none focus:ring-2 focus:ring-brand-secondary"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-text-muted" htmlFor="new-pass">Nueva contraseña</label>
                    <input
                      id="new-pass"
                      type="password"
                      className="w-full rounded-2xl border border-glass-border bg-glass-card-strong px-4 py-3 text-sm text-text-base focus:outline-none focus:ring-2 focus:ring-brand-secondary"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-text-muted" htmlFor="confirm-pass">Confirmar</label>
                    <input
                      id="confirm-pass"
                      type="password"
                      className="w-full rounded-2xl border border-glass-border bg-glass-card-strong px-4 py-3 text-sm text-text-base focus:outline-none focus:ring-2 focus:ring-brand-secondary"
                    />
                  </div>
                </div>
                <button className="w-full rounded-2xl bg-brand-secondary px-4 py-3 text-sm font-semibold text-text-base transition hover:bg-brand-secondary-soft">Guardar contraseña</button>
              </div>
            )}

            <div className="flex flex-col gap-3 rounded-2xl border border-dashed border-glass-border bg-glass-card-strong p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-text-base">Dispositivos 2FA</p>
                  <p className="text-xs text-text-muted">Configura un nuevo dispositivo o desactiva los existentes.</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${security.twoFA ? 'bg-status-success-soft text-status-success' : 'bg-glass-card text-text-muted'}`}>
                  {security.twoFA ? 'Activo' : 'Inactivo'}
                </span>
              </div>
              <div className="flex flex-wrap gap-2 text-sm text-text-muted">
                <span className="rounded-xl bg-glass-card px-3 py-1"><i className="bi bi-phone text-brand-secondary" /> iPhone 15 Pro</span>
                <span className="rounded-xl bg-glass-card px-3 py-1"><i className="bi bi-laptop text-brand-secondary" /> MacBook Air</span>
              </div>
              <button className="self-start rounded-2xl border border-glass-border bg-glass-card px-4 py-2 text-sm font-semibold text-text-base transition hover:border-brand-secondary">
                Configurar nuevo dispositivo
              </button>
            </div>
          </div>
        </div>

        <div className={`${glassCard} p-6 space-y-4`}>
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-text-muted">Sesiones activas</p>
              <p className="text-lg font-semibold text-text-base">Cierra sesiones que no reconozcas</p>
            </div>
            <button className="rounded-2xl border border-glass-border bg-glass-card px-4 py-2 text-sm font-semibold text-text-base transition hover:border-brand-secondary">
              Cerrar todas las sesiones
            </button>
          </div>

          <div className="space-y-3">
            {mockSessions.map((session) => (
              <div key={session.id} className="flex items-center justify-between rounded-2xl border border-glass-border bg-glass-card-strong px-4 py-3 text-sm">
                <div className="space-y-1">
                  <p className="font-semibold text-text-base">{session.device}</p>
                  <p className="text-xs text-text-muted">{session.location} • {session.date}</p>
                </div>
                <button className="rounded-xl border border-glass-border px-3 py-1 text-xs font-semibold text-text-base transition hover:border-brand-secondary">
                  Cerrar
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProfilePage;
