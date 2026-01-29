import { Link, useLocation } from 'react-router-dom';
import fullLogo from '/assets/logo.png';

const quickActions = [
  { label: 'Crear vacante', icon: 'bi bi-plus-square', to: '/vacantes/crear' },
  { label: 'Ver candidatos', icon: 'bi bi-people', to: '/candidatos' },
];

const navLinks = [
  { label: 'Dashboard principal', description: 'Pulso general del talento', icon: 'bi bi-speedometer', to: '/' },
  { label: 'Filtro de selección', description: 'Etapas y conversiones', icon: 'bi bi-funnel', to: '/Filtros' },
  { label: 'Vacantes activas', description: 'Procesos abiertos por área', icon: 'bi bi-list-task', to: '/vacantes' },
  { label: 'Reportes de desempeño', description: 'Indicadores y SLAs clave', icon: 'bi bi-clipboard-data', to: '/reportes' },
];

const Navigation = ({ isOpen }) => {
  const location = useLocation();

  const isActiveRoute = (to) => location.pathname === to || location.pathname.startsWith(`${to}/`);

  return (
    <aside
      className={`fixed top-0 left-0 z-50 flex h-full w-72 flex-col border-r border-glass-border bg-app-bg text-text-base transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="px-6 pt-8 pb-4">
        <Link to="/" className="flex justify-center">
          <img src={fullLogo} alt="logo" className="h-12 w-auto object-contain" />
        </Link>
      </div>

      <div className="px-6 pb-4">
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map((action) => (
            <Link
              key={action.to}
              to={action.to}
              className="rounded-2xl border border-glass-border bg-glass-card px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-text-muted transition hover:border-brand-primary hover:text-text-base"
            >
              <div className="flex items-center gap-2">
                <i className={`${action.icon} text-xs text-brand-secondary`} />
                <span className="leading-tight">{action.label}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-4 pb-8 space-y-3">
        {navLinks.map((item) => {
          const isActive = isActiveRoute(item.to);
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 rounded-3xl border px-4 py-3 transition-all duration-200 ${
                isActive
                  ? 'border-brand-primary bg-glass-card text-text-base'
                  : 'border-glass-border bg-transparent text-text-muted hover:border-brand-secondary hover:text-text-base'
              }`}
            >
              <span
                className={`flex h-10 w-10 items-center justify-center rounded-2xl ${
                  isActive ? 'bg-brand-primary-soft text-brand-primary' : 'bg-glass-card text-text-muted'
                }`}
              >
                <i className={`${item.icon} text-lg`} />
              </span>
              <div className="flex-1 text-left">
                <p className="text-sm font-semibold leading-tight">{item.label}</p>
                {item.description && <p className="text-xs text-text-muted">{item.description}</p>}
              </div>
              <i className="bi bi-chevron-right text-xs text-text-muted" />
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Navigation;
