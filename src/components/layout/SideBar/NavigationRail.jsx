import { Link } from 'react-router-dom';
import NavigationCluster from './NavigationCluster';
import WorkspaceSignature from './WorkspaceSignature';

const NavigationRail = ({ isOpen }) => {
  const quickLinks = [
    { label: 'Crear vacante', icon: 'bi bi-plus-square', to: '/ventas' },
    { label: 'Ver candidatos', icon: 'bi bi-people', to: '/clientes' },
  ];

  const navigationClusters = [
    {
      id: 'dashboard',
      title: 'Dashboard',
      summary: 'Visión general y pulso diario.',
      meta: 'Visión',
      icon: 'bi bi-speedometer2',
      items: [
        { to: '/home', icon: 'bi bi-speedometer', label: 'Dashboard principal' },
        { to: '/reportes/rentabilidad', icon: 'bi bi-funnel', label: 'Embudo de selección' },
      ],
    },
    {
      id: 'talent-management',
      title: 'Gestión de talento',
      summary: 'Vacantes y pipeline en un mismo flujo.',
      meta: 'Talento',
      icon: 'bi bi-briefcase',
      items: [
        { to: '/ventas', icon: 'bi bi-list-task', label: 'Vacantes activas' },
        { to: '/clientes', icon: 'bi bi-person-lines-fill', label: 'Pool de candidatos' },
      ],
    },
    {
      id: 'analytics',
      title: 'Analytics e insights',
      summary: 'Reportes de desempeño y tiempos.',
      meta: 'Insights',
      icon: 'bi bi-graph-up-arrow',
      items: [
        { to: '/reportes/ordenes', icon: 'bi bi-clipboard-data', label: 'Reportes de desempeño' },
      ],
    },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 z-50 flex h-full w-72 flex-col border-r border-white/10 bg-slate-950 text-white/90 transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <WorkspaceSignature />

      <div className="px-6 pb-4">
        <div className="grid grid-cols-2 gap-3">
          {quickLinks.map((action) => (
            <Link
              key={action.to}
              to={action.to}
              className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-white/80 transition hover:border-white/40"
            >
              <div className="flex items-center gap-2">
                <i className={`${action.icon} text-xs`} />
                <span className="leading-tight">{action.label}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="nav-scroll-area flex-1 space-y-4 overflow-y-auto px-4 pb-8">
        {navigationClusters.map((cluster) => (
          <NavigationCluster key={cluster.id} cluster={cluster} />
        ))}
      </div>
    </aside>
  );
};

export default NavigationRail;
