import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import useVacancies from '../hooks/useVacancies';

const glassCard = 'rounded-3xl border border-glass-border bg-glass-card backdrop-blur-2xl shadow-[0_25px_60px_rgba(2,6,23,0.55)] transition-all duration-300';

const priorityStyles = {
  high: 'bg-red-500/10 text-red-300 border border-red-500/30',
  medium: 'bg-amber-400/10 text-amber-200 border border-amber-400/30',
  normal: 'bg-sky-400/10 text-sky-200 border border-sky-400/30',
};

const Sparkline = ({ data }) => {
  const { points } = useMemo(() => {
    if (!data.length) {
      return { points: '' };
    }
    const max = Math.max(...data);
    const min = Math.min(...data);
    const span = max - min || 1;
    const plotted = data
      .map((value, index) => {
        const x = (index / (data.length - 1 || 1)) * 100;
        const normalized = ((value - min) / span) * 100;
        const y = 100 - normalized;
        return `${x},${y}`;
      })
      .join(' ');
    return { points: plotted };
  }, [data]);

  return (
    <svg viewBox="0 0 100 100" className="h-16 w-full">
      <defs>
        <linearGradient id="sparkline-gradient" x1="0%" x2="100%" y1="0%" y2="0%">
          <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#14B8A6" stopOpacity="0.9" />
        </linearGradient>
      </defs>
      <polyline
        fill="none"
        stroke="url(#sparkline-gradient)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
};

const ActiveVacanciesPage = () => {
  const navigate = useNavigate();
  const { vacancies, searchTerm, setSearchTerm, togglePublication, totalVacancies } = useVacancies();

  const handleCopyLink = (vacancyId) => {
    if (typeof window === 'undefined') {
      return;
    }
    const link = `${window.location.origin}/postulaciones/${vacancyId}`;
    navigator?.clipboard?.writeText?.(link);
  };

  const renderActions = (vacancyId) => {
    const actions = [
      {
        label: 'Ver Filtro',
        icon: 'bi-funnel',
        onClick: () => navigate('/Filtros'),
      },
      {
        label: 'Editar',
        icon: 'bi-pencil',
        onClick: () => navigate(`/vacantes/editar/${vacancyId}`),
      },
      {
        label: 'Obtener Link',
        icon: 'bi-link-45deg',
        onClick: () => handleCopyLink(vacancyId),
      },
    ];

    return actions.map((action) => (
      <button
        key={action.label}
        type="button"
        onClick={action.onClick}
        className="flex items-center gap-2 rounded-full border border-glass-border px-4 py-2 text-xs font-semibold text-text-muted hover:text-white hover:border-white/40"
      >
        <i className={`bi ${action.icon} text-sm`}></i>
        {action.label}
      </button>
    ));
  };

  return (
    <div className="min-h-screen bg-app-bg  text-text-base space-y-8 p-6">
      <header className="space-y-6">
        <div>
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div className="text-left">
              <h1 className="text-3xl font-semibold text-white">Gestión de Procesos Activos</h1>
              <p className="text-text-muted">Controla publicaciones, salud de los procesos y equipos evaluadores en tiempo real.</p>
            </div>
            <button
              type="button"
              onClick={() => navigate('/vacantes/crear')}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-primary px-6 py-3 text-sm font-semibold text-white shadow-[0_15px_35px_rgba(139,92,246,0.45)] hover:brightness-110"
            >
              <i className="bi bi-plus-lg text-base"></i>
              Crear Nueva Vacante
            </button>
          </div>
        </div>
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center mb-4">
          <div className="relative flex-1">
            <i className="bi bi-search absolute left-4 top-1/2 -translate-y-1/2 text-text-muted"></i>
            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Buscar por rol o departamento"
              className="w-full rounded-2xl border border-glass-border bg-glass-card py-3 pl-12 pr-4 text-sm text-text-base placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand-secondary"
            />
          </div>
          <div className="text-sm text-text-muted">
            Mostrando {vacancies.length} de {totalVacancies} vacantes activas
          </div>
        </div>
      </header>

      <section className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {vacancies.map((vacancy) => (
          <article
            key={vacancy.id}
            className={`${glassCard} p-6 hover:-translate-y-1 hover:border-white/30 hover:shadow-[0_35px_80px_rgba(2,6,23,0.8)]`}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-text-muted">{vacancy.department}</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">{vacancy.title}</h2>
                <p className="text-sm text-text-muted">Apertura · {new Date(vacancy.openedAt).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}</p>
              </div>
              <span className={`rounded-full px-4 py-1 text-xs font-semibold ${priorityStyles[vacancy.priorityVariant]}`}>
                {vacancy.priority}
              </span>
            </div>

            <div className="mt-6 space-y-5">
              <div className="rounded-2xl border border-white/5 bg-white/5 p-4">
                <div className="flex items-center justify-between text-xs text-text-muted">
                  <span>Aplicaciones últimas 7 jornadas</span>
                  <span className="text-white">{vacancy.applications}</span>
                </div>
                <Sparkline data={vacancy.trend} />
              </div>

              <div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-text-muted">{vacancy.applications} candidatos aplicados</span>
                  <span className="font-semibold text-white">{vacancy.progress}%</span>
                </div>
                <div className="mt-2 h-2 w-full rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-secondary"
                    style={{ width: `${vacancy.progress}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-text-muted">Equipo Evaluador</p>
                <div className="mt-3 flex items-center gap-4">
                  <div className="flex -space-x-3">
                    {vacancy.recruiters.map((recruiter) => (
                      <img
                        key={recruiter.name}
                        src={recruiter.avatar}
                        alt={recruiter.name}
                        className="h-12 w-12 rounded-full border-2 border-app-bg object-cover"
                      />
                    ))}
                  </div>
                  <div className="text-sm text-text-muted">
                    {vacancy.recruiters.map((recruiter) => recruiter.name.split(' ')[0]).join(' · ')}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-4 border-t border-glass-border pt-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3 text-sm">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#0A66C2]/40 bg-[#0A66C2]/15 text-[#6FB1FF]">
                    <i className="bi bi-linkedin text-lg"></i>
                  </span>
                  <div className="flex flex-col leading-tight">
                    <span className="text-text-muted">Publicado en LinkedIn</span>
                    <span className="text-xs text-white/70">Auto-sync semanal</span>
                  </div>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={vacancy.published}
                  onClick={() => togglePublication(vacancy.id)}
                  className={`relative h-8 w-16 rounded-full transition-colors ${
                    vacancy.published ? 'bg-gradient-to-r from-brand-primary to-brand-secondary' : 'bg-white/10'
                  }`}
                >
                  <span
                    className={`absolute left-1 top-1 h-6 w-6 rounded-full bg-white shadow-lg transition-transform ${
                      vacancy.published ? 'translate-x-8' : 'translate-x-0'
                    }`}
                  ></span>
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {renderActions(vacancy.id)}
              </div>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
};

export default ActiveVacanciesPage;
