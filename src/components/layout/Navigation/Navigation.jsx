import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import fullLogo from '/assets/logo.png';
import './Navigation.css';


const roleHomeMap = {
  INTERESADO: '/dashboard',
  DUENO: '/dashboard',
  ANALISTA: '/dashboard',
  ADMIN: '/dashboard',
};

const navLinksByRole = {
  DUENO: [
    { label: 'Dashboard de servicio', description: 'Estado de la suscripcion', icon: 'bi bi-speedometer2', to: '/dashboard' },
    { label: 'Monedas y tasas', description: 'Gestión de divisas', icon: 'bi bi-currency-exchange', to: '/tasas-monedas' },
    { label: 'Usuarios', description: 'Cupos y accesos', icon: 'bi bi-people', to: '/usuarios' },
    { label: 'Multiempresa', description: 'Empresas y analistas asignados', icon: 'bi bi-building', to: '/multiempresa' },
    { label: 'Seguridad y dispositivos', description: 'Administrar dispositivos', icon: 'bi bi-shield-check', to: '/dispositivos' },
    { label: 'Aprobacion de presupuestos', description: 'Filtro final del analista', icon: 'bi bi-clipboard-check', to: '/aprobaciones' },
    { label: 'Ajustes', description: 'Editar configuración inicial', icon: 'bi bi-gear', to: '/ajustes' },
  ],
  ANALISTA: [
    { label: 'Dashboard financiero', description: 'Pulso operativo', icon: 'bi bi-house', to: '/dashboard' },
    { label: 'Mapeo GALAC', description: 'Plan de cuentas a EERR', icon: 'bi bi-diagram-3', to: '/mapeo-galac' },
    { label: 'Monedas y tasas', description: 'Gestión de divisas', icon: 'bi bi-currency-exchange', to: '/tasas-monedas' },
    { label: 'INPC y variables', description: 'Ajustes FCCPV', icon: 'bi bi-graph-up', to: '/inpc' },
    { label: 'Estado de resultados', description: 'Visor principal', icon: 'bi bi-clipboard-data', to: '/estado-resultados' },
    { label: 'Flujo de caja', description: 'Ingresos y egresos', icon: 'bi bi-cash-coin', to: '/flujo-caja' },
    { label: 'Simulador de proyecciones', description: 'Escenarios editables', icon: 'bi bi-sliders', to: '/proyecciones' },
    { label: 'Carga de presupuestos', description: 'Plantilla y envío', icon: 'bi bi-cloud-arrow-up', to: '/presupuestos' },
    { label: 'Comparativo', description: 'Presupuesto vs real', icon: 'bi bi-bar-chart', to: '/comparativo' },
  ],
  ADMIN: [
    { label: 'Panel de control', description: 'Métricas de la plataforma', icon: 'bi bi-speedometer2', to: '/dashboard' },
    { label: 'Bandeja de solicitudes', description: 'Revisión de expedientes', icon: 'bi bi-file-earmark-check', to: '/solicitudes' },
    { label: 'Gestión de clientes', description: 'Maestro de suscriptores', icon: 'bi bi-people', to: '/clientes' },
    { label: 'Configurador de planes', description: 'Precios y límites', icon: 'bi bi-gear-wide-connected', to: '/planes' },
    { label: 'Logs de auditoría', description: 'Seguridad y movimientos', icon: 'bi bi-shield-lock', to: '/auditoria' },
  ],
  INTERESADO: [
    { label: 'Resumen', description: 'Estado del onboarding', icon: 'bi bi-house', to: '/dashboard' },
    { label: 'Requisitos', description: 'Checklist de onboarding', icon: 'bi bi-clipboard-check', to: '/requisitos' },
    { label: 'Estatus de revision', description: 'Seguimiento del expediente', icon: 'bi bi-hourglass-split', to: '/revision' },
    { label: 'Pago', description: 'Activacion de suscripcion', icon: 'bi bi-credit-card', to: '/pago' },
  ],
};

const Navigation = ({ isOpen }) => {
  const location = useLocation();
  const { user } = useAuth();
  const role = user?.role || 'INTERESADO';
  const roleHome = roleHomeMap[role] || '/dashboard';
  const navLinks = navLinksByRole[role] || navLinksByRole.INTERESADO;

  const isActiveRoute = (to, { exactMatch } = {}) =>
    exactMatch ? location.pathname === to : location.pathname === to || location.pathname.startsWith(`${to}/`);

  return (
    <aside
      className={`fixed top-0 left-0 z-50 flex h-full w-72 flex-col border-r border-glass-border bg-app-bg text-text-base transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="px-6 pt-8 pb-4">
        <Link to={roleHome} className="flex justify-center">
          <img src={fullLogo} alt="logo" className="h-12 w-auto object-contain" />
        </Link>
      </div>


      <nav className="flex-1 overflow-y-auto px-4 pb-8 space-y-3 navigation-scroll">
        {navLinks.map((item) => {
          const isActive = isActiveRoute(item.to, { exactMatch: item.exactMatch });
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
