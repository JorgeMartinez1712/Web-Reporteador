import { useMemo } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { useAuth } from '../context/AuthContext';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const HomePage = () => {
  const { user } = useAuth();
  const firstName = user?.name?.split(' ')[0] || user?.first_name || 'Usuario';
  const dateFormatter = new Intl.DateTimeFormat('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const formattedDateRaw = dateFormatter.format(new Date());
  const formattedDate = formattedDateRaw.charAt(0).toUpperCase() + formattedDateRaw.slice(1);

  const axisColor = 'rgba(148,163,184,0.6)';
  const gridColor = 'rgba(148,163,184,0.2)';
  const tooltipBg = 'rgba(15,23,42,0.95)';
  const tooltipText = '#f8fafc';

  const reportKpis = [
    { id: 'reports', label: 'Reportes publicados', value: '248', caption: 'Últimas 24 horas' },
    { id: 'latency', label: 'Latencia promedio', value: '2.4 min', caption: 'Desde integración a canal' },
    { id: 'alerts', label: 'Alertas activas', value: 3, caption: 'Desvíos en Presupuesto y Flujo' },
    { id: 'sources', label: 'Fuentes conectadas', value: 8, caption: 'GALAC + 7 ERPs' },
  ];

  const integrationHealth = [
    { id: 'galac', label: 'GALAC', status: 'Operativa', lastSync: 'Hace 8 min', icon: 'bi bi-database-check', badge: 'Tempo comercial' },
    { id: 'sap', label: 'SAP Retail', status: 'Retraso leve', lastSync: 'Hace 26 min', icon: 'bi bi-exclamation-octagon', badge: 'Tipo de cambio' },
    { id: 'inpc', label: 'INPC SENIAT', status: 'Actualizado', lastSync: 'Hoy 06:00', icon: 'bi bi-activity', badge: 'Índice y variaciones' },
  ];

  const getIntegrationStatusClass = (status) =>
    status.toLowerCase().includes('retr') ? 'text-status-warning' : 'text-status-success';

  const publicationQueue = [
    { id: 1, name: 'Presupuesto consolidado', channel: 'Portal web', status: 'Publicado', owner: 'Finanzas Corporativas' },
    { id: 2, name: 'Flujo de caja regional', channel: 'App móvil', status: 'En validación', owner: 'Tesorería Oriente' },
    { id: 3, name: 'Mayor analítico USD', channel: 'API clientes', status: 'Pendiente', owner: 'Control de Gestión' },
    { id: 4, name: 'Indicadores INPC', channel: 'Email programado', status: 'Publicado', owner: 'Transformación Digital' },
  ];

  const monitoringInsights = [
    { id: 'presupuesto', label: 'Desvío Presupuesto', value: '-3.1%', detail: 'vs. meta mensual', trend: 'success' },
    { id: 'flujo', label: 'Cobertura de Flujo', value: '92%', detail: 'Semana actual', trend: 'warning' },
    { id: 'monedas', label: 'Actualizaciones de moneda', value: '12', detail: 'Tipos de cambio aplicados', trend: 'success' },
  ];

  const latencyData = useMemo(
    () => ({
      labels: ['00h', '04h', '08h', '12h', '16h', '20h'],
      datasets: [
        {
          label: 'Latencia de publicación (min)',
          data: [3.5, 2.8, 2.2, 2.9, 1.8, 1.6],
          backgroundColor: 'rgba(14,165,233,0.35)',
          borderColor: 'rgba(14,165,233,1)',
          borderWidth: 2,
          borderRadius: 16,
        },
      ],
    }),
    [],
  );

  const latencyOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: tooltipBg,
          titleColor: tooltipText,
          bodyColor: tooltipText,
          padding: 12,
          cornerRadius: 12,
        },
        title: {
          display: true,
          text: 'Latencia de publicación por franja horaria',
          color: axisColor,
          align: 'start',
          font: { size: 16, weight: 600 },
          padding: { bottom: 16 },
        },
      },
      scales: {
        x: {
          grid: { color: gridColor },
          ticks: { color: axisColor },
        },
        y: {
          beginAtZero: true,
          grid: { color: gridColor },
          ticks: { color: axisColor },
        },
      },
    }),
    [axisColor, gridColor, tooltipBg, tooltipText],
  );

  const coverageData = useMemo(
    () => ({
      labels: ['Portal web', 'App móvil', 'Email programado', 'API externa'],
      datasets: [
        {
          data: [45, 22, 18, 15],
          backgroundColor: ['#6366F1', '#14B8A6', '#F59E0B', '#EC4899'],
          borderWidth: 0,
        },
      ],
    }),
    [],
  );

  const coverageOptions = useMemo(
    () => ({
      cutout: '65%',
      plugins: {
        legend: {
          display: true,
          position: 'bottom',
          labels: {
            color: axisColor,
            boxWidth: 12,
            padding: 16,
          },
        },
        tooltip: {
          backgroundColor: tooltipBg,
          titleColor: tooltipText,
          bodyColor: tooltipText,
        },
        title: {
          display: true,
          text: 'Cobertura por canal de publicación',
          color: axisColor,
          font: { size: 16, weight: 600 },
          padding: { bottom: 12 },
        },
      },
    }),
    [axisColor, tooltipBg, tooltipText],
  );

  const publicationStatusStyles = {
    Publicado: 'bg-status-success-soft text-status-success border border-status-success',
    'En validación': 'bg-status-warning-soft text-status-warning border border-status-warning',
    Pendiente: 'bg-brand-secondary-soft text-brand-secondary border border-brand-secondary',
  };

  const glassPanel = 'glass-elevation rounded-2xl border border-glass-border bg-glass-card backdrop-blur-xl';

  return (
    <div className="min-h-screen bg-app-bg text-text-base p-6 space-y-8">
      <header className="flex flex-col gap-2 text-left">
        <p className="text-xs uppercase tracking-[0.35em] text-text-muted">Motor automatizado de reportes</p>
        <h1 className="text-2xl md:text-3xl font-semibold text-text-base">Hola, {firstName}. Este es el pulso operativo del día</h1>
        <p className="text-text-muted text-sm mb-4">{formattedDate}</p>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {reportKpis.map((kpi) => (
          <div key={kpi.id} className={`${glassPanel} p-5 space-y-3`}>
            <p className="text-xs uppercase tracking-[0.25em] text-text-muted">{kpi.label}</p>
            <p className="text-3xl font-semibold text-text-base">{kpi.value}</p>
            <p className="text-sm text-text-muted">{kpi.caption}</p>
          </div>
        ))}
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        <div className={`xl:col-span-3 ${glassPanel} p-6 h-[360px]`}>
          <Bar data={latencyData} options={latencyOptions} />
        </div>
        <div className={`xl:col-span-2 ${glassPanel} p-6 flex flex-col gap-6`}>
          <div className="flex-1 flex items-center justify-center">
            <div className="w-full max-w-sm">
              <Doughnut data={coverageData} options={coverageOptions} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            {monitoringInsights.map((insight) => (
              <div
                key={insight.id}
                className="rounded-2xl border border-glass-border bg-glass-card-strong p-3"
              >
                <p className="text-xs uppercase tracking-[0.25em] text-text-muted">{insight.label}</p>
                <p className="text-xl font-semibold text-text-base">{insight.value}</p>
                <p className="text-xs text-text-muted">{insight.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className={`lg:col-span-1 ${glassPanel} p-6 space-y-4`}>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Integraciones y fuentes</h2>
            <span className="text-xs text-text-muted">Sincronizaciones en vivo</span>
          </div>
          <div className="space-y-4">
            {integrationHealth.map((source) => (
              <div key={source.id} className="rounded-2xl border border-glass-border bg-glass-card-strong p-4 flex items-center gap-4">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-glass-card">
                  <i className={`${source.icon} text-xl text-brand-secondary`}></i>
                </span>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-text-base">{source.label}</p>
                  <p className="text-xs text-text-muted">{source.lastSync}</p>
                  <span className="text-[11px] font-medium tracking-wide text-brand-primary">{source.badge}</span>
                </div>
                <span className={`text-xs font-semibold ${getIntegrationStatusClass(source.status)}`}>
                  {source.status}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className={`lg:col-span-2 ${glassPanel} p-6 space-y-4`}>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold">Cola de publicación</h2>
              <p className="text-sm text-text-muted">Estado de los informes automatizados</p>
            </div>
            <button className="px-4 py-2 rounded-2xl border border-glass-border text-sm font-semibold text-text-base hover:border-brand-secondary">
              Crear nuevo informe
            </button>
          </div>
          <div className="space-y-3">
            {publicationQueue.map((item) => (
              <div
                key={item.id}
                className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 rounded-2xl border border-glass-border bg-glass-card-strong p-4"
              >
                <div>
                  <p className="text-sm font-semibold text-text-base">{item.name}</p>
                  <p className="text-xs text-text-muted">{item.owner}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-xs text-text-muted">
                    <span className="block text-[11px] uppercase tracking-[0.3em] text-text-muted">Canal</span>
                    <span className="text-sm text-text-base">{item.channel}</span>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    publicationStatusStyles[item.status] || 'bg-glass-card text-text-base border border-glass-border'
                  }`}>
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;