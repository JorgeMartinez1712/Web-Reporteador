import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { useAuth } from '../../context/AuthContext';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const HomePage = () => {
  const { user } = useAuth();
  const firstName = user?.name?.split(' ')[0] || user?.first_name || 'Recruiter';
  const dateFormatter = new Intl.DateTimeFormat('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const formattedDateRaw = dateFormatter.format(new Date());
  const formattedDate = formattedDateRaw.charAt(0).toUpperCase() + formattedDateRaw.slice(1);

  const mockData = {
    kpis: [
      { id: 'vacancies', label: 'Vacantes Activas', value: 18, badge: '+2 nuevas', caption: 'Distribuidas en 6 áreas' },
      { id: 'candidates', label: 'Total Candidatos', value: 482, caption: 'Acumulado en los últimos 30 días' },
      { id: 'interviews', label: 'Entrevistas Agendadas', value: 11, caption: 'Prioridad para hoy' },
      { id: 'closing', label: 'Tiempo de Cierre', value: '14 días', caption: 'Promedio del último mes' },
    ],
    funnelStages: [
      { label: 'Aplicaciones', value: 245 },
      { label: 'Filtrados', value: 168 },
      { label: 'Entrevistas', value: 97 },
      { label: 'Ofertas', value: 32 },
    ],
    talentSources: [
      { label: 'LinkedIn', value: 62 },
      { label: 'Instagram', value: 38 },
    ],
    recentCandidates: [
      {
        id: 1,
        name: 'Laura Méndez',
        role: 'UX Researcher · Banca Digital',
        source: 'LinkedIn',
        status: 'Nuevo',
        avatar: 'https://i.pravatar.cc/120?img=32',
      },
      {
        id: 2,
        name: 'Carlos Rivas',
        role: 'Data Analyst · Insights',
        source: 'Instagram',
        status: 'En Revisión',
        avatar: 'https://i.pravatar.cc/120?img=12',
      },
      {
        id: 3,
        name: 'Mariana Torres',
        role: 'HR Business Partner · Retail',
        source: 'LinkedIn',
        status: 'Entrevista',
        avatar: 'https://i.pravatar.cc/120?img=48',
      },
      {
        id: 4,
        name: 'Diego Camacho',
        role: 'Fullstack Engineer · Core',
        source: 'Instagram',
        status: 'Nuevo',
        avatar: 'https://i.pravatar.cc/120?img=23',
      },
    ],
  };

  const funnelData = {
    labels: mockData.funnelStages.map((stage) => stage.label),
    datasets: [
      {
        label: 'Candidatos',
        data: mockData.funnelStages.map((stage) => stage.value),
        backgroundColor: ['#8B5CF6', '#6366F1', '#0EA5E9', '#14B8A6'],
        borderRadius: 10,
        barThickness: 24,
      },
    ],
  };

  const funnelOptions = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: { color: '#f5f5f5' },
        grid: { color: 'rgba(255,255,255,0.08)' },
      },
      y: {
        ticks: { color: '#f5f5f5' },
        grid: { display: false },
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#050312',
        padding: 12,
        borderColor: '#1f1b2d',
        borderWidth: 1,
      },
      title: {
        display: true,
        text: 'Embudo de Reclutamiento',
        color: '#f5f5f5',
        font: { size: 16 },
        padding: { bottom: 16 },
      },
    },
  };

  const sourceData = {
    labels: mockData.talentSources.map((source) => source.label),
    datasets: [
      {
        data: mockData.talentSources.map((source) => source.value),
        backgroundColor: ['#0A66C2', '#E1306C'],
        borderWidth: 0,
      },
    ],
  };

  const doughnutOptions = {
    cutout: '70%',
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          color: '#f5f5f5',
          boxWidth: 12,
          padding: 16,
        },
      },
      title: {
        display: true,
        text: 'Origen del Talento',
        color: '#f5f5f5',
        font: { size: 16 },
        padding: { bottom: 16 },
      },
    },
  };

  const statusStyles = {
    Nuevo: 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30',
    'En Revisión': 'bg-amber-500/15 text-amber-300 border border-amber-500/30',
    Entrevista: 'bg-sky-500/15 text-sky-300 border border-sky-500/30',
  };

  const sourceIconMap = {
    LinkedIn: { icon: 'bi-linkedin', color: 'text-[#0A66C2]' },
    Instagram: { icon: 'bi-instagram', color: 'text-[#E1306C]' },
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white px-6 py-8 lg:px-12 space-y-8">
      <header className="space-y-1">
        <p className="text-sm uppercase tracking-[0.3em] text-white/50">Panel de reclutamiento</p>
        <h1 className="text-3xl lg:text-4xl font-semibold">¡Hola, {firstName}! Así va el talento hoy</h1>
        <p className="text-white/60">{formattedDate}</p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {mockData.kpis.map((kpi) => (
          <div key={kpi.id} className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl shadow-lg shadow-[#0b061f]/40">
            <p className="text-sm uppercase tracking-wide text-white/60">{kpi.label}</p>
            <div className="flex items-end justify-between gap-4 mt-3">
              <p className="text-3xl font-semibold">{kpi.value}</p>
              {kpi.badge && (
                <span className="text-xs font-medium px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                  {kpi.badge}
                </span>
              )}
            </div>
            <p className="text-sm text-white/60 mt-3">{kpi.caption}</p>
          </div>
        ))}
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl shadow-lg shadow-[#0b061f]/40 h-[360px]">
          <Bar data={funnelData} options={funnelOptions} />
        </div>
        <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl shadow-lg shadow-[#0b061f]/40 h-[360px] flex flex-col items-center justify-center">
          <div className="w-full max-w-xs">
            <Doughnut data={sourceData} options={doughnutOptions} />
          </div>
          <div className="mt-6 w-full space-y-3">
            {mockData.talentSources.map((source) => (
              <div key={source.label} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: source.label === 'LinkedIn' ? '#0A66C2' : '#E1306C' }}></span>
                  <span className="text-white/70">{source.label}</span>
                </div>
                <span className="text-white font-medium">{source.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl shadow-lg shadow-[#0b061f]/40">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold">Candidatos Recientes</h2>
            <p className="text-white/60">Seguimiento del pipeline actualizado cada hora</p>
          </div>
          <button className="px-4 py-2 text-sm font-medium rounded-full border border-white/20 text-white/80 hover:bg-white/10 transition-colors">
            Ver todos
          </button>
        </div>
        <div className="mt-6 space-y-4">
          {mockData.recentCandidates.map((candidate) => (
            <div key={candidate.id} className="flex items-center justify-between gap-4 bg-white/5 border border-white/10 rounded-2xl p-4">
              <div className="flex items-center gap-4">
                <img src={candidate.avatar} alt={candidate.name} className="w-12 h-12 rounded-full object-cover" />
                <div>
                  <p className="font-medium">{candidate.name}</p>
                  <p className="text-sm text-white/60">{candidate.role}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-white/70 text-sm">
                  <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                    <i className={`bi ${sourceIconMap[candidate.source].icon} ${sourceIconMap[candidate.source].color} text-lg`}></i>
                  </span>
                  <span className="uppercase tracking-wide text-xs">{candidate.source}</span>
                </div>
                <span className={`px-4 py-1.5 text-xs font-semibold rounded-full ${statusStyles[candidate.status] || 'bg-white/10 text-white'}`}>
                  {candidate.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;