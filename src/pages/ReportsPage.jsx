import { useState } from 'react';
import GlassSelect from '../components/common/GlassSelect';
import ReportCard from '../components/common/ReportCard';

const reportsMock = {
  summary: [
    {
      id: 'sla',
      label: 'SLA operativo',
      value: '94%',
      caption: 'Meta 90%',
      delta: '+2.3 pp',
      icon: 'bi bi-speedometer2',
    },
    {
      id: 'automation',
      label: 'Automatizaciones activas',
      value: '128',
      caption: '12 nuevas esta semana',
      delta: '+9%',
      icon: 'bi bi-robot',
    },
    {
      id: 'backlog',
      label: 'Backlog priorizado',
      value: '18',
      caption: '5 compromisos críticos',
      delta: '-4 casos',
      icon: 'bi bi-stack',
    },
    {
      id: 'coverage',
      label: 'Cobertura omnicanal',
      value: '86%',
      caption: 'Meta 90% mensual',
      delta: '+3 pts',
      icon: 'bi bi-bounding-box-circles',
    },
  ],
  filters: {
    periodOptions: [
      { label: 'Últimos 7 días', value: '7d' },
      { label: 'Últimos 30 días', value: '30d' },
      { label: 'Q4 2025', value: 'q4' },
    ],
    segmentOptions: [
      { label: 'Operación global', value: 'global' },
      { label: 'Retail & consumo masivo', value: 'retail' },
      { label: 'División industrial', value: 'industrial' },
    ],
    guardrails: [
      { id: 'alerts', label: 'Alertas críticas', value: '3', helper: '-2 vs. ayer' },
      { id: 'syncs', label: 'Sincronizaciones OK', value: '34', helper: 'de 36 integraciones' },
      { id: 'coverage', label: 'Cobertura de canales', value: '86%', helper: '+3 pts semanal' },
    ],
  },
  velocity: {
    labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
    published: [42, 48, 51, 49, 55, 37, 32],
    automated: [28, 33, 36, 35, 40, 26, 21],
    stats: [
      { id: 'avg', label: 'Promedio diario', value: '47', detail: 'reportes publicados' },
      { id: 'automationShare', label: 'Cobertura automatizada', value: '67%', detail: 'del total diario' },
      { id: 'sla', label: 'SLA cumplido', value: '94%', detail: 'antes de las 09:00' },
      { id: 'latency', label: 'Latencia promedio', value: '2.1 min', detail: 'desde recepción a publicación' },
    ],
  },
  channelMix: {
    labels: ['Portal web', 'App móvil', 'Email automatizado', 'API externa', 'WhatsApp ejecutivo'],
    distribution: [48, 22, 14, 10, 6],
    highlights: [
      { id: 'top', label: 'Canal con mayor engagement', value: 'Portal web', detail: '48% participación' },
      { id: 'fast', label: 'Canal más veloz', value: 'API externa', detail: '1.2 min promedio' },
      { id: 'growth', label: 'Mayor crecimiento', value: 'App móvil', detail: '+6 pts vs. semana anterior' },
    ],
  },
  automation: {
    labels: ['Q1', 'Q2', 'Q3', 'Q4'],
    completed: [210, 236, 250, 268],
    backlog: [58, 46, 39, 31],
    insights: [
      { id: 'completed', label: 'Automatizaciones completadas', value: '268', detail: '+7% vs. Q3' },
      { id: 'savings', label: 'Horas ahorradas', value: '412 h', detail: 'en la última iteración' },
      { id: 'backlog', label: 'Backlog priorizado', value: '31', detail: 'casos de alto impacto' },
    ],
  },
  backlog: [
    {
      id: 1,
      name: 'Estado de resultados retail',
      owner: 'Control de Gestión',
      eta: '6h',
      status: 'En curso',
      impact: 'Alto',
    },
    {
      id: 2,
      name: 'Reporte de cobranzas LATAM',
      owner: 'Tesorería Regional',
      eta: '12h',
      status: 'En preparación',
      impact: 'Medio',
    },
    {
      id: 3,
      name: 'Dashboard variaciones INPC',
      owner: 'Transformación Digital',
      eta: '24h',
      status: 'Pendiente',
      impact: 'Alto',
    },
    {
      id: 4,
      name: 'Flujo de caja semanal',
      owner: 'Tesorería Oriente',
      eta: '4h',
      status: 'En curso',
      impact: 'Medio',
    },
  ],
  squads: [
    {
      id: 'finance',
      label: 'Finanzas corporativas',
      score: 92,
      delta: '+6 pp',
      tags: ['GALAC', 'SAP Retail'],
    },
    {
      id: 'commercial',
      label: 'Motor comercial',
      score: 88,
      delta: '+3 pp',
      tags: ['Salesforce', 'CRM interno'],
    },
    {
      id: 'operations',
      label: 'NOC Operaciones',
      score: 81,
      delta: '+4 pp',
      tags: ['SCADA', 'Data Lake'],
    },
  ],
};

const ReportsPage = () => {
  const [selectedPeriod, setSelectedPeriod] = useState(reportsMock.filters.periodOptions[1].value);
  const [selectedSegment, setSelectedSegment] = useState(reportsMock.filters.segmentOptions[0].value);

  const getStatusStyle = (status) => {
    if (status.toLowerCase().includes('pendiente')) return 'bg-status-warning-soft text-status-warning border border-status-warning';
    if (status.toLowerCase().includes('preparación')) return 'bg-brand-secondary-soft text-brand-secondary border border-brand-secondary';
    return 'bg-status-success-soft text-status-success border border-status-success';
  };

  const getImpactDot = (impact) => {
    if (impact.toLowerCase() === 'alto') return 'bg-brand-accent';
    if (impact.toLowerCase() === 'medio') return 'bg-brand-secondary';
    return 'bg-status-success';
  };

  return (
    <div className="min-h-screen bg-app-bg text-text-base p-6 space-y-8">
      <header className="space-y-3 mb-4">
        <p className="text-xs uppercase tracking-[0.35em] text-text-muted flex">Motor de reportes ejecutivos</p>
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-4">
          <div className="space-y-2 text-left">
            <h1 className="text-3xl font-semibold text-text-base flex">Panel maestro de reportes</h1>
            <p className="text-sm text-text-muted flex">Seguimiento diario a la producción, distribución y automatización de informes críticos.</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <button className="w-full sm:w-auto rounded-2xl border border-glass-border px-5 py-3 text-sm font-semibold text-text-base transition hover:border-brand-secondary">
              Programar exportación
            </button>
            <button className="w-full sm:w-auto rounded-2xl bg-brand-secondary-soft px-5 py-3 text-sm font-semibold text-brand-secondary transition hover:-translate-y-0.5">
              Descargar PDF
            </button>
          </div>
        </div>
      </header>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {reportsMock.summary.map((item) => (
          <div key={item.id} className="glass-elevation rounded-2xl border border-glass-border bg-glass-card backdrop-blur-xl p-5 space-y-3">
            <div className="flex items-center justify-center">
              <p className="text-xs uppercase tracking-[0.3em] text-text-muted">{item.label}</p>
              <i className={`${item.icon} text-text-muted text-lg`}></i>
            </div>
            <div className="flex items-center gap-2 justify-center">
              <p className="text-3xl font-semibold text-text-base">{item.value}</p>
              <span className="text-sm text-brand-secondary">{item.delta}</span>
            </div>
            <p className="text-sm text-text-muted">{item.caption}</p>
          </div>
        ))}
      </section>

      <section className="glass-elevation rounded-3xl border border-glass-border bg-glass-card backdrop-blur-2xl p-6 space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-[0.3em] text-text-muted">Contexto de análisis</p>
            <h2 className="text-xl font-semibold text-text-base">Filtros inteligentes</h2>
          </div>
          <div className="flex flex-col gap-4 md:flex-row">
            <GlassSelect
              value={selectedPeriod}
              onChange={setSelectedPeriod}
              options={reportsMock.filters.periodOptions}
              placeholder="Rango temporal"
              icon="bi bi-calendar2-week"
            />
            <GlassSelect
              value={selectedSegment}
              onChange={setSelectedSegment}
              options={reportsMock.filters.segmentOptions}
              placeholder="Segmento"
              icon="bi bi-diagram-3"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {reportsMock.filters.guardrails.map((guard) => (
            <div key={guard.id} className="rounded-2xl border border-glass-border bg-glass-card-strong p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-text-muted">{guard.label}</p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-semibold text-text-base">{guard.value}</span>
                <span className="text-sm text-brand-secondary">{guard.helper}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <ReportCard
          className="xl:col-span-2"
          bodyClassName="space-y-4"
          title="Velocidad de publicación"
          description="Comparativo diario entre reportes automatizados y totales publicados"
          badge="Analítica operacional"
          chartConfig={{
            labels: reportsMock.velocity.labels,
            datasets: [
              { label: 'Reportes publicados', data: reportsMock.velocity.published },
              { label: 'Automatizados', data: reportsMock.velocity.automated },
            ],
          }}
          chartHeight={320}
          actions={
            <button className="rounded-2xl border border-glass-border px-4 py-2 text-sm font-semibold text-text-base hover:border-brand-secondary">
              Exportar CSV
            </button>
          }
          footer="Datos procesados desde GALAC + fuentes externas en la última sincronización de las 06:00."
        >
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4 text-sm">
            {reportsMock.velocity.stats.map((stat) => (
              <div key={stat.id} className="rounded-2xl border border-glass-border bg-glass-card-strong p-3">
                <p className="text-[11px] uppercase tracking-[0.3em] text-text-muted">{stat.label}</p>
                <p className="text-xl font-semibold text-text-base">{stat.value}</p>
                <p className="text-xs text-text-muted">{stat.detail}</p>
              </div>
            ))}
          </div>
        </ReportCard>

        <ReportCard
          className="xl:col-span-1"
          bodyClassName="space-y-4"
          title="Distribución por canal"
          description="Pesos relativos según consumo y entregabilidad"
          badge="Cobertura omnicanal"
          chartConfig={{
            labels: reportsMock.channelMix.labels,
            datasets: [
              {
                label: 'Participación',
                data: reportsMock.channelMix.distribution,
              },
            ],
          }}
          chartHeight={320}
        >
          <div className="space-y-3 text-sm">
            {reportsMock.channelMix.highlights.map((highlight) => (
              <div key={highlight.id} className="rounded-2xl border border-glass-border bg-glass-card-strong p-3">
                <p className="text-[11px] uppercase tracking-[0.25em] text-text-muted">{highlight.label}</p>
                <p className="text-base font-semibold text-text-base">{highlight.value}</p>
                <p className="text-xs text-text-muted">{highlight.detail}</p>
              </div>
            ))}
          </div>
        </ReportCard>
      </section>

      <section>
        <ReportCard
          bodyClassName="space-y-4"
          title="Evolución del programa de automatización"
          description="Completitud trimestral vs backlog priorizado"
          badge="Pipeline inteligente"
          chartConfig={{
            labels: reportsMock.automation.labels,
            datasets: [
              { label: 'Automatizaciones completadas', data: reportsMock.automation.completed },
              { label: 'Backlog priorizado', data: reportsMock.automation.backlog },
            ],
          }}
          chartHeight={360}
          footer="Las proyecciones consideran los sprints aprobados y el índice de complejidad técnico."
        >
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3 text-sm">
            {reportsMock.automation.insights.map((insight) => (
              <div key={insight.id} className="rounded-2xl border border-glass-border bg-glass-card-strong p-4">
                <p className="text-[11px] uppercase tracking-[0.3em] text-text-muted">{insight.label}</p>
                <p className="text-2xl font-semibold text-text-base">{insight.value}</p>
                <p className="text-xs text-text-muted">{insight.detail}</p>
              </div>
            ))}
          </div>
        </ReportCard>
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 glass-elevation rounded-3xl border border-glass-border bg-glass-card backdrop-blur-2xl p-6 space-y-4">
          <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-text-muted">Backlog táctico</p>
              <h2 className="text-xl font-semibold">Secuencia priorizada</h2>
            </div>
            <button className="rounded-2xl border border-glass-border px-4 py-2 text-sm font-semibold text-text-base hover:border-brand-secondary">
              Reordenar prioridades
            </button>
          </div>
          <div className="space-y-3">
            {reportsMock.backlog.map((item) => (
              <div key={item.id} className="rounded-2xl border border-glass-border bg-glass-card-strong p-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm font-semibold text-text-base">{item.name}</p>
                  <p className="text-xs text-text-muted">{item.owner}</p>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs">
                  <span className="inline-flex items-center gap-1 rounded-full bg-glass-card px-3 py-1 text-text-muted">
                    <i className="bi bi-clock"></i>
                    ETA {item.eta}
                  </span>
                  <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-semibold ${getStatusStyle(item.status)}`}>
                    <span className={`h-2 w-2 rounded-full ${getImpactDot(item.impact)}`}></span>
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-elevation rounded-3xl border border-glass-border bg-glass-card backdrop-blur-2xl p-6 space-y-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-text-muted">Salud de squads</p>
            <h2 className="text-xl font-semibold">Madurez operativa</h2>
          </div>
          <div className="space-y-3">
            {reportsMock.squads.map((squad) => (
              <div key={squad.id} className="rounded-2xl border border-glass-border bg-glass-card-strong p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-text-base">{squad.label}</p>
                    <p className="text-xs text-brand-secondary">{squad.delta}</p>
                  </div>
                  <span className="text-2xl font-semibold text-text-base">{squad.score}</span>
                </div>
                <div className="flex flex-wrap gap-2 text-xs">
                  {squad.tags.map((tag) => (
                    <span key={tag} className="rounded-full border border-glass-border px-3 py-1 text-text-muted">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="h-2 rounded-full bg-glass-card">
                  <div
                    className="h-full rounded-full bg-brand-secondary"
                    style={{ width: `${squad.score}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ReportsPage;
