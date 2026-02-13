import { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GlassSelect from '../../components/common/GlassSelect';
import ReportCard from '../../components/common/ReportCard';
import { useAuth } from '../../context/AuthContext';

const connectivity = {
  galac: { status: 'Conectado', tone: 'text-status-success', icon: 'bi bi-shield-check' },
  bcv: { rate: 36.52 },
  inpc: { month: 'Enero 2026' },
};

const kpis = [
  { id: 'liq', label: 'Liquidez inmediata', value: '$812k', helper: 'Caja + Bancos' },
  { id: 'ing', label: 'Ingresos del mes', value: '$1.24M', helper: '+8% vs mes anterior' },
  { id: 'opex', label: 'Gastos operativos', value: '$642k', helper: '72% del presupuesto', bar: 72 },
  { id: 'net', label: 'Resultado neto', value: '$188k', helper: 'Margen 15%' },
];

const quickActions = [
  { id: 'er', label: 'Generar Estado de Resultados', icon: 'bi bi-clipboard-data', to: '/estado-resultados' },
  { id: 'map', label: 'Mapear Cuentas Galac', icon: 'bi bi-diagram-3', to: '/mapeo-galac' },
  { id: 'proj', label: 'Nueva Proyección de Flujo', icon: 'bi bi-sliders', to: '/proyecciones' },
  { id: 'budget', label: 'Subir Presupuesto', icon: 'bi bi-cloud-arrow-up', to: '/presupuestos' },
];

const alerts = [
  { id: 'map', tone: 'warning', text: 'Hay 5 cuentas nuevas en GALAC sin clasificar en el Estado de Resultados.', action: 'Ir a mapeo', to: '/mapeo-galac' },
  { id: 'budget', tone: 'info', text: 'El presupuesto 2026 fue rechazado por el Administrador. Ver comentarios.', action: 'Ver comentarios', to: '/presupuestos' },
  { id: 'cash', tone: 'danger', text: 'El flujo de caja real está un 15% por debajo de la proyección guardada.', action: 'Abrir flujo', to: '/flujo-caja' },
];

const lastReports = [
  { id: 'r1', name: 'ER Consolidado Enero', date: '12 Feb 2026', type: 'PDF' },
  { id: 'r2', name: 'Flujo Semanal', date: '11 Feb 2026', type: 'Excel' },
  { id: 'r3', name: 'Proyección Q1', date: '09 Feb 2026', type: 'PDF' },
];

const AnalystHomePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const firstName = user?.name?.split(' ')[0] || user?.first_name || 'Usuario';
  const [selectedCompany, setSelectedCompany] = useState('holding');
  const [selectedPeriod, setSelectedPeriod] = useState('mes');

  const incomeVsExpenseChart = useMemo(
    () => ({
      labels: ['Sep', 'Oct', 'Nov', 'Dic', 'Ene', 'Feb'],
      datasets: [
        { label: 'Ingresos', data: [920, 980, 1040, 1100, 1180, 1240] },
        { label: 'Egresos', data: [780, 820, 860, 910, 970, 1050] },
      ],
    }),
    [],
  );

  const realVsBudgetChart = useMemo(
    () => ({
      labels: ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4'],
      datasets: [
        { label: 'Real', data: [210, 230, 205, 240] },
        { label: 'Presupuesto', data: [200, 220, 215, 225] },
      ],
    }),
    [],
  );

  const glassPanel = 'glass-elevation rounded-3xl border border-glass-border bg-glass-card backdrop-blur-xl';

  useEffect(() => {
    const mapped = typeof window !== 'undefined' ? localStorage.getItem('analystMappingReady') === 'true' : true;
    if (!mapped) {
      navigate('/mapeo-galac', { replace: true });
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-app-bg text-text-base p-6 space-y-8">
      <header className="flex flex-col gap-6 mb-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2 text-left">
            <h1 className="text-3xl font-semibold text-text-base">Hola, {firstName}. Centro operativo del día</h1>
            <p className="text-sm text-text-muted mb-4">Salud financiera, pendientes técnicos y accesos directos.</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <GlassSelect
              value={selectedCompany}
              onChange={setSelectedCompany}
              options={[
                { value: 'holding', label: 'Holding principal' },
                { value: 'retail', label: 'Retail Andina' },
                { value: 'industria', label: 'Industria Delta' },
              ]}
              placeholder="Empresa"
              icon="bi bi-buildings"
              className="w-56"
            />
            <div className="rounded-2xl border border-glass-border bg-glass-card px-4 py-3 text-sm text-text-base flex items-center gap-2">
              <i className="bi bi-clock-history text-brand-secondary" />
              <span>Ultima sync GALAC: Hoy 06:00</span>
            </div>
          </div>
        </div>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={`${glassPanel} p-5 flex items-center justify-between`}>
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-text-muted">GALAC</p>
            <p className="text-lg font-semibold text-text-base">Estado de conexion</p>
            <p className="text-xs text-text-muted">VPN y feed de datos</p>
          </div>
          <span className={`rounded-full bg-status-success-soft px-3 py-1 text-xs font-semibold ${connectivity.galac.tone}`}>
            <i className={`${connectivity.galac.icon} mr-1`} /> {connectivity.galac.status}
          </span>
        </div>
        <div className={`${glassPanel} p-5 flex items-center justify-between`}>
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-text-muted">Tasa del dia (BCV)</p>
            <p className="text-2xl font-semibold text-text-base">${connectivity.bcv.rate}</p>
            <p className="text-xs text-text-muted">Actualizada 09:00</p>
          </div>
          <button className="rounded-2xl border border-glass-border px-4 py-2 text-xs font-semibold text-text-base transition hover:border-brand-secondary">
            Actualizar tasa
          </button>
        </div>
        <div className={`${glassPanel} p-5 flex items-center justify-between`}>
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-text-muted">Ultimo INPC</p>
            <p className="text-lg font-semibold text-text-base">{connectivity.inpc.month}</p>
            <p className="text-xs text-text-muted">Publicacion SENIAT</p>
          </div>
          <i className="bi bi-activity text-brand-secondary text-xl" />
        </div>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <div key={kpi.id} className={`${glassPanel} p-5 space-y-3`}>
            <p className="text-xs uppercase tracking-[0.25em] text-text-muted">{kpi.label}</p>
            <p className="text-3xl font-semibold text-text-base">{kpi.value}</p>
            <div className="flex items-center justify-between text-sm text-text-muted">
              <span>{kpi.helper}</span>
              {kpi.bar ? <span className="text-xs text-text-muted">{kpi.bar}%</span> : null}
            </div>
            {kpi.bar ? (
              <div className="h-2 w-full rounded-full bg-glass-card">
                <div className="h-full rounded-full bg-brand-secondary" style={{ width: `${kpi.bar}%` }} />
              </div>
            ) : null}
          </div>
        ))}
      </section>

      <section className={`${glassPanel} p-6 space-y-4`}>
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-text-muted">Acciones recurrentes</p>
          <p className="text-lg font-semibold text-text-base">Panel de accesos directos</p>
        </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
          {quickActions.map((action) => (
            <button
              key={action.id}
              type="button"
              onClick={() => navigate(action.to)}
              className="flex items-center justify-between rounded-2xl border border-glass-border bg-glass-card-strong px-4 py-3 text-left text-sm font-semibold text-text-base transition hover:border-brand-secondary"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-glass-card">
                  <i className={`${action.icon} text-lg text-brand-secondary`} />
                </span>
                <span>{action.label}</span>
              </div>
              <i className="bi bi-arrow-right-short text-xl text-text-muted" />
            </button>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className={`${glassPanel} p-6 space-y-3 lg:col-span-2`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-text-muted">Alertas y pendientes</p>
              <p className="text-lg font-semibold text-text-base">Checklist operativo</p>
            </div>
            <GlassSelect
              value={selectedPeriod}
              onChange={setSelectedPeriod}
              options={[
                { value: 'dia', label: 'Hoy' },
                { value: 'semana', label: 'Semana' },
                { value: 'mes', label: 'Mes' },
              ]}
              icon="bi bi-calendar-event"
              className="w-40"
            />
          </div>
          <div className="space-y-3">
            {alerts.map((alert) => {
              const tone = alert.tone === 'warning'
                ? 'bg-status-warning-soft text-status-warning'
                : alert.tone === 'danger'
                  ? 'bg-status-danger-soft text-status-danger'
                  : 'bg-status-info-soft text-brand-secondary';
              return (
                <div key={alert.id} className="rounded-2xl border border-glass-border bg-glass-card-strong px-4 py-3 flex items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span className={`mt-1 inline-flex h-8 w-8 items-center justify-center rounded-xl ${tone}`}>
                      <i className="bi bi-exclamation-lg" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-text-base">{alert.text}</p>
                      <button
                        type="button"
                        onClick={() => navigate(alert.to)}
                        className="text-xs font-semibold text-brand-secondary hover:underline"
                      >
                        {alert.action}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className={`${glassPanel} p-6 space-y-4`}>
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-text-muted">Ultimos reportes</p>
            <p className="text-lg font-semibold text-text-base">Descarga rapida</p>
          </div>
          <div className="space-y-3">
            {lastReports.map((report) => (
              <div key={report.id} className="flex items-center justify-between rounded-2xl border border-glass-border bg-glass-card-strong px-4 py-3 text-sm">
                <div>
                  <p className="font-semibold text-text-base">{report.name}</p>
                  <p className="text-xs text-text-muted">{report.date}</p>
                </div>
                <span className="rounded-full bg-glass-card px-3 py-1 text-xs text-text-muted">{report.type}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <ReportCard
          className="xl:col-span-1"
          title="Ingresos vs Egresos"
          description="Ultimos 6 meses"
          chartConfig={incomeVsExpenseChart}
          chartInitialType="bar"
          chartHeight={320}
        />
        <ReportCard
          className="xl:col-span-1"
          title="Real vs Presupuesto"
          description="Mes en curso"
          chartConfig={realVsBudgetChart}
          chartInitialType="line"
          chartHeight={320}
        />
      </section>
    </div>
  );
};

export default AnalystHomePage;