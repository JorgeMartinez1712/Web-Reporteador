import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const getInitialTheme = () => {
  if (typeof window === 'undefined') {
    return 'dark';
  }
  return localStorage.getItem('preferred-theme') || 'dark';
};

const plans = [
  {
    id: 'basic',
    name: 'Basico',
    description: 'Operaciones compactas con control contable esencial.',
    price: '$29',
    billing: 'Mensual por organizacion',
    accentText: 'text-brand-secondary',
    accentSoft: 'bg-brand-secondary-soft',
    accentBorder: 'border-brand-secondary',
    limits: [
      { label: 'Empresas', value: '2 empresas', icon: 'bi bi-building' },
      { label: 'Dispositivos', value: '6 dispositivos', icon: 'bi bi-phone' },
    ],
    attributes: ['Reportes esenciales', 'Alertas manuales', 'Soporte basico'],
  },
  {
    id: 'pro',
    name: 'Profesional',
    description: 'Automatizacion avanzada para equipos en crecimiento.',
    price: '$39',
    billing: 'Mensual por organizacion',
    accentText: 'text-brand-primary',
    accentSoft: 'bg-brand-primary-soft',
    accentBorder: 'border-brand-primary',
    limits: [
      { label: 'Empresas', value: '6 empresas', icon: 'bi bi-buildings' },
      { label: 'Dispositivos', value: '20 dispositivos', icon: 'bi bi-laptop' },
    ],
    attributes: ['Reportes programados', 'Alertas inteligentes', 'Tableros en tiempo real'],
  },
  {
    id: 'corp',
    name: 'Corporativo',
    description: 'Governanza total y SLA dedicado para grandes cuentas.',
    price: '$79',
    billing: 'Mensual por organizacion',
    accentText: 'text-brand-accent',
    accentSoft: 'bg-brand-primary-soft',
    accentBorder: 'border-brand-accent',
    limits: [
      { label: 'Empresas', value: '15 empresas', icon: 'bi bi-globe2' },
      { label: 'Dispositivos', value: '60 dispositivos', icon: 'bi bi-hdd-network' },
    ],
    attributes: ['Integraciones dedicadas', 'Soporte 24/7', 'Onboarding asistido'],
  },
];

const PublicHomePage = () => {
  const [theme, setTheme] = useState(getInitialTheme);
  const glassPanel = 'glass-elevation rounded-3xl border border-glass-border bg-glass-card backdrop-blur-xl';

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('preferred-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));

  return (
    <div className="min-h-screen bg-app-bg text-text-base p-6 space-y-10">
      <header className="mb-10 space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-3 mb-4">
            <h1 className="text-3xl font-semibold text-text-base flex">Elige el plan que acompana tu ritmo</h1>
            <p className="text-sm text-text-muted text-left">
              Selecciona el nivel de automatizacion y escala que necesitas para tus reportes.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={toggleTheme}
              className="flex items-center gap-2 rounded-full border border-glass-border bg-glass-card px-4 py-2 text-sm text-text-base backdrop-blur"
            >
              <i className={`bi ${theme === 'dark' ? 'bi-sun' : 'bi-moon'} text-base`} />
              {theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}
            </button>
            <Link
              to="/register"
              className="rounded-2xl bg-brand-secondary px-5 py-3 text-sm font-semibold text-text-base transition hover:bg-brand-secondary-soft"
            >
              Comenzar registro
            </Link>
            <Link
              to="/login"
              className="rounded-2xl border border-glass-border px-5 py-3 text-sm font-semibold text-text-base transition hover:border-brand-secondary"
            >
              Iniciar sesion
            </Link>
          </div>
        </div>
      </header>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {plans.map((plan) => (
          <Link
            key={plan.id}
            to={`/register?plan=${plan.id}`}
            className={`${glassPanel} group flex h-full flex-col justify-between p-6 text-left transition ${plan.accentBorder} hover:border-2`}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-text-muted">{plan.name}</p>
                  <h2 className={`text-2xl font-semibold ${plan.accentText}`}>{plan.price}</h2>
                  <p className="text-xs text-text-muted text-left">{plan.billing}</p>
                </div>
                <span className={`flex h-12 w-12 items-center justify-center rounded-2xl ${plan.accentSoft}`}>
                  <i className={`bi bi-layers text-lg ${plan.accentText}`} />
                </span>
              </div>
              <p className="text-sm text-text-muted text-left mb-4">{plan.description}</p>
            </div>

            <div className="space-y-5">
              <div className="grid gap-3">
                {plan.limits.map((limit) => (
                  <div
                    key={limit.label}
                    className="flex items-center justify-between rounded-2xl border border-glass-border bg-glass-card-strong px-4 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <span className={`flex h-10 w-10 items-center justify-center rounded-2xl ${plan.accentSoft}`}>
                        <i className={`${limit.icon} text-lg ${plan.accentText}`} />
                      </span>
                      <div className="text-left">
                        <p className="text-xs uppercase tracking-[0.2em] text-text-muted">{limit.label}</p>
                        <p className="text-sm font-semibold text-text-base">{limit.value}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <ul className="space-y-2 text-sm text-text-muted text-left">
                {plan.attributes.map((attribute) => (
                  <li key={attribute} className="flex items-center gap-2">
                    <i className={`bi bi-check-circle-fill ${plan.accentText}`} />
                    <span>{attribute}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-center justify-between text-xs uppercase tracking-[0.25em] text-text-muted mt-4">
              <span>Haz click para registrarte</span>
              <i className={`bi bi-arrow-up-right ${plan.accentText}`} />
            </div>
          </Link>
        ))}
      </section>
    </div>
  );
};

export default PublicHomePage;
